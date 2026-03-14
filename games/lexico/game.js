// ============================================
// LEXICO — Wordle-style, 3-7 letter words
// ============================================
const WORDS = {
    3: ['cat','sun','hat','big','red','hot','cup','map','sky','fly','run','bug','dog','ear','jar','old','new','age','art','sea','ice','box','leg','arm','lip','tip','hop','cut','mud','fog','gem'],
    4: ['fire','moon','wind','star','gold','salt','boat','gate','bird','fish','rock','tree','dust','foam','hill','rain','snow','leaf','sand','wave','mist','dawn','dusk','glow','haze','peak','reef','rust','fern','cove'],
    5: ['ocean','bread','cloud','dance','flame','grace','music','smile','think','happy','sugar','storm','dream','light','night','river','stone','tower','voice','world','bloom','crisp','faith','giant','honor','ivory','jewel','karma','lemon','maple'],
    6: ['summer','bridge','flower','garden','silver','castle','forest','window','strong','gentle','autumn','butter','camera','danger','empire','fabric','hollow','island','jungle','kernel','launch','mirror','narrow','oyster','palace','quartz','rabbit','savage','temple','goblin'],
    7: ['journey','rainbow','thunder','crystal','shelter','morning','weather','diamond','mystery','balance','capture','delight','elegant','fashion','granite','harvest','imagine','jealous','kitchen','measure','nowhere','perfect','quarter','rescued','serpent','triumph','uniform','vibrant','wrapper','blossom'],
};

const LENGTHS      = [3, 4, 5, 6, 7];
const MAX_GUESSES  = 6;

let VALID_WORDS = null;
let validating  = false;

fetch('words.txt')
    .then(r => r.text())
    .then(txt => {
        VALID_WORDS = new Set(
            txt.split(/[\s,]+/).map(w => w.trim().toLowerCase()).filter(w => w.length >= 3)
        );
    });

async function checkAndSubmit(word) {
    const w = word.toLowerCase();
    // Fast path — word is in local list
    if (VALID_WORDS && VALID_WORDS.has(w)) { submitGuess(); return; }
    // Slow path — check Free Dictionary API
    validating = true;
    showMessage('Checking...');
    let valid = false;
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`);
        valid = res.ok;
    } catch {
        valid = !VALID_WORDS; // local list not loaded yet — allow; loaded but word absent — reject
    }
    validating = false;
    if (!valid) { showMessage('Not a real word'); return; }
    showMessage('');
    submitGuess();
}

// ============================================
// AUDIO
// ============================================
let audioCtx = null;
function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}
function playTone(freq, dur, type, vol) {
    try {
        const ctx = getCtx(), osc = ctx.createOscillator(), gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = freq; osc.type = type || 'sine';
        gain.gain.setValueAtTime(vol || 0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
        osc.start(); osc.stop(ctx.currentTime + dur);
    } catch(e) {}
}
function playKey()       { playTone(600, 0.05, 'sine', 0.15); }
function playBack()      { playTone(300, 0.06, 'sine', 0.12); }
function playFlipTick()  { playTone(700, 0.06, 'sine', 0.18); }
function playCorrect() {
    try {
        const ctx  = getCtx();
        const now  = ctx.currentTime;
        [[880,0],[1108,0.04],[1318,0.1]].forEach(([freq, delay]) => {
            const osc = ctx.createOscillator(), gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine'; osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.28, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 1.2);
            osc.start(now + delay); osc.stop(now + delay + 1.3);
        });
    } catch(e) {}
}
function playWrong()     {
    playTone(280, 0.14, 'sawtooth', 0.2);
    setTimeout(() => playTone(220, 0.2, 'sawtooth', 0.2), 120);
}

let activeLen = 5;
let states    = {};

// Load or init state for each length
LENGTHS.forEach(len => {
    const key = `lexico_${getTodayString()}_${len}`;
    states[len] = JSON.parse(localStorage.getItem(key) || 'null') || {
        guesses:      [],   // [{ word, result: ['correct'|'present'|'absent'] }]
        currentGuess: '',
        gameOver:     false,
        won:          false,
    };
});

function saveState(len) {
    localStorage.setItem(`lexico_${getTodayString()}_${len}`, JSON.stringify(states[len]));
}

function getTodayWord(len) {
    return WORDS[len][getDailyIndex(WORDS[len])];
}

// ============================================
// GUESS CHECKING
// ============================================
function checkGuess(guess, target) {
    const result    = Array(target.length).fill('absent');
    const targetArr = target.split('');
    const guessArr  = guess.split('');

    // First pass: correct position
    for (let i = 0; i < target.length; i++) {
        if (guessArr[i] === targetArr[i]) {
            result[i]    = 'correct';
            targetArr[i] = null;
            guessArr[i]  = null;
        }
    }
    // Second pass: present (wrong position)
    for (let i = 0; i < target.length; i++) {
        if (guessArr[i] && targetArr.includes(guessArr[i])) {
            result[i] = 'present';
            targetArr[targetArr.indexOf(guessArr[i])] = null;
        }
    }
    return result;
}

function getKeyStates(len) {
    const keyState = {};
    states[len].guesses.forEach(g => {
        g.result.forEach((r, i) => {
            const letter  = g.word[i];
            const current = keyState[letter];
            if (r === 'correct') keyState[letter] = 'correct';
            else if (r === 'present' && current !== 'correct') keyState[letter] = 'present';
            else if (r === 'absent'  && !current)              keyState[letter] = 'absent';
        });
    });
    return keyState;
}

// ============================================
// KEYBOARD
// ============================================
const KB_ROWS = [
    ['Q','W','E','R','T','Y','U','I','O','P'],
    ['A','S','D','F','G','H','J','K','L'],
    ['ENTER','Z','X','C','V','B','N','M','⌫'],
];

function buildKeyboard() {
    const kb        = document.getElementById('keyboard');
    const keyStates = getKeyStates(activeLen);
    kb.innerHTML = '';

    KB_ROWS.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-row';
        row.forEach(key => {
            const btn       = document.createElement('button');
            btn.className   = 'kb-key' + (key === 'ENTER' || key === '⌫' ? ' wide' : '');
            btn.textContent = key;
            const ks = keyStates[key.toLowerCase()];
            if (ks) btn.classList.add(ks);
            btn.addEventListener('click', () => handleKey(key));
            rowEl.appendChild(btn);
        });
        kb.appendChild(rowEl);
    });
}

// ============================================
// KEY HANDLING
// ============================================
function handleKey(key) {
    const s = states[activeLen];
    if (s.gameOver || validating) return;

    if (key === '⌫' || key === 'Backspace') {
        s.currentGuess = s.currentGuess.slice(0, -1);
        playBack();
        saveState(activeLen);
        renderGrid();
    } else if (key === 'ENTER' || key === 'Enter') {
        if (s.currentGuess.length !== activeLen) {
            showMessage('Word must be ' + activeLen + ' letters');
            return;
        }
        checkAndSubmit(s.currentGuess);
    } else if (/^[a-zA-Z]$/.test(key)) {
        if (s.currentGuess.length < activeLen) {
            s.currentGuess += key.toLowerCase();
            playKey();
            saveState(activeLen);
            renderGrid();
        }
    }
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    handleKey(e.key);
});

// ============================================
// SUBMIT
// ============================================

function submitGuess() {
    const s      = states[activeLen];
    const target = getTodayWord(activeLen);
    const guess  = s.currentGuess;
    const result = checkGuess(guess, target);
    const rowIdx = s.guesses.length;

    s.guesses.push({ word: guess, result });
    s.currentGuess = '';

    if (guess === target) { s.gameOver = true; s.won = true; }
    else if (s.guesses.length >= MAX_GUESSES) { s.gameOver = true; s.won = false; }

    saveState(activeLen);

    // Render grid (letters + colours applied), then strip colours to animate them in
    renderGrid();
    const grid  = document.getElementById('lexicoGrid');
    const cells = [...grid.children].slice(rowIdx * activeLen, (rowIdx + 1) * activeLen);

    // Remove colours so cells show letter only — colour revealed during flip
    cells.forEach(cell => cell.classList.remove('correct', 'present', 'absent'));

    cells.forEach((cell, i) => {
        setTimeout(() => {
            cell.classList.add('flipping');
            playFlipTick();
            setTimeout(() => {
                cell.classList.remove('flipping');
                cell.classList.add(result[i]);
            }, 150);
        }, i * 300);
    });

    const totalDelay = cells.length * 300 + 150;
    setTimeout(() => {
        if (s.won) playCorrect();
        else if (s.gameOver) playWrong();
        if (s.gameOver && LENGTHS.every(l => states[l].gameOver)) markGamePlayed('lexilock');
        render();
    }, totalDelay);
}

function showMessage(msg) {
    const el = document.getElementById('lexicoMsg');
    el.textContent = msg;
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 1800);
}

// ============================================
// RENDER
// ============================================
function switchLength(len) {
    activeLen = len;
    render();
}

function renderTabs() {
    const tabs = document.getElementById('lengthTabs');
    tabs.innerHTML = '';
    LENGTHS.forEach(len => {
        const btn       = document.createElement('button');
        btn.className   = 'lexico-tab';
        btn.textContent = len;
        const s = states[len];
        if (len === activeLen)         btn.classList.add('active');
        else if (s.gameOver && s.won)  btn.classList.add('done-correct');
        else if (s.gameOver && !s.won) btn.classList.add('done-wrong');
        btn.addEventListener('click', () => switchLength(len));
        tabs.appendChild(btn);
    });
}

function renderGrid() {
    const s      = states[activeLen];
    const len    = activeLen;
    const grid   = document.getElementById('lexicoGrid');
    grid.style.gridTemplateColumns = `repeat(${len}, 44px)`;
    grid.innerHTML = '';

    for (let row = 0; row < MAX_GUESSES; row++) {
        for (let col = 0; col < len; col++) {
            const cell       = document.createElement('div');
            cell.className   = 'lexico-cell';

            if (row < s.guesses.length) {
                cell.textContent = s.guesses[row].word[col].toUpperCase();
                cell.classList.add(s.guesses[row].result[col]);
            } else if (row === s.guesses.length && !s.gameOver) {
                if (col < s.currentGuess.length) {
                    cell.textContent = s.currentGuess[col].toUpperCase();
                    cell.classList.add('active');
                }
            }
            grid.appendChild(cell);
        }
    }
}

function renderResult() {
    const s      = states[activeLen];
    const target = getTodayWord(activeLen);
    const box    = document.getElementById('resultBox');

    if (!s.gameOver) {
        box.style.display = 'none';
        return;
    }

    box.style.display = 'block';
    box.className     = `result-box ${s.won ? 'win' : 'lose'}`;

    const allDone  = LENGTHS.every(l => states[l].gameOver);
    const score    = LENGTHS.filter(l => states[l].won).length;
    const extra    = allDone
        ? `<p style="margin-top:12px; color:var(--muted);">Total score: ${score}/${LENGTHS.length}</p>
           <a href="../../index.html" class="back-home-btn">Back to Games</a>`
        : '';

    box.innerHTML = s.won
        ? `<h3>Nice one!</h3>
           <p>Got the ${len}-letter word in <strong>${s.guesses.length}</strong> guess${s.guesses.length !== 1 ? 'es' : ''}!</p>
           <p class="answer-reveal">${target.toUpperCase()}</p>${extra}`
        : `<h3>The word was:</h3>
           <p class="answer-reveal">${target.toUpperCase()}</p>${extra}`;
}

function render() {
    renderTabs();
    renderGrid();
    buildKeyboard();
    renderResult();
}

render();
