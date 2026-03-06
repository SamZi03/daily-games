// ============================================
// SONG DATABASE FOR LYRICS GAME
//
// HOW TO ADD A SONG:
// 1. Copy one of the entries below
// 2. Fill in the title, artist, and lyrics
// 3. lyrics: add each line as a separate "string" in the array
//    - Lines are revealed one at a time as the player guesses wrong
//    - Put less obvious lines first, more obvious ones last
//
// WHERE TO GET LYRICS: Google the song name + "lyrics"
// ============================================
const SONGS = [
    {
        title: "As It Was",
        artist: "Harry Styles",
        lyrics: [
            "Add first lyric line here",
            "Add second lyric line here",
            "Add third lyric line here",
            "Add fourth lyric line here",
            "Add fifth lyric line here",
            "Add sixth lyric line here",
        ]
    },
    {
        title: "Anti-Hero",
        artist: "Taylor Swift",
        lyrics: [
            "Add first lyric line here",
            "Add second lyric line here",
            "Add third lyric line here",
            "Add fourth lyric line here",
            "Add fifth lyric line here",
            "Add sixth lyric line here",
        ]
    },
    {
        title: "Flowers",
        artist: "Miley Cyrus",
        lyrics: [
            "Add first lyric line here",
            "Add second lyric line here",
            "Add third lyric line here",
            "Add fourth lyric line here",
            "Add fifth lyric line here",
            "Add sixth lyric line here",
        ]
    },
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        lyrics: [
            "Add first lyric line here",
            "Add second lyric line here",
            "Add third lyric line here",
            "Add fourth lyric line here",
            "Add fifth lyric line here",
            "Add sixth lyric line here",
        ]
    },
    {
        title: "Heat Waves",
        artist: "Glass Animals",
        lyrics: [
            "Add first lyric line here",
            "Add second lyric line here",
            "Add third lyric line here",
            "Add fourth lyric line here",
            "Add fifth lyric line here",
            "Add sixth lyric line here",
        ]
    },
];

const MAX_ATTEMPTS = 6;
const SAVE_KEY = 'lyrics_' + getTodayString();

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
        markGamePlayed('lyrics');
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
    // Show lyrics revealed so far (one more line per attempt)
    const lyricsSection = document.getElementById('lyricsSection');
    lyricsSection.innerHTML = '';
    const revealCount = Math.min(state.attempt + 1, todaySong.lyrics.length);
    for (let i = 0; i < revealCount; i++) {
        const line = document.createElement('p');
        line.className = 'lyric-line';
        line.style.animationDelay = (i * 0.05) + 's';
        line.textContent = `"${todaySong.lyrics[i]}"`;
        lyricsSection.appendChild(line);
    }

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
        document.getElementById('inputSection').style.display = 'none';
        const box = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className = `result-box ${state.won ? 'win' : 'lose'}`;
        box.innerHTML = state.won
            ? `<h3>Got it! 🎉</h3>
               <p>You got it in <strong>${state.attempt}</strong> guess${state.attempt !== 1 ? 'es' : ''}!</p>
               <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`
            : `<h3>Better luck tomorrow!</h3>
               <p>The song was:</p>
               <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`;
    }
}

render();
