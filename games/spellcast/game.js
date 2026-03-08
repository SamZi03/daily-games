// ============================================
// SPELLING BEE — Word sets (10 days of content)
// Each set has 5 words, easy → hard
// ============================================
const WORD_SETS = [
    [
        { word: 'apple',    definition: 'A round fruit with red, green, or yellow skin.',              sentence: 'She packed an apple in her lunch bag.' },
        { word: 'bridge',   definition: 'A structure built to cross over water or a road.',             sentence: 'The bridge connects the two sides of the river.' },
        { word: 'castle',   definition: 'A large fortified building from the medieval period.',          sentence: 'The tourists climbed to the top of the castle.' },
        { word: 'diamond',  definition: 'A precious gemstone that is extremely hard and clear.',         sentence: 'The ring was set with a sparkling diamond.' },
        { word: 'eclipse',  definition: 'When one object in space blocks light from another.',           sentence: 'The city fell dark during the solar eclipse.' },
    ],
    [
        { word: 'jungle',   definition: 'A thick tropical forest full of plants and animals.',           sentence: 'The explorers made their way through the dense jungle.' },
        { word: 'kettle',   definition: 'A container used for boiling water.',                           sentence: 'She put the kettle on to make a cup of tea.' },
        { word: 'lantern',  definition: 'A portable light enclosed in a transparent case.',              sentence: 'He carried a lantern through the dark cave.' },
        { word: 'marble',   definition: 'A smooth hard stone used in sculpture and building.',           sentence: 'The palace floor was made of polished marble.' },
        { word: 'necklace', definition: 'A piece of jewellery worn around the neck.',                    sentence: 'She received a gold necklace as a birthday gift.' },
    ],
    [
        { word: 'oxygen',   definition: 'A gas that humans and animals need to breathe.',                sentence: 'Trees release oxygen into the atmosphere.' },
        { word: 'phantom',  definition: 'A ghost or something that appears unreal.',                     sentence: 'The villagers spoke of a phantom in the old house.' },
        { word: 'quartz',   definition: 'A hard crystalline mineral found in many rocks.',               sentence: 'The museum displayed a large piece of rose quartz.' },
        { word: 'rhythm',   definition: 'A strong regular pattern of sound or movement.',                sentence: 'The drummer kept a perfect rhythm throughout the song.' },
        { word: 'sphinx',   definition: 'A mythical creature with a human head and a lion body.',        sentence: 'The ancient sphinx stood silently in the desert.' },
    ],
    [
        { word: 'torrent',  definition: 'A strong and fast-moving stream of water.',                     sentence: 'A torrent of rain flooded the narrow street.' },
        { word: 'unicorn',  definition: 'A mythical horse with a single horn on its forehead.',          sentence: 'The child drew a unicorn in her notebook.' },
        { word: 'vortex',   definition: 'A mass of air or water spinning around a central point.',       sentence: 'The leaves spiralled in a tiny vortex of wind.' },
        { word: 'walrus',   definition: 'A large marine mammal known for its long ivory tusks.',         sentence: 'The walrus sunbathed on an ice floe.' },
        { word: 'zealous',  definition: 'Showing great energy or enthusiasm for a cause.',               sentence: 'She was zealous in her efforts to help others.' },
    ],
    [
        { word: 'debris',   definition: 'Scattered pieces of rubbish or the remains of something destroyed.', sentence: 'Workers cleared the debris after the storm.' },
        { word: 'glacier',  definition: 'A slow-moving mass of ice formed from compacted snow.',         sentence: 'The glacier carved the valley over thousands of years.' },
        { word: 'harbour',  definition: 'A sheltered stretch of water where ships can dock.',             sentence: 'Fishing boats filled the harbour at dawn.' },
        { word: 'illusion', definition: 'Something that deceives the eyes or the mind.',                 sentence: 'The magician created the illusion of a floating ball.' },
        { word: 'journal',  definition: 'A personal diary or a regular publication.',                    sentence: 'She wrote in her journal every evening before bed.' },
    ],
    [
        { word: 'labyrinth',definition: 'A complicated network of paths; a maze.',                       sentence: 'They got completely lost in the ancient labyrinth.' },
        { word: 'monarch',  definition: 'A ruler such as a king, queen, or emperor.',                    sentence: 'The monarch addressed the nation in a speech.' },
        { word: 'nocturnal',definition: 'Active at night rather than during the day.',                   sentence: 'Owls are nocturnal birds that hunt in darkness.' },
        { word: 'ominous',  definition: 'Giving the impression that something bad is about to happen.',  sentence: 'Dark ominous clouds gathered on the horizon.' },
        { word: 'perilous', definition: 'Full of danger or risk.',                                       sentence: 'The mountaineers faced a perilous climb.' },
    ],
    [
        { word: 'quarrel',  definition: 'An angry argument or disagreement between people.',             sentence: 'The two neighbours had a quarrel over the fence.' },
        { word: 'reckless', definition: 'Acting without thinking about the consequences.',               sentence: 'His reckless driving caused the accident.' },
        { word: 'serene',   definition: 'Calm, peaceful, and untroubled.',                               sentence: 'The lake looked serene in the early morning light.' },
        { word: 'typhoon',  definition: 'A tropical storm occurring in the western Pacific Ocean.',      sentence: 'The typhoon caused widespread flooding in the region.' },
        { word: 'utmost',   definition: 'Most extreme or greatest in amount or degree.',                 sentence: 'He handled the situation with the utmost care.' },
    ],
    [
        { word: 'vagrant',  definition: 'A person without a settled home or regular work.',              sentence: 'A vagrant slept on the bench in the park.' },
        { word: 'zenith',   definition: 'The highest point; the peak of something.',                     sentence: 'The sun reached its zenith at noon.' },
        { word: 'altitude', definition: 'The height of an object or place above sea level.',             sentence: 'At high altitude, the air becomes much thinner.' },
        { word: 'cascade',  definition: 'A small waterfall or a series of stages.',                      sentence: 'Water fell in a beautiful cascade over the rocks.' },
        { word: 'dexterity',definition: 'Skill in performing tasks with the hands.',                     sentence: 'The surgeon operated with remarkable dexterity.' },
    ],
    [
        { word: 'eloquent', definition: 'Fluent and persuasive in speaking or writing.',                 sentence: 'The lawyer gave an eloquent closing argument.' },
        { word: 'fracture', definition: 'A crack or break in something hard like bone or rock.',         sentence: 'The X-ray revealed a fracture in her wrist.' },
        { word: 'gossamer', definition: 'Something extremely light and delicate.',                       sentence: 'The spider\'s web was as light as gossamer.' },
        { word: 'heirloom', definition: 'A valuable object passed down through generations of a family.',sentence: 'The clock was a family heirloom from her grandfather.' },
        { word: 'intricate',definition: 'Very detailed and complicated in design or structure.',         sentence: 'The jeweller created an intricate pattern on the ring.' },
    ],
    [
        { word: 'jeopardy', definition: 'Danger of loss, harm, or failure.',                            sentence: 'The bad weather put their plans in jeopardy.' },
        { word: 'kaleidoscope', definition: 'A tube producing changing symmetrical patterns of colour.', sentence: 'The kaleidoscope produced beautiful patterns of light.' },
        { word: 'luminous', definition: 'Giving off light; very bright.',                               sentence: 'The luminous stars filled the night sky.' },
        { word: 'metamorphosis', definition: 'A complete change of character, appearance, or form.',    sentence: 'The caterpillar undergoes a metamorphosis into a butterfly.' },
        { word: 'nostalgia',definition: 'A sentimental longing for the past.',                          sentence: 'Looking at old photos filled her with nostalgia.' },
    ],
];

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
    el.textContent   = todaySet[state.round].definition;
    el.style.display = 'block';
});

document.getElementById('senBtn').addEventListener('click', () => {
    const el = document.getElementById('senText');
    if (el.style.display === 'block') { el.style.display = 'none'; return; }
    el.textContent   = todaySet[state.round].sentence;
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
