// SPELLLOCK — game logic. Word data lives in data.js

const MAX_ROUNDS = 5;
const SAVE_KEY   = 'spellcast_' + getTodayString();

const todaySet = WORD_SETS[getDailyIndex(WORD_SETS)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        round:    0,
        answers:  [null, null, null, null, null],
        gameOver: false
    };
}
function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state        = loadState();
let currentInput = '';
let transitioning = false;

// ============================================
// SPEECH
// ============================================
function speakWord(word) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const utt  = new SpeechSynthesisUtterance(word);
    utt.rate   = 0.82;
    utt.lang   = 'en-GB';
    speechSynthesis.speak(utt);
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
    const kb = document.getElementById('keyboard');
    kb.innerHTML = '';
    KB_ROWS.forEach(row => {
        const rowEl = document.createElement('div');
        rowEl.className = 'kb-row';
        row.forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'kb-key' + (key === 'ENTER' || key === '⌫' ? ' wide' : '');
            btn.textContent = key;
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
    if (state.gameOver || transitioning) return;
    const round = state.round;
    if (round >= MAX_ROUNDS) return;

    if (key === '⌫' || key === 'Backspace') {
        currentInput = currentInput.slice(0, -1);
    } else if (key === 'ENTER' || key === 'Enter') {
        if (currentInput.length === 0) return;
        checkAnswer();
        return;
    } else if (/^[a-zA-Z]$/.test(key)) {
        currentInput += key.toLowerCase();
    }
    updateDisplay();
}

document.addEventListener('keydown', e => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    handleKey(e.key);
});

// ============================================
// CHECK ANSWER
// ============================================
function checkAnswer() {
    const target  = todaySet[state.round].word.toLowerCase();
    const correct = currentInput.toLowerCase() === target;
    const display = document.getElementById('inputDisplay');
    const resultRow = document.getElementById('resultRow');

    display.classList.add(correct ? 'correct' : 'wrong');
    state.answers[state.round] = correct ? 'correct' : 'wrong';

    if (!correct) {
        resultRow.textContent = 'The word was: ' + target.toUpperCase();
    } else {
        resultRow.textContent = 'Correct!';
    }

    saveState(state);
    renderRoundTabs();
    transitioning = true;

    setTimeout(() => {
        transitioning = false;
        currentInput = '';
        resultRow.textContent = '';
        display.classList.remove('correct', 'wrong');

        if (state.round < MAX_ROUNDS - 1) {
            state.round++;
            saveState(state);
            render();
        } else {
            state.gameOver = true;
            saveState(state);
            markGamePlayed('spelllock');
            render();
        }
    }, 1600);
}

// ============================================
// UPDATE DISPLAY
// ============================================
function updateDisplay() {
    const el = document.getElementById('inputDisplay');
    el.textContent = currentInput.toUpperCase() || '\u00A0';
}

// ============================================
// RENDER
// ============================================
function renderRoundTabs() {
    const tabs    = document.getElementById('roundTabs');
    const pointer = document.getElementById('roundPointer');
    tabs.innerHTML    = '';
    pointer.innerHTML = '';

    for (let i = 0; i < MAX_ROUNDS; i++) {
        const btn = document.createElement('button');
        btn.className = 'bee-round-tab';
        btn.textContent = i + 1;
        if (state.answers[i] === 'correct') btn.classList.add('correct');
        else if (state.answers[i] === 'wrong') btn.classList.add('wrong');
        else if (i === state.round && !state.gameOver) btn.classList.add('active');
        tabs.appendChild(btn);

        const span = document.createElement('span');
        span.textContent = (i === state.round && !state.gameOver) ? '▼' : '';
        pointer.appendChild(span);
    }
}

function render() {
    renderRoundTabs();

    if (state.gameOver) {
        document.getElementById('speakerBtn').disabled = true;
        document.getElementById('defBtn').disabled     = true;
        document.getElementById('senBtn').disabled     = true;
        document.getElementById('defText').style.display = 'none';
        document.getElementById('senText').style.display = 'none';
        document.getElementById('inputDisplay').textContent = '\u00A0';
        document.getElementById('keyboard').style.display = 'none';

        const score   = state.answers.filter(a => a === 'correct').length;
        const box     = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className     = score >= 3 ? 'result-box win' : 'result-box lose';
        box.innerHTML     = `
            <h3>${score === 5 ? 'Perfect!' : score >= 3 ? 'Well done!' : 'Better luck tomorrow!'}</h3>
            <p>You spelled <strong>${score} of ${MAX_ROUNDS}</strong> words correctly.</p>
            <div class="bee-final-words">
                ${todaySet.map((w, i) => `
                    <div class="bee-final-row ${state.answers[i] === 'correct' ? 'correct' : 'wrong'}">
                        ${state.answers[i] === 'correct' ? '✓' : '✗'} ${w.word.toUpperCase()}
                    </div>
                `).join('')}
            </div>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        `;
        return;
    }

    // Reset hint panels when round changes
    document.getElementById('defText').style.display = 'none';
    document.getElementById('senText').style.display = 'none';
    document.getElementById('defText').textContent   = '';
    document.getElementById('senText').textContent   = '';

    updateDisplay();
    buildKeyboard();
}

// ============================================
// HINT BUTTONS
// ============================================
document.getElementById('speakerBtn').addEventListener('click', () => {
    if (state.gameOver) return;
    speakWord(todaySet[state.round].word);
});

document.getElementById('defBtn').addEventListener('click', () => {
    const el = document.getElementById('defText');
    if (el.style.display === 'block') { el.style.display = 'none'; return; }
    const word       = todaySet[state.round].word;
    const definition = todaySet[state.round].definition;
    const blanked    = definition.replace(new RegExp(word, 'gi'), '_'.repeat(word.length));
    el.textContent   = blanked;
    el.style.display = 'block';
});

document.getElementById('senBtn').addEventListener('click', () => {
    const el = document.getElementById('senText');
    if (el.style.display === 'block') { el.style.display = 'none'; return; }
    const word     = todaySet[state.round].word;
    const sentence = todaySet[state.round].sentence;
    // Replace the target word with underscores so it can't be read
    const blanked  = sentence.replace(new RegExp(word, 'gi'), '_'.repeat(word.length));
    // Speak the real sentence aloud (that's the point — you hear it, don't read it)
    speakWord(sentence);
    el.textContent   = blanked;
    el.style.display = 'block';
});

// ============================================
// INIT
// ============================================
render();
// Auto-speak first word after a short delay
if (!state.gameOver) {
    setTimeout(() => speakWord(todaySet[state.round].word), 600);
}
