// ============================================
// SONG DATABASE FOR COVER GAME
//
// HOW TO ADD A SONG:
// 1. Find the album cover image online (Google Images: "Shape of You album cover")
// 2. Right-click → Copy image address  (or save and host the file)
// 3. Paste the URL into coverUrl below
//
// The image starts fully blurred and gets clearer with each wrong guess
// ============================================
const SONGS = [
    {
        title: "As It Was",
        artist: "Harry Styles",
        coverUrl: "" // Paste image URL here
    },
    {
        title: "Anti-Hero",
        artist: "Taylor Swift",
        coverUrl: "" // Paste image URL here
    },
    {
        title: "Flowers",
        artist: "Miley Cyrus",
        coverUrl: "" // Paste image URL here
    },
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        coverUrl: "" // Paste image URL here
    },
    {
        title: "Shape of You",
        artist: "Ed Sheeran",
        coverUrl: "" // Paste image URL here
    },
    {
        title: "Heat Waves",
        artist: "Glass Animals",
        coverUrl: "" // Paste image URL here
    },
    {
        title: "Cruel Summer",
        artist: "Taylor Swift",
        coverUrl: "" // Paste image URL here
    },
];

// Blur levels per attempt (starts very blurry, clears up each guess)
const BLUR_LEVELS = [20, 16, 12, 8, 4, 0];
const MAX_ATTEMPTS = 6;
const SAVE_KEY = 'cover_' + getTodayString();

const todaySong = SONGS[getDailyIndex(SONGS)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        attempt: 0,
        guesses: [],
        gameOver: false,
        won: false
    };
}

function saveState(s) {
    localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}

let state = loadState();

// ============================================
// SETUP COVER IMAGE
// ============================================
function setupCover() {
    const wrap = document.getElementById('coverWrap');
    if (todaySong.coverUrl) {
        wrap.outerHTML = `<img class="cover-image" id="coverImg" src="${todaySong.coverUrl}" alt="Album cover">`;
    }
    updateBlur();
}

function updateBlur() {
    const img = document.getElementById('coverImg');
    if (!img) return;
    const blur = BLUR_LEVELS[Math.min(state.attempt, BLUR_LEVELS.length - 1)];
    img.style.filter = `blur(${blur}px)`;
}

// ============================================
// AUTOCOMPLETE
// ============================================
const guessInput   = document.getElementById('guessInput');
const autocomplete = document.getElementById('autocomplete');

guessInput.addEventListener('input', () => {
    const val = guessInput.value.toLowerCase().trim();
    autocomplete.innerHTML = '';
    if (!val) return;

    const matches = SONGS.filter(s =>
        s.title.toLowerCase().includes(val) ||
        s.artist.toLowerCase().includes(val)
    ).slice(0, 6);

    matches.forEach(song => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.textContent = `${song.title} — ${song.artist}`;
        item.addEventListener('click', () => {
            guessInput.value = `${song.title} — ${song.artist}`;
            autocomplete.innerHTML = '';
        });
        autocomplete.appendChild(item);
    });
});

// ============================================
// SUBMIT GUESS
// ============================================
function submitGuess(skipped) {
    if (state.gameOver) return;
    const raw = guessInput.value.trim();
    if (!skipped && !raw) return;

    const correct = !skipped &&
        raw.toLowerCase().includes(todaySong.title.toLowerCase());

    state.guesses.push({ text: skipped ? '(skipped)' : raw, correct, skipped });
    state.attempt++;

    if (correct || state.attempt >= MAX_ATTEMPTS) {
        state.gameOver = true;
        state.won = correct;
        markGamePlayed('cover');
    }

    guessInput.value = '';
    autocomplete.innerHTML = '';
    saveState(state);
    render();
}

document.getElementById('submitBtn').addEventListener('click', () => submitGuess(false));
document.getElementById('skipBtn').addEventListener('click',   () => submitGuess(true));
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(false); });

// ============================================
// RENDER
// ============================================
function render() {
    updateBlur();

    // Attempt dots
    const dotsEl = document.getElementById('attemptsDisplay');
    dotsEl.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const dot = document.createElement('div');
        dot.className = 'attempt-dot';
        if (i < state.guesses.length) {
            const g = state.guesses[i];
            dot.classList.add(g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong');
            dot.textContent = g.correct ? '✓' : g.skipped ? '–' : '✗';
        }
        dotsEl.appendChild(dot);
    }

    // Guesses list
    const listEl = document.getElementById('guessesList');
    listEl.innerHTML = '';
    state.guesses.forEach(g => {
        const el = document.createElement('div');
        el.className = `guess-item ${g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong'}`;
        el.textContent = g.text;
        listEl.appendChild(el);
    });

    // Game over
    if (state.gameOver) {
        updateBlur(); // Remove blur on game over
        document.getElementById('inputSection').style.display = 'none';
        const box = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className = `result-box ${state.won ? 'win' : 'lose'}`;
        box.innerHTML = state.won
            ? `<h3>Got it! 🎉</h3>
               <p>You identified the cover in <strong>${state.attempt}</strong> guess${state.attempt !== 1 ? 'es' : ''}!</p>
               <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`
            : `<h3>Better luck tomorrow!</h3>
               <p>The song was:</p>
               <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`;
    }
}

setupCover();
render();
