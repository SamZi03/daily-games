// EARLOCK — game logic. Song data lives in data.js

const CLIP_LENGTHS = [0.1, 0.5, 2, 4, 8, 15];
const MAX_ATTEMPTS = 6;
const MAX_CLIP     = 15;

const todaySong = SONGS[getDailyIndex(SONGS)];
const SAVE_KEY  = 'earworm_' + getTodayString();

// ============================================
// ITUNES API
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
    } catch { return null; }
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
const audio       = document.getElementById('audioPlayer');
audio.volume      = 0.35;
const playBtn     = document.getElementById('playBtn');
const clipLabel   = document.getElementById('clipSeconds');
const audioNote   = document.getElementById('audioNote');
const clipPointer = document.getElementById('clipPointer');
const progressBar = document.getElementById('progressBar');
const progressWrap = document.getElementById('progressWrap');
let previewUrl = null;

playBtn.disabled = true;
audioNote.textContent = 'Loading audio...';

CLIP_LENGTHS.slice(0, -1).forEach(len => {
    const marker = document.createElement('div');
    marker.className  = 'progress-marker';
    marker.style.left = (len / MAX_CLIP * 100) + '%';
    progressWrap.appendChild(marker);
});

fetchPreviewUrl(todaySong.title, todaySong.artist).then(url => {
    if (url) {
        previewUrl        = url;
        audio.preload     = 'auto';
        audio.src         = url;
        audioNote.textContent  = '30-second preview via iTunes';
        playBtn.disabled  = false;
    } else {
        audioNote.textContent = 'Audio unavailable for this song — guessing still works!';
    }
});

function startClip(seconds) {
    playBtn.disabled = true;
    playBtn.textContent = '⏸';
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';

    audio.play().then(() => {
        const pct = (seconds / MAX_CLIP * 100).toFixed(2) + '%';
        requestAnimationFrame(() => {
            progressBar.style.transition = `width ${seconds}s linear`;
            progressBar.style.width = pct;
        });
        setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            playBtn.disabled  = false;
            playBtn.textContent = '▶';
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        }, seconds * 1000);
    }).catch(() => {
        audio.src = previewUrl;
        audio.load();
        audio.addEventListener('canplay', () => startClip(seconds), { once: true });
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
        s.title.toLowerCase().includes(val) || s.artist.toLowerCase().includes(val)
    ).slice(0, 6);
    matches.forEach(song => {
        const item = document.createElement('div');
        item.className  = 'autocomplete-item';
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

    const correct = !skipped && raw.toLowerCase().includes(todaySong.title.toLowerCase());
    state.guesses.push({ text: skipped ? '(skipped)' : raw, correct, skipped });
    state.attempt++;

    if (correct || state.attempt >= MAX_ATTEMPTS) {
        state.gameOver = true;
        state.won      = correct;
        markGamePlayed('earlock');
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
    if (!guessInput.contains(e.target) && !autocomplete.contains(e.target))
        autocomplete.innerHTML = '';
});

// ============================================
// FULL PREVIEW
// ============================================
function playFullPreview() {
    if (!previewUrl) return;
    const bar = document.getElementById('fullProgressBar');
    if (!bar) return;

    audio.pause();
    audio.currentTime = 0;
    bar.style.transition = 'none';
    bar.style.width = '0%';

    const doPlay = () => {
        audio.play().then(() => {
            requestAnimationFrame(() => {
                bar.style.transition = 'width 30s linear';
                bar.style.width = '100%';
            });
            audio.onended = () => {
                bar.style.transition = 'none';
                bar.style.width = '0%';
                audio.onended = null;
            };
        }).catch(() => {
            audio.src = previewUrl;
            audio.load();
            audio.addEventListener('canplay', doPlay, { once: true });
        });
    };

    if (audio.currentTime > 0) audio.addEventListener('seeked', doPlay, { once: true });
    else doPlay();
}

// ============================================
// RENDER
// ============================================
function render() {
    const clipIndex = Math.min(state.attempt, CLIP_LENGTHS.length - 1);
    const seconds   = CLIP_LENGTHS[clipIndex];

    clipLabel.textContent  = seconds + 's';
    clipPointer.style.left = (seconds / MAX_CLIP * 100) + '%';

    const audioSection = document.getElementById('audioSection');
    if (audioSection) audioSection.style.display = state.gameOver ? 'none' : 'flex';

    const rowsEl = document.getElementById('guessRows');
    rowsEl.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row = document.createElement('div');
        row.className = 'heardle-guess-row';
        if (i < state.guesses.length) {
            const g = state.guesses[i];
            row.classList.add(g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong');
            row.textContent = g.skipped ? 'Skipped' : g.text;
        }
        rowsEl.appendChild(row);
    }

    if (state.gameOver) {
        document.getElementById('inputSection').style.display = 'none';
        const box = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className = `result-box ${state.won ? 'win' : 'lose'}`;
        const resultText = state.won
            ? `<h3>Nice one!</h3><p>You got it in <strong>${state.attempt}</strong> guess${state.attempt !== 1 ? 'es' : ''}!</p>`
            : `<h3>Better luck tomorrow!</h3><p>The song was:</p>`;
        box.innerHTML = `
            ${resultText}
            <p class="answer-reveal">${todaySong.title} — ${todaySong.artist}</p>
            <div class="full-player">
                <div class="progress-bar-wrap" id="fullProgressWrap">
                    <div class="progress-bar" id="fullProgressBar"></div>
                </div>
            </div>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        `;
        setTimeout(playFullPreview, 400);
    }
}

render();
