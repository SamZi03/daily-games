// ============================================
// SONG DATABASE
// The game automatically fetches a 30-second preview
// from iTunes (free & legal) — no URLs needed!
// Just add: title, artist, year
// ============================================
const SONGS = [
    { title: "Blinding Lights",                artist: "The Weeknd",                   year: 2019 },
    { title: "Shape of You",                   artist: "Ed Sheeran",                   year: 2017 },
    { title: "Dance Monkey",                   artist: "Tones and I",                  year: 2019 },
    { title: "Stay",                           artist: "The Kid LAROI",                year: 2021 },
    { title: "Levitating",                     artist: "Dua Lipa",                     year: 2020 },
    { title: "drivers license",                artist: "Olivia Rodrigo",               year: 2021 },
    { title: "Watermelon Sugar",               artist: "Harry Styles",                 year: 2019 },
    { title: "good 4 u",                       artist: "Olivia Rodrigo",               year: 2021 },
    { title: "Heat Waves",                     artist: "Glass Animals",                year: 2020 },
    { title: "Easy On Me",                     artist: "Adele",                        year: 2021 },
    { title: "As It Was",                      artist: "Harry Styles",                 year: 2022 },
    { title: "Anti-Hero",                      artist: "Taylor Swift",                 year: 2022 },
    { title: "Flowers",                        artist: "Miley Cyrus",                  year: 2023 },
    { title: "Cruel Summer",                   artist: "Taylor Swift",                 year: 2019 },
    { title: "Kill Bill",                      artist: "SZA",                          year: 2022 },
    { title: "Golden Hour",                    artist: "JVKE",                         year: 2022 },
    { title: "Calm Down",                      artist: "Rema",                         year: 2022 },
    { title: "Industry Baby",                  artist: "Lil Nas X",                    year: 2021 },
    { title: "Unholy",                         artist: "Sam Smith",                    year: 2022 },
    { title: "Montero",                        artist: "Lil Nas X",                    year: 2021 },
    { title: "Save Your Tears",                artist: "The Weeknd",                   year: 2021 },
    { title: "abcdefu",                        artist: "GAYLE",                        year: 2021 },
    { title: "Butter",                         artist: "BTS",                          year: 2021 },
    { title: "Sunflower",                      artist: "Post Malone",                  year: 2018 },
    { title: "Bad Guy",                        artist: "Billie Eilish",                year: 2019 },
];

// Seconds of audio revealed per attempt
const CLIP_LENGTHS = [0.1, 0.5, 2, 4, 8, 15];
const MAX_ATTEMPTS = 6;

const todaySong = SONGS[getDailyIndex(SONGS)];
const SAVE_KEY  = 'heardle_' + getTodayString();

// ============================================
// ITUNES API — fetches a free legal 30s preview
// ============================================
async function fetchPreviewUrl(title, artist) {
    try {
        const query = encodeURIComponent(`${title} ${artist}`);
        const res   = await fetch(`https://itunes.apple.com/search?term=${query}&entity=song&limit=5`);
        const data  = await res.json();
        const match = data.results.find(r =>
            r.trackName.toLowerCase().includes(title.toLowerCase())
        ) || data.results[0];
        return match ? match.previewUrl : null;
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

// ============================================
// AUDIO PLAYER
// ============================================
const audio     = document.getElementById('audioPlayer');
const playBtn   = document.getElementById('playBtn');
const clipLabel = document.getElementById('clipSeconds');
const audioNote = document.getElementById('audioNote');

// Load preview on startup
playBtn.disabled = true;
audioNote.textContent = 'Loading audio...';

const progressBar = document.getElementById('progressBar');
let previewUrl = null;

fetchPreviewUrl(todaySong.title, todaySong.artist).then(url => {
    if (url) {
        previewUrl = url;
        audio.preload = 'auto';
        audio.src = url;
        audioNote.textContent = '30-second preview via iTunes';
        playBtn.disabled = false;
    } else {
        audioNote.textContent = 'Audio unavailable for this song — guessing still works!';
    }
});

function startClip(seconds) {
    playBtn.disabled = true;
    playBtn.textContent = '▶ Playing...';
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    audio.play().then(() => {
        // Audio confirmed playing — start progress bar and clip timer
        requestAnimationFrame(() => {
            progressBar.style.transition = `width ${seconds}s linear`;
            progressBar.style.width = '100%';
        });
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            playBtn.disabled = false;
            playBtn.textContent = '▶ Play Clip';
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        }, seconds * 1000);
    }).catch(() => {
        // Play failed — reload audio and try once more
        audio.src = previewUrl;
        audio.load();
        audio.addEventListener('canplay', () => {
            startClip(seconds);
        }, { once: true });
    });
}

playBtn.addEventListener('click', () => {
    if (!previewUrl) return;
    const seconds = CLIP_LENGTHS[Math.min(state.attempt, CLIP_LENGTHS.length - 1)];
    if (audio.currentTime > 0) {
        audio.currentTime = 0;
        audio.addEventListener('seeked', () => startClip(seconds), { once: true });
    } else {
        startClip(seconds);
    }
});

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
        markGamePlayed('heardle');
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
    clipLabel.textContent = CLIP_LENGTHS[Math.min(state.attempt, CLIP_LENGTHS.length - 1)];

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
            ? `<h3>Nice one! 🎉</h3>
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
