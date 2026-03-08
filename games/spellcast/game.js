// ============================================
// SPELLING BEE — Word sets (10 days of content)
// Each set has 5 words, easy → hard
// ============================================
// Each set: Round 1 = very easy, Round 2 = easy, Round 3 = medium, Round 4 = hard, Round 5 = very hard
const WORD_SETS = [
    [
        { word: 'bird',       definition: 'A feathered animal that usually flies.',                          sentence: 'A bird landed on the branch outside the window.' },
        { word: 'cloud',      definition: 'A visible mass of water droplets floating in the sky.',           sentence: 'A large cloud blocked the sun on a warm afternoon.' },
        { word: 'bridge',     definition: 'A structure built to cross over water or a road.',                sentence: 'The bridge connects the two sides of the river.' },
        { word: 'captain',    definition: 'The person in charge of a ship, aircraft, or sports team.',       sentence: 'The captain steered the ship through the rough sea.' },
        { word: 'eclipse',    definition: 'When one object in space blocks the light from another.',         sentence: 'The city fell dark during the solar eclipse.' },
    ],
    [
        { word: 'fish',       definition: 'A cold-blooded animal that lives in water and has fins.',         sentence: 'She caught a fish from the river on a sunny day.' },
        { word: 'storm',      definition: 'A period of bad weather with strong winds and heavy rain.',        sentence: 'The storm knocked over several trees in the park.' },
        { word: 'castle',     definition: 'A large fortified building from the medieval period.',             sentence: 'The tourists climbed to the top of the castle.' },
        { word: 'dolphin',    definition: 'An intelligent sea mammal known for leaping out of the water.',   sentence: 'A dolphin swam alongside the boat out at sea.' },
        { word: 'pharmacy',   definition: 'A shop where medicines and health products are sold.',             sentence: 'She picked up her prescription from the pharmacy.' },
    ],
    [
        { word: 'jump',       definition: 'To push yourself off the ground and into the air.',               sentence: 'The children jump on the trampoline in the garden.' },
        { word: 'honey',      definition: 'A sweet, sticky food made by bees.',                              sentence: 'She spread honey on her toast every morning.' },
        { word: 'jungle',     definition: 'A thick tropical forest full of plants and animals.',              sentence: 'The explorers made their way through the dense jungle.' },
        { word: 'champion',   definition: 'A person who has won a competition or contest.',                   sentence: 'She trained every day to become a champion.' },
        { word: 'orchestra',  definition: 'A large group of musicians who play different instruments together.',sentence: 'The orchestra performed to a full audience.' },
    ],
    [
        { word: 'snow',       definition: 'Frozen water that falls from the sky in soft white flakes.',       sentence: 'Snow covered the ground overnight in winter.' },
        { word: 'light',      definition: 'The energy that allows us to see things around us.',               sentence: 'The light in the room made it easier to read.' },
        { word: 'garden',     definition: 'An area of land used for growing plants and flowers.',              sentence: 'She spent the afternoon working in the garden.' },
        { word: 'elephant',   definition: 'The largest land animal, with a long trunk and big ears.',         sentence: 'An elephant splashed water with its trunk at the zoo.' },
        { word: 'necessary',  definition: 'Something that must be done or is very important.',                sentence: 'It is necessary to drink water to stay healthy.' },
    ],
    [
        { word: 'road',       definition: 'A long hard surface built for vehicles and people to travel on.',  sentence: 'The road was quiet early on Sunday morning.' },
        { word: 'apple',      definition: 'A round fruit with red, green, or yellow skin.',                   sentence: 'She packed an apple in her lunch bag.' },
        { word: 'silver',     definition: 'A shiny grey-white precious metal used in jewellery and coins.',   sentence: 'The trophy was made of polished silver.' },
        { word: 'umbrella',   definition: 'A folding device held over your head to keep off rain.',           sentence: 'She grabbed her umbrella before leaving the house.' },
        { word: 'nocturnal',  definition: 'Active at night rather than during the day.',                      sentence: 'Owls are nocturnal creatures that hunt in darkness.' },
    ],
    [
        { word: 'sun',        definition: 'The star at the centre of our solar system that gives us light.',  sentence: 'The sun shone brightly on a warm summer afternoon.' },
        { word: 'bread',      definition: 'A food made from flour, water, and yeast, baked in an oven.',     sentence: 'She baked a fresh loaf of bread in the morning.' },
        { word: 'mirror',     definition: 'A flat glass surface that reflects images.',                       sentence: 'She checked her appearance in the mirror before leaving.' },
        { word: 'adventure',  definition: 'An exciting or unusual experience involving risk.',                sentence: 'The camping trip turned into a great adventure.' },
        { word: 'rhythm',     definition: 'A strong regular pattern of sound or movement.',                   sentence: 'The drummer kept a perfect rhythm throughout the song.' },
    ],
    [
        { word: 'rain',       definition: 'Water that falls from clouds in small drops.',                     sentence: 'The rain fell heavily throughout the afternoon.' },
        { word: 'river',      definition: 'A large natural stream of water flowing towards the sea.',         sentence: 'They kayaked along the river on a sunny day.' },
        { word: 'lantern',    definition: 'A portable light enclosed in a transparent case.',                 sentence: 'He carried a lantern through the dark cave.' },
        { word: 'volcano',    definition: 'A mountain with a large opening through which lava can erupt.',    sentence: 'The volcano erupted and covered the village in ash.' },
        { word: 'labyrinth',  definition: 'A complicated network of paths that is very difficult to navigate.',sentence: 'They got completely lost in the ancient labyrinth.' },
    ],
    [
        { word: 'book',       definition: 'A set of printed pages bound together with a cover.',              sentence: 'She read a book by the window every evening.' },
        { word: 'music',      definition: 'Sounds arranged in patterns to create something pleasant to hear.', sentence: 'The music filled the room during the party.' },
        { word: 'harbour',    definition: 'A sheltered stretch of water where ships can dock safely.',        sentence: 'Fishing boats filled the harbour at dawn.' },
        { word: 'mosquito',   definition: 'A small flying insect that bites and can carry disease.',          sentence: 'A mosquito bite left a red mark on her arm.' },
        { word: 'jeopardy',   definition: 'A situation of serious danger or risk of loss.',                   sentence: 'The bad weather put their plans in jeopardy.' },
    ],
    [
        { word: 'cat',        definition: 'A small furry pet animal that purrs and meows.',                   sentence: 'The cat curled up on the sofa by the fire.' },
        { word: 'beach',      definition: 'An area of sand or pebbles next to the sea.',                      sentence: 'The children played all day on the beach.' },
        { word: 'journal',    definition: 'A personal diary or regular written record of events.',             sentence: 'She wrote in her journal every evening before bed.' },
        { word: 'chocolate',  definition: 'A sweet brown food made from cocoa beans.',                        sentence: 'She bought a bar of chocolate from the corner shop.' },
        { word: 'conscience', definition: 'The inner sense of what is right or wrong in your actions.',       sentence: 'His conscience told him to return the wallet.' },
    ],
    [
        { word: 'boat',       definition: 'A small vessel used for travelling on water.',                     sentence: 'They rowed the boat across the calm lake.' },
        { word: 'ocean',      definition: 'A vast area of saltwater that covers most of the Earth.',          sentence: 'The ship sailed across the ocean for three weeks.' },
        { word: 'necklace',   definition: 'A piece of jewellery worn around the neck.',                       sentence: 'She received a gold necklace as a birthday gift.' },
        { word: 'boulevard',  definition: 'A wide road in a town or city, often with trees on either side.',  sentence: 'They walked slowly down the tree-lined boulevard.' },
        { word: 'silhouette', definition: 'A dark shape or outline seen against a lighter background.',       sentence: 'The silhouette of the tree stood out against the sunset.' },
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
