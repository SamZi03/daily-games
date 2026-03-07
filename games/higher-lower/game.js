// ============================================
// SONG DATABASE (Spotify streams, approximate)
// ============================================
const SONGS = [
    { title: "Shape of You",        artist: "Ed Sheeran",                   streams: 4000000000 },
    { title: "Blinding Lights",     artist: "The Weeknd",                   streams: 3900000000 },
    { title: "Cruel Summer",        artist: "Taylor Swift",                 streams: 3100000000 },
    { title: "Sunflower",           artist: "Post Malone & Swae Lee",       streams: 3200000000 },
    { title: "Dance Monkey",        artist: "Tones and I",                  streams: 2700000000 },
    { title: "Bad Guy",             artist: "Billie Eilish",                streams: 2800000000 },
    { title: "As It Was",           artist: "Harry Styles",                 streams: 2600000000 },
    { title: "Rockstar",            artist: "Post Malone ft. 21 Savage",    streams: 2500000000 },
    { title: "One Dance",           artist: "Drake",                        streams: 2400000000 },
    { title: "Senorita",            artist: "Shawn Mendes & Camila Cabello",streams: 2400000000 },
    { title: "Levitating",          artist: "Dua Lipa",                     streams: 2200000000 },
    { title: "Watermelon Sugar",    artist: "Harry Styles",                 streams: 2100000000 },
    { title: "Heat Waves",          artist: "Glass Animals",                streams: 2000000000 },
    { title: "Save Your Tears",     artist: "The Weeknd",                   streams: 2000000000 },
    { title: "Stay",                artist: "The Kid LAROI & Justin Bieber",streams: 2300000000 },
    { title: "drivers license",     artist: "Olivia Rodrigo",               streams: 1800000000 },
    { title: "Easy On Me",          artist: "Adele",                        streams: 1700000000 },
    { title: "good 4 u",            artist: "Olivia Rodrigo",               streams: 1600000000 },
    { title: "Calm Down",           artist: "Rema & Selena Gomez",          streams: 1600000000 },
    { title: "Industry Baby",       artist: "Lil Nas X & Jack Harlow",      streams: 1500000000 },
    { title: "Flowers",             artist: "Miley Cyrus",                  streams: 1500000000 },
    { title: "Montero (CMBYN)",     artist: "Lil Nas X",                    streams: 1400000000 },
    { title: "Kill Bill",           artist: "SZA",                          streams: 1400000000 },
    { title: "Golden Hour",         artist: "JVKE",                         streams: 1300000000 },
    { title: "Butter",              artist: "BTS",                          streams: 1300000000 },
    { title: "Unholy",              artist: "Sam Smith & Kim Petras",       streams: 1200000000 },
    { title: "abcdefu",             artist: "GAYLE",                        streams: 1200000000 },
    { title: "Peaches",             artist: "Justin Bieber",                streams: 1100000000 },
    { title: "Anti-Hero",           artist: "Taylor Swift",                 streams: 1900000000 },
    { title: "Escapism.",           artist: "RAYE ft. 070 Shake",           streams: 900000000  },
];

const SAVE_KEY = 'higher-lower_' + getTodayString();

function formatStreams(n) {
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + 'B';
    return (n / 1000000).toFixed(0) + 'M';
}

// Seeded shuffle so everyone gets the same song order each day
function getDailyOrder() {
    const seed = parseInt(getTodayString().replace(/-/g, ''));
    const list = [...SONGS];
    for (let i = list.length - 1; i > 0; i--) {
        const j = (seed * (i + 7)) % (i + 1);
        [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
}

const orderedSongs = getDailyOrder();

// ============================================
// STATE
// Keep track of which song index we're up to
// so each session continues where it left off
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        index: 1,       // index into orderedSongs for the RIGHT card
        score: 0,
        gameOver: false,
        answered: false,
        lastCorrect: false
    };
}

function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state = loadState();

// Left card = song before current index, Right card = current index
function getCards() {
    return {
        left:  orderedSongs[state.index - 1],
        right: orderedSongs[state.index % orderedSongs.length]
    };
}

// ============================================
// RENDER
// ============================================
function renderQuestion() {
    if (state.gameOver) { showResult(); return; }

    document.getElementById('scoreDisplay').textContent = state.score;
    document.getElementById('questionDisplay').textContent = `Streak: ${state.score}`;

    const { left, right } = getCards();
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';

    document.getElementById('hlCards').innerHTML = `
        <div class="hl-card" id="cardLeft">
            <div class="hl-song-title">${left.title}</div>
            <div class="hl-song-artist">${left.artist}</div>
            <div class="hl-streams-shown">${formatStreams(left.streams)} streams</div>
        </div>
        <div class="vs-label">VS</div>
        <div class="hl-card" id="cardRight">
            <div class="hl-song-title">${right.title}</div>
            <div class="hl-song-artist">${right.artist}</div>
            <div class="hl-streams-hidden">Tap to choose</div>
        </div>
    `;

    document.getElementById('cardLeft').addEventListener('click',  () => choose('left',  left, right));
    document.getElementById('cardRight').addEventListener('click', () => choose('right', left, right));
}

function choose(pick, left, right) {
    if (state.answered) return;
    state.answered = true;

    const correct = pick === (left.streams >= right.streams ? 'left' : 'right');

    if (correct) state.score++;

    // Show right card streams and colour both cards
    const cardLeft  = document.getElementById('cardLeft');
    const cardRight = document.getElementById('cardRight');

    cardRight.querySelector('.hl-streams-hidden').outerHTML =
        `<div class="hl-streams-shown">${formatStreams(right.streams)} streams</div>`;

    const higherSide = left.streams >= right.streams ? 'left' : 'right';
    cardLeft.className  = `hl-card disabled ${higherSide === 'left'  ? 'correct' : pick === 'left'  ? 'wrong' : ''}`;
    cardRight.className = `hl-card disabled ${higherSide === 'right' ? 'correct' : pick === 'right' ? 'wrong' : ''}`;

    if (!correct) {
        // Wrong — game over
        state.gameOver = true;
        markGamePlayed('higher-lower');
        saveState(state);
        setTimeout(showResult, 1200);
    } else {
        // Correct — show Next button
        saveState(state);
        const nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'block';
        nextBtn.textContent = 'Next →';
        nextBtn.onclick = () => {
            state.index++;
            state.answered = false;
            // If we've run out of songs, loop back
            if (state.index >= orderedSongs.length) state.index = 1;
            saveState(state);
            renderQuestion();
        };
    }
}

function showResult() {
    document.getElementById('hlCards').innerHTML = '';
    document.getElementById('nextBtn').style.display = 'none';

    const box = document.getElementById('resultBox');
    box.style.display = 'block';
    box.className = `result-box ${state.score >= 5 ? 'win' : 'lose'}`;
    box.innerHTML = `
        <h3>${state.score >= 10 ? 'Incredible! 🔥' : state.score >= 5 ? 'Nice streak! 🎉' : 'Better luck tomorrow!'}</h3>
        <p>You got <strong>${state.score}</strong> in a row!</p>
        <a href="../../index.html" class="back-home-btn">Back to Games</a>
    `;
}

// Update score bar label to reflect endless mode
document.getElementById('questionDisplay').textContent = `Streak: ${state.score}`;
document.querySelector('.hl-score-bar span:first-child').innerHTML = `Score: <strong id="scoreDisplay">${state.score}</strong>`;

renderQuestion();
