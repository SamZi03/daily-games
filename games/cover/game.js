// LENSLOCK — 3-tab image guessing game
// Tab 0: Cover (album art)  Tab 1: Flag  Tab 2: Logo
// Data lives in data.js

const TODAY       = getTodayString();
const MAX_TRIES   = 5;
const BLUR_LEVELS = [18, 13, 9, 5, 2, 0]; // index = attempt number (0–4 in-game, 5 = game over)

// ============================================
// TAB CONFIG
// ============================================
const ANSWERS = [
    COVER_SONGS[getDailyIndex(COVER_SONGS)],
    FLAG_COUNTRIES[getDailyIndex(FLAG_COUNTRIES)],
    LOGO_BRANDS[getDailyIndex(LOGO_BRANDS)],
];

const TAB_LABELS = ['Cover', 'Flag', 'Logo'];
const TAB_IDS    = ['cover', 'flag', 'logo'];

// Per-tab runtime data (populated at init)
// {imgUrl, extraData, acList}
const tabRuntime = [
    {imgUrl: null, extraData: null, acList: [...new Set(COVER_SONGS.map(s => s.artist))]},
    {imgUrl: `https://flagcdn.com/w640/${ANSWERS[1].code}.png`, extraData: null,
     acList: FLAG_COUNTRIES.map(c => c.name)},
    {imgUrl: `https://logo.clearbit.com/${ANSWERS[2].domain}`, extraData: null,
     acList: LOGO_BRANDS.map(b => b.name)},
];

// ============================================
// STATE
// ============================================
function makeKey(i) { return `lenslock_${TAB_IDS[i]}_${TODAY}`; }
function loadState(i) {
    return JSON.parse(localStorage.getItem(makeKey(i)) || 'null') ||
        {attempt: 0, guesses: [], gameOver: false, won: false};
}
function saveState(i) { localStorage.setItem(makeKey(i), JSON.stringify(states[i])); }

const states = [loadState(0), loadState(1), loadState(2)];

let activeTab = 0;

// ============================================
// DOM REFS
// ============================================
const imageWrap    = document.getElementById('imageWrap');
const cluesEl      = document.getElementById('coverClues');
const dotsEl       = document.getElementById('attemptsDisplay');
const guessesList  = document.getElementById('guessesList');
const inputSection = document.getElementById('inputSection');
const resultBox    = document.getElementById('resultBox');
const guessInput   = document.getElementById('guessInput');
const acDrop       = document.getElementById('autocomplete');

// ============================================
// TAB BAR
// ============================================
function buildTabBar() {
    const bar = document.getElementById('lenstabBar');
    TAB_LABELS.forEach((label, i) => {
        const btn = document.createElement('button');
        btn.className = 'lenslock-tab';
        btn.textContent = label;
        btn.addEventListener('click', () => switchTab(i));
        bar.appendChild(btn);
    });
}

function updateTabStyles() {
    document.querySelectorAll('.lenslock-tab').forEach((btn, i) => {
        btn.classList.remove('active', 'done-correct', 'done-wrong');
        if (i === activeTab) btn.classList.add('active');
        const s = states[i];
        if (s.gameOver) btn.classList.add(s.won ? 'done-correct' : 'done-wrong');
    });
}

function switchTab(i) {
    acDrop.innerHTML = '';
    guessInput.value = '';
    acIndex = -1;
    activeTab = i;
    updateTabStyles();
    renderTabContent();
}

// ============================================
// FETCH COVER DATA (Tab 0 only)
// ============================================
async function fetchCoverData(song) {
    try {
        const q   = encodeURIComponent(`${song.title} ${song.artist}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=5`);
        const data = await res.json();
        const match = data.results.find(r =>
            r.trackName.toLowerCase().includes(song.title.toLowerCase())
        ) || data.results[0];
        if (!match) return null;
        return {
            artworkUrl: match.artworkUrl100.replace('100x100', '600x600'),
            genre:      match.primaryGenreName,
            year:       new Date(match.releaseDate).getFullYear().toString(),
            artist:     match.artistName,
            trackName:  match.trackName,
            previewUrl: match.previewUrl || null,
        };
    } catch { return null; }
}

// ============================================
// RENDER IMAGE
// ============================================
function renderImage() {
    const s   = states[activeTab];
    const rt  = tabRuntime[activeTab];
    const url = (activeTab === 0 && rt.extraData) ? rt.extraData.artworkUrl :
                activeTab === 0 ? null : rt.imgUrl;

    if (!url) {
        imageWrap.innerHTML = '<div class="cover-placeholder">?</div>';
        return;
    }

    const blur = s.gameOver ? 0 : BLUR_LEVELS[Math.min(s.attempt, BLUR_LEVELS.length - 1)];
    const cls  = activeTab === 1 ? 'lenslock-flag-img' : 'cover-image';

    imageWrap.innerHTML = `<img class="${cls}" id="mainImg" src="${url}" alt="">`;
    const img = document.getElementById('mainImg');
    img.style.filter = `blur(${blur}px)`;

    // If image fails to load show placeholder
    img.onerror = () => { imageWrap.innerHTML = '<div class="cover-placeholder">?</div>'; };
}

function updateBlur() {
    const img = document.getElementById('mainImg');
    if (!img) return;
    const s    = states[activeTab];
    const blur = s.gameOver ? 0 : BLUR_LEVELS[Math.min(s.attempt, BLUR_LEVELS.length - 1)];
    img.style.filter = `blur(${blur}px)`;
}

// ============================================
// RENDER HINTS (clue pills)
// ============================================
function renderHints() {
    cluesEl.innerHTML = '';
    const s   = states[activeTab];
    const ans = ANSWERS[activeTab];
    const rt  = tabRuntime[activeTab];

    if (activeTab === 0) {
        // Cover: genre → year
        const data = rt.extraData;
        if (!data) return;
        if (s.attempt >= 1 || s.gameOver) addPill(data.genre, s.attempt === 1 && !s.gameOver);
        if (s.attempt >= 2 || s.gameOver) addPill(data.year,  s.attempt === 2 && !s.gameOver);
    } else if (activeTab === 1) {
        // Flag: continent → region
        if (s.attempt >= 1 || s.gameOver) addPill(ans.continent, s.attempt === 1 && !s.gameOver);
        if (s.attempt >= 2 || s.gameOver) addPill(ans.region,    s.attempt === 2 && !s.gameOver);
    } else {
        // Logo: category → letter count
        if (s.attempt >= 1 || s.gameOver) addPill(ans.category,              s.attempt === 1 && !s.gameOver);
        if (s.attempt >= 2 || s.gameOver) addPill(`${ans.name.length} letters`, s.attempt === 2 && !s.gameOver);
    }
}

function addPill(text, isNew) {
    const pill = document.createElement('span');
    pill.className = 'cover-clue-pill' + (isNew ? ' new' : '');
    pill.textContent = text;
    cluesEl.appendChild(pill);
}

// ============================================
// RENDER ATTEMPT DOTS
// ============================================
function renderDots() {
    const s = states[activeTab];
    dotsEl.innerHTML = '';
    for (let i = 0; i < MAX_TRIES; i++) {
        const dot = document.createElement('div');
        dot.className = 'attempt-dot';
        if (i < s.guesses.length) {
            const g = s.guesses[i];
            dot.classList.add(g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong');
            dot.textContent = g.correct ? '✓' : g.skipped ? '–' : '✗';
        }
        dotsEl.appendChild(dot);
    }
}

// ============================================
// RENDER GUESS HISTORY
// ============================================
function renderGuesses() {
    const s = states[activeTab];
    guessesList.innerHTML = '';
    s.guesses.forEach(g => {
        const el = document.createElement('div');
        el.className = `guess-item ${g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong'}`;
        el.textContent = g.text;
        guessesList.appendChild(el);
    });
}

// ============================================
// RESULT SCREEN
// ============================================
function renderResult() {
    inputSection.style.display = 'none';
    resultBox.style.display    = 'block';

    const s   = states[activeTab];
    const ans = ANSWERS[activeTab];
    const rt  = tabRuntime[activeTab];

    let detailHTML = '';
    let playerHTML = '';

    if (activeTab === 0 && rt.extraData) {
        const d = rt.extraData;
        detailHTML = `<p class="cover-result-track">${d.trackName}</p>`;
        if (d.previewUrl) {
            playerHTML = `
                <div class="cover-preview-player">
                    <audio id="coverAudio" src="${d.previewUrl}" preload="auto"></audio>
                    <button class="cover-play-btn" id="coverPlayBtn">▶ Play Preview</button>
                </div>`;
        }
    } else if (activeTab === 1) {
        detailHTML = `<p class="cover-result-track">${ans.region}</p>`;
    } else {
        detailHTML = `<p class="cover-result-track">${ans.category}</p>`;
    }

    const answerName = activeTab === 0 ? ans.artist : ans.name;

    resultBox.className = `result-box ${s.won ? 'win' : 'lose'}`;
    resultBox.innerHTML = s.won
        ? `<h3>Got it!</h3>
           <p>You identified it in <strong>${s.attempt}</strong> guess${s.attempt !== 1 ? 'es' : ''}!</p>
           <p class="answer-reveal">${answerName}</p>
           ${detailHTML}${playerHTML}
           <a href="../../index.html" class="back-home-btn">Back to Games</a>`
        : `<h3>Better luck tomorrow!</h3>
           <p>The answer was:</p>
           <p class="answer-reveal">${answerName}</p>
           ${detailHTML}${playerHTML}
           <a href="../../index.html" class="back-home-btn">Back to Games</a>`;

    if (activeTab === 0 && rt.extraData && rt.extraData.previewUrl) {
        const audio   = document.getElementById('coverAudio');
        const playBtn = document.getElementById('coverPlayBtn');
        audio.volume = 0.26;
        audio.play().catch(() => {});
        playBtn.addEventListener('click', () => {
            if (audio.paused) { audio.play(); playBtn.textContent = '⏸ Pause'; }
            else { audio.pause(); playBtn.textContent = '▶ Play Preview'; }
        });
        audio.addEventListener('play',  () => { playBtn.textContent = '⏸ Pause'; });
        audio.addEventListener('pause', () => { playBtn.textContent = '▶ Play Preview'; });
        audio.addEventListener('ended', () => { playBtn.textContent = '▶ Play Preview'; });
    }
}

// ============================================
// FULL TAB RENDER
// ============================================
function renderTabContent() {
    const s = states[activeTab];
    renderImage();
    renderHints();
    renderDots();
    renderGuesses();

    if (s.gameOver) {
        renderResult();
    } else {
        inputSection.style.display = 'block';
        resultBox.style.display    = 'none';
        resultBox.innerHTML        = '';
    }

    // Placeholder text
    const placeholders = ['Type an artist name...', 'Type a country name...', 'Type a brand name...'];
    guessInput.placeholder = placeholders[activeTab];
}

// ============================================
// AUTOCOMPLETE
// ============================================
let acIndex = -1;

function acSetIndex(i) {
    const items = acDrop.querySelectorAll('.autocomplete-item');
    items.forEach(el => el.classList.remove('active'));
    acIndex = Math.max(-1, Math.min(i, items.length - 1));
    if (acIndex >= 0) items[acIndex].classList.add('active');
}

guessInput.addEventListener('input', () => {
    const val = guessInput.value.toLowerCase().trim();
    acDrop.innerHTML = '';
    acIndex = -1;
    if (!val) return;
    const list = tabRuntime[activeTab].acList;
    list.filter(x => x.toLowerCase().includes(val)).slice(0, 7).forEach(name => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = name;
        item.addEventListener('click', () => {
            guessInput.value = name;
            acDrop.innerHTML = '';
            acIndex = -1;
        });
        acDrop.appendChild(item);
    });
});

guessInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); acSetIndex(acIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); acSetIndex(acIndex - 1); }
    else if (e.key === 'Enter') {
        const active = acDrop.querySelector('.autocomplete-item.active');
        if (active) { e.preventDefault(); guessInput.value = active.textContent; acDrop.innerHTML = ''; acIndex = -1; }
        else submitGuess(false);
    }
});

document.addEventListener('click', e => {
    if (!guessInput.contains(e.target) && !acDrop.contains(e.target)) {
        acDrop.innerHTML = '';
        acIndex = -1;
    }
});

// ============================================
// SUBMIT GUESS
// ============================================
function checkCorrect(raw) {
    const ans = ANSWERS[activeTab];
    if (activeTab === 0) return raw.toLowerCase().includes(ans.artist.toLowerCase());
    return raw.toLowerCase() === ans.name.toLowerCase();
}

function submitGuess(skipped) {
    const s = states[activeTab];
    if (s.gameOver) return;
    const raw = guessInput.value.trim();
    if (!skipped && !raw) return;

    const correct = !skipped && checkCorrect(raw);
    s.guesses.push({text: skipped ? '(skipped)' : raw, correct, skipped});
    s.attempt++;

    if (correct || s.attempt >= MAX_TRIES) {
        s.gameOver = true;
        s.won      = correct;
        updateBlur();
        // Mark played only when all 3 tabs done
        if (states.every(st => st.gameOver)) markGamePlayed('coverlock');
    }

    guessInput.value = '';
    acDrop.innerHTML = '';
    saveState(activeTab);
    updateTabStyles();
    renderTabContent();
}

document.getElementById('submitBtn').addEventListener('click', () => submitGuess(false));
document.getElementById('skipBtn').addEventListener('click',   () => submitGuess(true));
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter' && acIndex < 0) submitGuess(false); });

// ============================================
// BOOT
// ============================================
buildTabBar();

// Fetch Cover artwork async, then re-render tab 0 if active
fetchCoverData(ANSWERS[0]).then(data => {
    tabRuntime[0].extraData = data;
    if (data) tabRuntime[0].imgUrl = data.artworkUrl;
    if (activeTab === 0) renderTabContent();
});

// Start on tab 0
switchTab(0);
