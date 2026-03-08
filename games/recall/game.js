// ============================================
// RECALL — Guess the song from iTunes metadata clues
// Clues auto-fetched from iTunes API (no manual data entry needed)
// Clue order: Duration → Genre → Year → Album → Artist
// ============================================
const SONGS = [
    { title: "Blinding Lights",   artist: "The Weeknd"      },
    { title: "Shape of You",      artist: "Ed Sheeran"      },
    { title: "Dance Monkey",      artist: "Tones and I"     },
    { title: "Stay",              artist: "The Kid LAROI"   },
    { title: "Levitating",        artist: "Dua Lipa"        },
    { title: "drivers license",   artist: "Olivia Rodrigo"  },
    { title: "Watermelon Sugar",  artist: "Harry Styles"    },
    { title: "good 4 u",          artist: "Olivia Rodrigo"  },
    { title: "Heat Waves",        artist: "Glass Animals"   },
    { title: "Easy On Me",        artist: "Adele"           },
    { title: "As It Was",         artist: "Harry Styles"    },
    { title: "Anti-Hero",         artist: "Taylor Swift"    },
    { title: "Flowers",           artist: "Miley Cyrus"     },
    { title: "Cruel Summer",      artist: "Taylor Swift"    },
    { title: "Kill Bill",         artist: "SZA"             },
    { title: "Golden Hour",       artist: "JVKE"            },
    { title: "Calm Down",         artist: "Rema"            },
    { title: "Industry Baby",     artist: "Lil Nas X"       },
    { title: "Unholy",            artist: "Sam Smith"       },
    { title: "Save Your Tears",   artist: "The Weeknd"      },
    { title: "abcdefu",           artist: "GAYLE"           },
    { title: "Butter",            artist: "BTS"             },
    { title: "Sunflower",         artist: "Post Malone"     },
    { title: "Bad Guy",           artist: "Billie Eilish"   },
    { title: "Montero",           artist: "Lil Nas X"       },
];

// Clue order — all fetched automatically from iTunes
const CLUE_KEYS   = ['duration', 'genre', 'year', 'album', 'artist'];
const CLUE_LABELS = ['Duration', 'Genre', 'Year', 'Album', 'Artist'];

const MAX_ATTEMPTS = 6;
const SAVE_KEY     = 'recall_' + getTodayString();
const todaySong    = SONGS[getDailyIndex(SONGS)];

// ============================================
// ITUNES FETCH
// ============================================
let songMeta = null;

async function fetchMeta(title, artist) {
    try {
        const q    = encodeURIComponent(`${title} ${artist}`);
        const res  = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=5`);
        const data = await res.json();
        const match = data.results.find(r =>
            r.trackName.toLowerCase().includes(title.toLowerCase())
        ) || data.results[0];
        if (!match) return null;
        return {
            duration: formatDuration(match.trackTimeMillis),
            genre:    match.primaryGenreName,
            year:     new Date(match.releaseDate).getFullYear().toString(),
            album:    match.collectionName,
            artist:   match.artistName,
        };
    } catch {
        return null;
    }
}

function formatDuration(ms) {
    if (!ms) return 'Unknown';
    const s = Math.round(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
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
// AUTOCOMPLETE
// ============================================
const guessInput   = document.getElementById('guessInput');
const autocomplete = document.getElementById('autocomplete');

guessInput.addEventListener('input', () => {
    const val = guessInput.value.toLowerCase().trim();
    autocomplete.innerHTML = '';
    if (!val) return;
    SONGS.filter(s =>
        s.title.toLowerCase().includes(val) || s.artist.toLowerCase().includes(val)
    ).slice(0, 6).forEach(song => {
        const item       = document.createElement('div');
        item.className   = 'autocomplete-item';
        item.textContent = `${song.title} — ${song.artist}`;
        item.addEventListener('click', () => {
            guessInput.value       = `${song.title} — ${song.artist}`;
            autocomplete.innerHTML = '';
        });
        autocomplete.appendChild(item);
    });
});

document.addEventListener('click', e => {
    if (!guessInput.contains(e.target) && !autocomplete.contains(e.target))
        autocomplete.innerHTML = '';
});

// ============================================
// SUBMIT
// ============================================
function submitGuess(skipped) {
    if (state.gameOver) return;
    const raw = guessInput.value.trim();
    if (!skipped && !raw) return;

    const correct = !skipped && raw.toLowerCase().includes(todaySong.title.toLowerCase());
    state.guesses.push({ text: skipped ? '(skipped)' : raw, correct, skipped });
    state.attempt++;

    if (correct || state.attempt >= MAX_ATTEMPTS) {
        state.gameOver = true;
        state.won      = correct;
        markGamePlayed('lyriclock');
    }

    guessInput.value       = '';
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
    const cluesEl  = document.getElementById('cluesSection');
    const revealed = state.attempt;
    cluesEl.innerHTML = '';

    if (!songMeta) {
        const p       = document.createElement('p');
        p.className   = 'recall-loading';
        p.textContent = 'Loading clues…';
        cluesEl.appendChild(p);
    } else {
        CLUE_KEYS.forEach((key, i) => {
            const row = document.createElement('div');
            row.className = 'recall-clue-row';
            if (i < revealed || state.gameOver) {
                row.classList.add('revealed');
                row.innerHTML = `<span class="recall-clue-label">${CLUE_LABELS[i]}</span>
                                 <span class="recall-clue-value">${songMeta[key] || '—'}</span>`;
            } else if (i === revealed && !state.gameOver) {
                row.classList.add('next');
                row.innerHTML = `<span class="recall-clue-label">${CLUE_LABELS[i]}</span>
                                 <span class="recall-clue-value recall-muted">Revealed after next guess</span>`;
            } else {
                row.classList.add('locked');
                row.innerHTML = `<span class="recall-clue-label">${CLUE_LABELS[i]}</span>
                                 <span class="recall-clue-value recall-muted">???</span>`;
            }
            cluesEl.appendChild(row);
        });
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
        const el       = document.createElement('div');
        el.className   = `guess-item ${g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong'}`;
        el.textContent = g.text;
        listEl.appendChild(el);
    });

    // Game over
    if (state.gameOver) {
        document.getElementById('inputSection').style.display = 'none';
        const box     = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className     = `result-box ${state.won ? 'win' : 'lose'}`;
        box.innerHTML     = state.won
            ? `<h3>You remembered it!</h3>
               <p>Got it in <strong>${state.attempt}</strong> guess${state.attempt !== 1 ? 'es' : ''}!</p>
               <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`
            : `<h3>Better luck tomorrow!</h3>
               <p>The song was:</p>
               <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`;
    }
}

// ============================================
// INIT
// ============================================
render(); // immediate render (shows "Loading clues…")
fetchMeta(todaySong.title, todaySong.artist).then(meta => {
    songMeta = meta;
    render();
});
