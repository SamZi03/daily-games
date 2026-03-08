// ============================================
// SONG DATABASE FOR COVER GAME
// Album artwork is fetched automatically from iTunes (free & legal)
// Just add: title, artist
// ============================================
const SONGS = [
    { title: "As It Was",       artist: "Harry Styles"   },
    { title: "Anti-Hero",       artist: "Taylor Swift"   },
    { title: "Flowers",         artist: "Miley Cyrus"    },
    { title: "Blinding Lights", artist: "The Weeknd"     },
    { title: "Shape of You",    artist: "Ed Sheeran"     },
    { title: "Heat Waves",      artist: "Glass Animals"  },
    { title: "Cruel Summer",    artist: "Taylor Swift"   },
    { title: "Bad Guy",         artist: "Billie Eilish"  },
    { title: "Levitating",      artist: "Dua Lipa"       },
    { title: "Sunflower",       artist: "Post Malone"    },
];

// Blur levels — starts very blurry, clears with each wrong guess
const BLUR_LEVELS = [22, 18, 13, 8, 4, 0];
const MAX_ATTEMPTS = 6;
const SAVE_KEY = 'cover_' + getTodayString();

const todaySong = SONGS[getDailyIndex(SONGS)];

// ============================================
// ITUNES API — fetches album artwork for free
// ============================================
async function fetchArtworkUrl(title, artist) {
    try {
        const query = encodeURIComponent(`${title} ${artist}`);
        const res   = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=5`);
        const data  = await res.json();
        const match = data.results.find(r =>
            r.trackName.toLowerCase().includes(title.toLowerCase())
        ) || data.results[0];
        if (!match) return null;
        // Replace 100x100 thumbnail with 600x600 for better quality
        return match.artworkUrl100.replace('100x100', '600x600');
    } catch {
        return null;
    }
}

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        attempt: 0, guesses: [], gameOver: false, won: false
    };
}

function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state = loadState();
let coverImg = null;

// ============================================
// SETUP COVER IMAGE
// ============================================
fetchArtworkUrl(todaySong.title, todaySong.artist).then(url => {
    const wrap = document.getElementById('coverWrap');
    if (url) {
        wrap.innerHTML = `<img class="cover-image" id="coverImg" src="${url}" alt="Album cover">`;
        coverImg = document.getElementById('coverImg');
        updateBlur();
    } else {
        wrap.innerHTML = `<div class="cover-placeholder">🎵</div>`;
    }
});

function updateBlur() {
    if (!coverImg) return;
    const blur = state.gameOver
        ? 0
        : BLUR_LEVELS[Math.min(state.attempt, BLUR_LEVELS.length - 1)];
    coverImg.style.filter = `blur(${blur}px)`;
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
        markGamePlayed('coverlock');
    }

    guessInput.value = '';
    autocomplete.innerHTML = '';
    saveState(state);
    render();
}

document.getElementById('submitBtn').addEventListener('click', () => submitGuess(false));
document.getElementById('skipBtn').addEventListener('click',   () => submitGuess(true));
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(false); });
document.addEventListener('click', e => {
    if (!guessInput.contains(e.target) && !autocomplete.contains(e.target)) {
        autocomplete.innerHTML = '';
    }
});

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

render();
