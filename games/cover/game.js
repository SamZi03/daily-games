// COVERLOCK — guess the song from its blurred album cover + metadata clues

const SONGS = [
    {title:"Blinding Lights", artist:"The Weeknd"},
    {title:"Shape of You", artist:"Ed Sheeran"},
    {title:"Dance Monkey", artist:"Tones and I"},
    {title:"Stay", artist:"The Kid LAROI"},
    {title:"Levitating", artist:"Dua Lipa"},
    {title:"drivers license", artist:"Olivia Rodrigo"},
    {title:"Watermelon Sugar", artist:"Harry Styles"},
    {title:"good 4 u", artist:"Olivia Rodrigo"},
    {title:"Heat Waves", artist:"Glass Animals"},
    {title:"Easy On Me", artist:"Adele"},
    {title:"As It Was", artist:"Harry Styles"},
    {title:"Anti-Hero", artist:"Taylor Swift"},
    {title:"Flowers", artist:"Miley Cyrus"},
    {title:"Cruel Summer", artist:"Taylor Swift"},
    {title:"Kill Bill", artist:"SZA"},
    {title:"Golden Hour", artist:"JVKE"},
    {title:"Calm Down", artist:"Rema"},
    {title:"Industry Baby", artist:"Lil Nas X"},
    {title:"Unholy", artist:"Sam Smith"},
    {title:"Save Your Tears", artist:"The Weeknd"},
    {title:"abcdefu", artist:"GAYLE"},
    {title:"Butter", artist:"BTS"},
    {title:"Sunflower", artist:"Post Malone"},
    {title:"Bad Guy", artist:"Billie Eilish"},
    {title:"Montero", artist:"Lil Nas X"},
];

// Blur: index = attempt number (0=start, 5=game over fully clear)
const BLUR_LEVELS = [14, 11, 8, 2, 0, 0];
const MAX_ATTEMPTS = 5;
const SAVE_KEY = 'cover_' + getTodayString();

const todaySong = SONGS[getDailyIndex(SONGS)];

// ============================================
// ITUNES API — fetches artwork + metadata in one call
// ============================================
async function fetchSongData(title, artist) {
    try {
        const q   = encodeURIComponent(`${title} ${artist}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=5`);
        const data = await res.json();
        const match = data.results.find(r =>
            r.trackName.toLowerCase().includes(title.toLowerCase())
        ) || data.results[0];
        if (!match) return null;
        return {
            artworkUrl:  match.artworkUrl100.replace('100x100', '600x600'),
            genre:       match.primaryGenreName,
            year:        new Date(match.releaseDate).getFullYear().toString(),
            artist:      match.artistName,
            trackName:   match.trackName,
            previewUrl:  match.previewUrl || null,
        };
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

let state    = loadState();
let coverImg = null;
let songData = null;

// ============================================
// INIT — fetch artwork + metadata, then render
// ============================================
fetchSongData(todaySong.title, todaySong.artist).then(data => {
    const wrap = document.getElementById('coverWrap');
    if (data) {
        songData = data;
        wrap.innerHTML = `<img class="cover-image" id="coverImg" src="${data.artworkUrl}" alt="Album cover">`;
        coverImg = document.getElementById('coverImg');
    } else {
        wrap.innerHTML = `<div class="cover-placeholder">🎵</div>`;
    }
    updateBlur();
    renderClues();
});

function updateBlur() {
    if (!coverImg) return;
    const blur = state.gameOver
        ? 0
        : BLUR_LEVELS[Math.min(state.attempt, BLUR_LEVELS.length - 1)];
    coverImg.style.filter = `blur(${blur}px)`;
}

// ============================================
// CLUE REVEAL — Genre+Year at attempt 2, Artist at attempt 4
// ============================================
function renderClues() {
    const el = document.getElementById('coverClues');
    if (!el || !songData) return;
    el.innerHTML = '';

    if (state.attempt >= 1 || state.gameOver) {
        const pill = document.createElement('span');
        pill.className   = 'cover-clue-pill' + (state.attempt === 1 ? ' new' : '');
        pill.textContent = songData.genre;
        el.appendChild(pill);
    }

    if (state.attempt >= 2 || state.gameOver) {
        const pill = document.createElement('span');
        pill.className   = 'cover-clue-pill' + (state.attempt === 2 ? ' new' : '');
        pill.textContent = songData.year;
        el.appendChild(pill);
    }

}

// ============================================
// AUTOCOMPLETE
// ============================================
const guessInput   = document.getElementById('guessInput');
const autocomplete = document.getElementById('autocomplete');

let acIndex = -1;

function acSetIndex(i) {
    const items = autocomplete.querySelectorAll('.autocomplete-item');
    items.forEach(el => el.classList.remove('active'));
    acIndex = Math.max(-1, Math.min(i, items.length - 1));
    if (acIndex >= 0) items[acIndex].classList.add('active');
}

const UNIQUE_ARTISTS = [...new Set(SONGS.map(s => s.artist))];

guessInput.addEventListener('input', () => {
    const val = guessInput.value.toLowerCase().trim();
    autocomplete.innerHTML = '';
    acIndex = -1;
    if (!val) return;

    UNIQUE_ARTISTS.filter(a => a.toLowerCase().includes(val)).slice(0, 6).forEach(artist => {
        const item       = document.createElement('div');
        item.className   = 'autocomplete-item';
        item.textContent = artist;
        item.addEventListener('click', () => {
            guessInput.value       = artist;
            autocomplete.innerHTML = '';
            acIndex = -1;
        });
        autocomplete.appendChild(item);
    });
});

guessInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); acSetIndex(acIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); acSetIndex(acIndex - 1); }
    else if (e.key === 'Enter') {
        const active = autocomplete.querySelector('.autocomplete-item.active');
        if (active) { e.preventDefault(); guessInput.value = active.textContent; autocomplete.innerHTML = ''; acIndex = -1; }
    }
});

document.addEventListener('click', e => {
    if (!guessInput.contains(e.target) && !autocomplete.contains(e.target)) {
        autocomplete.innerHTML = '';
        acIndex = -1;
    }
});

// ============================================
// SUBMIT GUESS
// ============================================
function submitGuess(skipped) {
    if (state.gameOver) return;
    const raw = guessInput.value.trim();
    if (!skipped && !raw) return;

    const correct = !skipped && raw.toLowerCase().includes(todaySong.artist.toLowerCase());
    state.guesses.push({text: skipped ? '(skipped)' : raw, correct, skipped});
    state.attempt++;

    if (correct || state.attempt >= MAX_ATTEMPTS) {
        state.gameOver = true;
        state.won      = correct;
        markGamePlayed('coverlock');
    }

    guessInput.value       = '';
    autocomplete.innerHTML = '';
    saveState(state);
    render();
}

document.getElementById('submitBtn').addEventListener('click', () => submitGuess(false));
document.getElementById('skipBtn').addEventListener('click',   () => submitGuess(true));
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter' && acIndex < 0) submitGuess(false); });

// ============================================
// RENDER
// ============================================
function render() {
    updateBlur();
    renderClues();

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

    const listEl = document.getElementById('guessesList');
    listEl.innerHTML = '';
    state.guesses.forEach(g => {
        const el       = document.createElement('div');
        el.className   = `guess-item ${g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong'}`;
        el.textContent = g.text;
        listEl.appendChild(el);
    });

    if (state.gameOver) {
        document.getElementById('inputSection').style.display = 'none';
        const box = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className     = `result-box ${state.won ? 'win' : 'lose'}`;
        const songLine   = songData ? `<p class="cover-result-track">${songData.trackName}</p>` : '';
        const playerHTML = (songData && songData.previewUrl)
            ? `<div class="cover-preview-player">
                   <audio id="coverAudio" src="${songData.previewUrl}" preload="auto"></audio>
                   <button class="cover-play-btn" id="coverPlayBtn">▶ Play Preview</button>
               </div>`
            : '';

        box.innerHTML = state.won
            ? `<h3>Got it!</h3>
               <p>You identified the artist in <strong>${state.attempt}</strong> guess${state.attempt !== 1 ? 'es' : ''}!</p>
               <p class="answer-reveal">${todaySong.artist}</p>
               ${songLine}${playerHTML}
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`
            : `<h3>Better luck tomorrow!</h3>
               <p>The artist was:</p>
               <p class="answer-reveal">${todaySong.artist}</p>
               ${songLine}${playerHTML}
               <a href="../../index.html" class="back-home-btn">Back to Games</a>`;

        if (songData && songData.previewUrl) {
            const audio   = document.getElementById('coverAudio');
            const playBtn = document.getElementById('coverPlayBtn');
            audio.volume = 0.26;
            audio.play().catch(() => {});
            playBtn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play();
                    playBtn.textContent = '⏸ Pause';
                } else {
                    audio.pause();
                    playBtn.textContent = '▶ Play Preview';
                }
            });
            audio.addEventListener('play',  () => { playBtn.textContent = '⏸ Pause'; });
            audio.addEventListener('pause', () => { playBtn.textContent = '▶ Play Preview'; });
            audio.addEventListener('ended', () => { playBtn.textContent = '▶ Play Preview'; });
        }
    }
}

render();
