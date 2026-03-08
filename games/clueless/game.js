// ============================================
// CLUELOCK — game logic
// Data (WORDS, SIMILARITY, CLUES) lives in data.js
// ============================================

const SAVE_KEY  = 'cluelock_' + getTodayString();
const todayWord = WORDS[getDailyIndex(WORDS)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        guesses:    [],
        cluesShown: 0,
        gameOver:   false,
        won:        false,
    };
}
function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state      = loadState();
let latestWord = null;

// ============================================
// SCORING
// ============================================
function scoreToRank(score) {
    if (score >= 100) return 1;
    const t = (99 - score) / 98;
    return Math.round(2 + Math.pow(t, 2.5) * 19998);
}

function getRank(word) {
    const w = word.toLowerCase().trim();
    if (w === todayWord.toLowerCase()) return 1;
    const data = SIMILARITY[todayWord.toLowerCase()] || {};
    if (data[w] !== undefined) return scoreToRank(data[w]);
    return Math.floor(Math.random() * 5000) + 15000;
}

function getRankColor(rank) {
    if (rank <= 1)      return '#55b725';
    if (rank <= 50)     return '#55b725';
    if (rank <= 300)    return '#8dc926';
    if (rank <= 1000)   return '#dac316';
    if (rank <= 4000)   return '#d47a20';
    if (rank <= 10000)  return '#c84020';
    return '#3a8dca';
}

function getRankLabel(rank) {
    if (rank === 1)     return 'Exact!';
    if (rank <= 50)     return 'Scorching';
    if (rank <= 300)    return 'Hot';
    if (rank <= 1000)   return 'Warm';
    if (rank <= 4000)   return 'Lukewarm';
    if (rank <= 10000)  return 'Cold';
    return 'Freezing';
}

function rankToBarWidth(rank) {
    if (rank === 1) return 100;
    const pct = (1 - Math.log(rank) / Math.log(20001)) * 100;
    return Math.max(0, Math.min(100, pct));
}

// ============================================
// DERIVED FORM DETECTION
// ============================================
const ING_WHITELIST = new Set([
    'king','ring','sing','thing','sting','bring','spring','string',
    'swing','wing','ping','fling','cling','sling','ding','ceiling',
    'evening','morning','nothing','something','wedding','pudding',
    'building','boring','caring','during','feeling','meaning',
    'opening','warning','young','long','song','strong','among',
    'wrong','along','belong','lightning','darling','sibling',
]);

const LY_WHITELIST = new Set([
    'fly','ally','belly','bully','early','family','holy','jelly',
    'lily','only','reply','supply','ugly','woolly','rally','tally',
    'daily','italy','oily',
]);

const ED_WHITELIST = new Set([
    'red','bed','led','fed','wed','shed','sped','bred','weed',
    'seed','speed','need','greed','freed','creed','breed','indeed',
    'treed','proceed','agreed','exceed',
]);

function isDerivedForm(word) {
    if (word.length > 4 && word.endsWith('ing') && !ING_WHITELIST.has(word)) return true;
    if (word.length > 3 && word.endsWith('ly')  && !LY_WHITELIST.has(word))  return true;
    if (word.length > 4 && word.endsWith('ed')  && !ED_WHITELIST.has(word))  return true;
    return false;
}

// ============================================
// DICTIONARY VALIDATION
// ============================================
const validWordCache   = new Set();
const invalidWordCache = new Set();

async function isRealWord(word) {
    if (validWordCache.has(word))   return true;
    if (invalidWordCache.has(word)) return false;
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (res.ok) { validWordCache.add(word);   return true; }
        else        { invalidWordCache.add(word); return false; }
    } catch { return true; }
}

// ============================================
// SUBMIT
// ============================================
let submitting = false;

async function submitGuess() {
    if (state.gameOver || submitting) return;
    const input = document.getElementById('guessInput');
    const raw = input.value.trim();
    if (!raw) return;
    if (!/^[a-zA-Z]+$/.test(raw)) { showMessage('Single words only please'); return; }
    if (raw.length < 2)            { showMessage('Word too short'); return; }
    const word = raw.toLowerCase();
    if (state.guesses.find(g => g.word === word)) {
        showMessage('Already guessed!');
        input.value = '';
        return;
    }

    submitting = true;
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    showMessage('Checking...');

    const real = await isRealWord(word);
    submitting   = false;
    btn.disabled = false;

    if (!real) { showMessage('Not a real word!'); return; }
    if (isDerivedForm(word)) { showMessage('Root words only — try the base form!'); return; }

    showMessage('');
    const rank = getRank(word);
    state.guesses.push({ word, rank });
    latestWord = word;

    if (rank === 1) {
        state.gameOver = true;
        state.won      = true;
        markGamePlayed('cluelock');
    }

    input.value = '';
    saveState(state);
    render();

    setTimeout(() => {
        const rows = document.querySelectorAll('.cl-guess-row');
        if (rows.length) rows[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
}

document.getElementById('submitBtn').addEventListener('click', submitGuess);
document.getElementById('guessInput').addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(); });

function showMessage(msg) {
    const el = document.getElementById('clMessage');
    el.textContent = msg;
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 1800);
}

// ============================================
// CLUES
// ============================================
function revealClue() {
    const wordClues = CLUES[todayWord.toLowerCase()] || [];
    if (state.cluesShown >= wordClues.length) return;
    state.cluesShown++;
    saveState(state);
    renderClues();
}

function renderClues() {
    const wordClues = CLUES[todayWord.toLowerCase()] || [];
    const listEl    = document.getElementById('clueList');
    const btn       = document.getElementById('clueBtn');
    if (!listEl || !btn) return;

    listEl.innerHTML = '';
    for (let i = 0; i < state.cluesShown; i++) {
        const el = document.createElement('p');
        el.className  = 'cl-clue-item';
        el.textContent = `Clue ${i + 1}: ${wordClues[i]}`;
        listEl.appendChild(el);
    }

    const allShown = wordClues.length > 0 && state.cluesShown >= wordClues.length;
    if (allShown || state.gameOver) {
        btn.style.display = 'none';
    } else {
        btn.style.display = '';
        btn.textContent   = `💡 Reveal Clue ${state.cluesShown + 1}`;
    }
}

document.getElementById('clueBtn').addEventListener('click', revealClue);

// ============================================
// RENDER
// ============================================
function render() {
    renderClues();
    const n = state.guesses.length;
    document.getElementById('guessCountDisplay').textContent = n === 1 ? '1 guess' : `${n} guesses`;

    const bestEl = document.getElementById('bestScoreDisplay');
    if (n > 0 && !state.won) {
        const bestRank = state.guesses.reduce((min, g) => Math.min(min, g.rank), Infinity);
        bestEl.textContent = `Best: #${bestRank.toLocaleString()} — ${getRankLabel(bestRank)}`;
        bestEl.style.color = getRankColor(bestRank);
    } else {
        bestEl.textContent = '';
    }

    const sorted = [...state.guesses].sort((a, b) => a.rank - b.rank);
    const listEl = document.getElementById('clGuesses');
    listEl.innerHTML = '';

    sorted.forEach(g => {
        const row      = document.createElement('div');
        row.className  = 'cl-guess-row' + (g.word === latestWord ? ' cl-new' : '');
        const color    = getRankColor(g.rank);
        const barWidth = rankToBarWidth(g.rank);
        const label    = getRankLabel(g.rank);
        row.innerHTML  = `
            <div class="cl-word">${g.word}</div>
            <div class="cl-bar-wrap">
                <div class="cl-bar-fill" style="width:${barWidth}%;background:${color}"></div>
            </div>
            <div class="cl-score" style="color:${color}">#${g.rank.toLocaleString()}</div>
            <div class="cl-label">${label}</div>
        `;
        listEl.appendChild(row);
    });

    if (state.gameOver) {
        document.getElementById('inputSection').style.display = 'none';
        document.getElementById('clMessage').textContent = '';
        const box      = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className  = 'result-box win';
        box.innerHTML  = `
            <h3>You found it! 🎉</h3>
            <p>The mystery word was:</p>
            <p class="answer-reveal">${todayWord.toUpperCase()}</p>
            <p style="color:var(--muted);font-size:14px;">Found in <strong style="color:var(--text)">${state.guesses.length}</strong> guess${state.guesses.length !== 1 ? 'es' : ''}</p>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        `;
    }
}

render();
