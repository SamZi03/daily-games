// SPELLLOCK — game logic. Word data lives in data.js

const MAX_ROUNDS  = 5;
const SAVE_KEY    = 'spellcast_' + getTodayString();
const todaySet    = WORD_SETS[getDailyIndex(WORD_SETS)];

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

let state         = loadState();
let currentInput  = '';
let transitioning = false;

// ============================================
// SOUND EFFECTS (Web Audio API — no files needed)
// ============================================
let audioCtx = null;
function getCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
}

function playTone(freq, duration, type, vol) {
    try {
        const ctx  = getCtx();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type            = type || 'sine';
        gain.gain.setValueAtTime(vol || 0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch(e) {}
}

function playTick()    { playTone(700, 0.06, 'sine', 0.18); }
function playCorrect() {
    playTone(523, 0.12, 'sine', 0.28);
    setTimeout(() => playTone(659, 0.12, 'sine', 0.28), 110);
    setTimeout(() => playTone(784, 0.25, 'sine', 0.28), 220);
}
function playWrong() {
    playTone(280, 0.14, 'sawtooth', 0.22);
    setTimeout(() => playTone(220, 0.22, 'sawtooth', 0.22), 130);
}

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
            btn.className   = 'kb-key' + (key === 'ENTER' || key === '⌫' ? ' wide' : '');
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
    if (state.round >= MAX_ROUNDS) return;

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
// CHECK ANSWER — animates letters then plays sound
// ============================================
function checkAnswer() {
    const target    = todaySet[state.round].word.toLowerCase();
    const correct   = currentInput.toLowerCase() === target;
    const display   = document.getElementById('inputDisplay');
    const resultRow = document.getElementById('resultRow');
    const letters   = currentInput.toUpperCase().split('');

    transitioning       = true;
    display.textContent = '\u00A0';
    display.className   = 'bee-input-display'; // clear any old colour class

    // Reveal each letter one by one with a tick sound
    let i = 0;
    function revealLetter() {
        if (i < letters.length) {
            display.textContent = letters.slice(0, i + 1).join('');
            playTick();
            i++;
            setTimeout(revealLetter, 120);
        } else {
            // All letters shown — pause briefly then show result
            setTimeout(() => {
                display.classList.add(correct ? 'correct' : 'wrong');
                state.answers[state.round] = correct ? 'correct' : 'wrong';

                if (correct) {
                    resultRow.textContent = 'Correct!';
                    playCorrect();
                } else {
                    resultRow.textContent = 'The word was: ' + target.toUpperCase();
                    playWrong();
                }

                saveState(state);
                renderRoundTabs();

                setTimeout(() => {
                    transitioning = false;
                    currentInput  = '';
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
                }, 1500);
            }, 200);
        }
    }
    revealLetter();
}

// ============================================
// UPDATE DISPLAY
// ============================================
function updateDisplay() {
    const el    = document.getElementById('inputDisplay');
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
        btn.className   = 'bee-round-tab';
        btn.textContent = i + 1;
        if      (state.answers[i] === 'correct')               btn.classList.add('correct');
        else if (state.answers[i] === 'wrong')                 btn.classList.add('wrong');
        else if (i === state.round && !state.gameOver)         btn.classList.add('active');
        tabs.appendChild(btn);

        const span = document.createElement('span');
        span.textContent = (i === state.round && !state.gameOver) ? '▼' : '';
        pointer.appendChild(span);
    }
}

function render() {
    renderRoundTabs();

    if (state.gameOver) {
        document.getElementById('speakerBtn').disabled        = true;
        document.getElementById('defBtn').disabled            = true;
        document.getElementById('senBtn').disabled            = true;
        document.getElementById('defText').style.display      = 'none';
        document.getElementById('senText').style.display      = 'none';
        document.getElementById('inputDisplay').textContent   = '\u00A0';
        document.getElementById('keyboard').style.display     = 'none';

        const score = state.answers.filter(a => a === 'correct').length;
        const box   = document.getElementById('resultBox');
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
    const word    = todaySet[state.round].word;
    const blanked = todaySet[state.round].definition.replace(new RegExp(word, 'gi'), '_'.repeat(word.length));
    el.textContent   = blanked;
    el.style.display = 'block';
});

document.getElementById('senBtn').addEventListener('click', () => {
    const el = document.getElementById('senText');
    if (el.style.display === 'block') { el.style.display = 'none'; return; }
    const word     = todaySet[state.round].word;
    const sentence = todaySet[state.round].sentence;
    const blanked  = sentence.replace(new RegExp(word, 'gi'), '_'.repeat(word.length));
    speakWord(sentence);
    el.textContent   = blanked;
    el.style.display = 'block';
});

// ============================================
// INIT
// ============================================
render();
if (!state.gameOver) {
    setTimeout(() => speakWord(todaySet[state.round].word), 600);
}
