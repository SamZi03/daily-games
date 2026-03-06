// ============================================
// SONG DATABASE (Spotify streams, approximate)
// Add more songs here to expand the game
// ============================================
const SONGS = [
    { title: "Shape of You",            artist: "Ed Sheeran",              streams: 4000000000 },
    { title: "Blinding Lights",         artist: "The Weeknd",              streams: 3900000000 },
    { title: "Dance Monkey",            artist: "Tones and I",             streams: 2700000000 },
    { title: "Rockstar",                artist: "Post Malone ft. 21 Savage", streams: 2500000000 },
    { title: "One Dance",               artist: "Drake",                   streams: 2400000000 },
    { title: "Stay",                    artist: "The Kid LAROI & Justin Bieber", streams: 2300000000 },
    { title: "Sunflower",               artist: "Post Malone & Swae Lee",  streams: 3200000000 },
    { title: "Watermelon Sugar",        artist: "Harry Styles",            streams: 2100000000 },
    { title: "Heat Waves",              artist: "Glass Animals",            streams: 2000000000 },
    { title: "As It Was",               artist: "Harry Styles",            streams: 2600000000 },
    { title: "Anti-Hero",               artist: "Taylor Swift",            streams: 1900000000 },
    { title: "Cruel Summer",            artist: "Taylor Swift",            streams: 3100000000 },
    { title: "Levitating",              artist: "Dua Lipa",                streams: 2200000000 },
    { title: "Bad Guy",                 artist: "Billie Eilish",           streams: 2800000000 },
    { title: "Senorita",                artist: "Shawn Mendes & Camila Cabello", streams: 2400000000 },
    { title: "drivers license",         artist: "Olivia Rodrigo",          streams: 1800000000 },
    { title: "good 4 u",                artist: "Olivia Rodrigo",          streams: 1600000000 },
    { title: "Easy On Me",              artist: "Adele",                   streams: 1700000000 },
    { title: "Flowers",                 artist: "Miley Cyrus",             streams: 1500000000 },
    { title: "Kill Bill",               artist: "SZA",                     streams: 1400000000 },
    { title: "Golden Hour",             artist: "JVKE",                    streams: 1300000000 },
    { title: "Calm Down",               artist: "Rema & Selena Gomez",     streams: 1600000000 },
    { title: "Unholy",                  artist: "Sam Smith & Kim Petras",  streams: 1200000000 },
    { title: "Industry Baby",           artist: "Lil Nas X & Jack Harlow", streams: 1500000000 },
    { title: "Montero (CMBYN)",         artist: "Lil Nas X",               streams: 1400000000 },
    { title: "Peaches",                 artist: "Justin Bieber",           streams: 1100000000 },
    { title: "Butter",                  artist: "BTS",                     streams: 1300000000 },
    { title: "abcdefu",                 artist: "GAYLE",                   streams: 1200000000 },
    { title: "Escapism.",               artist: "RAYE ft. 070 Shake",      streams: 900000000  },
    { title: "Save Your Tears",         artist: "The Weeknd",              streams: 2000000000 },
];

const TOTAL_QUESTIONS = 5;
const SAVE_KEY = 'higher-lower_' + getTodayString();

function formatStreams(n) {
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
    return (n / 1000000).toFixed(0) + 'M';
}

// Build today's fixed set of 5 pairs using date as seed
function getTodayPairs() {
    const seed = parseInt(getTodayString().replace(/-/g, ''));
    const shuffled = [...SONGS];
    // Simple seeded shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (seed * (i + 1)) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const pairs = [];
    for (let i = 0; i < TOTAL_QUESTIONS * 2; i += 2) {
        pairs.push([shuffled[i], shuffled[i + 1]]);
    }
    return pairs;
}

const pairs = getTodayPairs();

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        question: 0,
        score: 0,
        gameOver: false,
        answered: false
    };
}

function saveState(s) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}

let state = loadState();

// ============================================
// RENDER
// ============================================
function formatStreamsLabel(n) {
    return formatStreams(n) + ' streams';
}

function renderQuestion() {
    if (state.gameOver) {
        showResult();
        return;
    }

    document.getElementById('scoreDisplay').textContent = state.score;
    document.getElementById('questionDisplay').textContent =
        `Question ${state.question + 1} of ${TOTAL_QUESTIONS}`;

    const [songA, songB] = pairs[state.question];
    const cards = document.getElementById('hlCards');
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';

    cards.innerHTML = `
        <div class="hl-card" id="cardA" data-choice="A">
            <div class="hl-song-title">${songA.title}</div>
            <div class="hl-song-artist">${songA.artist}</div>
            <div class="hl-streams-shown">${formatStreamsLabel(songA.streams)}</div>
        </div>
        <div class="vs-label">VS</div>
        <div class="hl-card" id="cardB" data-choice="B">
            <div class="hl-song-title">${songB.title}</div>
            <div class="hl-song-artist">${songB.artist}</div>
            <div class="hl-streams-hidden" id="streamsB">Tap to choose</div>
        </div>
    `;

    if (!state.answered) {
        document.getElementById('cardA').addEventListener('click', () => choose('A', songA, songB));
        document.getElementById('cardB').addEventListener('click', () => choose('B', songA, songB));
    }
}

function choose(pick, songA, songB) {
    if (state.answered) return;
    state.answered = true;

    const higherSong = songA.streams >= songB.streams ? 'A' : 'B';
    const correct = pick === higherSong;

    if (correct) state.score++;

    // Show streams and highlight
    document.getElementById('streamsB').outerHTML =
        `<div class="hl-streams-shown">${formatStreamsLabel(songB.streams)}</div>`;

    document.getElementById('cardA').classList.add(pick === 'A' ? (correct && pick === higherSong ? 'correct' : correct ? 'correct' : 'wrong') : (higherSong === 'A' ? 'correct' : ''));
    document.getElementById('cardB').classList.add(pick === 'B' ? (correct ? 'correct' : 'wrong') : (higherSong === 'B' ? 'correct' : ''));
    document.getElementById('cardA').classList.add('disabled');
    document.getElementById('cardB').classList.add('disabled');

    // Recalculate correctly
    const cardA = document.getElementById('cardA');
    const cardB = document.getElementById('cardB');
    cardA.className = 'hl-card disabled';
    cardB.className = 'hl-card disabled';
    if (higherSong === 'A') { cardA.classList.add('correct'); } else { cardA.classList.add(pick === 'A' ? 'wrong' : ''); }
    if (higherSong === 'B') { cardB.classList.add('correct'); } else { cardB.classList.add(pick === 'B' ? 'wrong' : ''); }

    saveState(state);

    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'block';
    nextBtn.textContent = state.question + 1 >= TOTAL_QUESTIONS ? 'See Result' : 'Next →';
    nextBtn.onclick = () => {
        state.question++;
        state.answered = false;
        if (state.question >= TOTAL_QUESTIONS) {
            state.gameOver = true;
            markGamePlayed('higher-lower');
        }
        saveState(state);
        renderQuestion();
    };
}

function showResult() {
    document.getElementById('hlCards').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('scoreDisplay').textContent = state.score;

    const box = document.getElementById('resultBox');
    box.style.display = 'block';

    const perfect = state.score === TOTAL_QUESTIONS;
    box.className = `result-box ${perfect ? 'win' : state.score >= 3 ? 'win' : 'lose'}`;
    box.innerHTML = `
        <h3>${perfect ? 'Perfect score! 🎉' : state.score >= 3 ? 'Not bad! 👍' : 'Better luck tomorrow!'}</h3>
        <p>You scored <strong>${state.score} out of ${TOTAL_QUESTIONS}</strong></p>
        <a href="../../index.html" class="back-home-btn">Back to Games</a>
    `;
}

renderQuestion();
