// EARLOCK — game logic. Song data lives in data.js (GENRES object)

const CLIP_LENGTHS = [0.1, 0.5, 2, 4, 8, 15];
const MAX_ATTEMPTS = 6;
const MAX_CLIP     = 15;
const TODAY        = getTodayString();
const PICK_KEY     = 'earworm_picks_' + TODAY;

// ============================================
// AUDIO (shared across tabs)
// ============================================
const audio        = document.getElementById('audioPlayer');
audio.volume       = 0.26;
const playBtn      = document.getElementById('playBtn');
const clipLabel    = document.getElementById('clipSeconds');
const audioNote    = document.getElementById('audioNote');
const clipPointer  = document.getElementById('clipPointer');
const progressBar  = document.getElementById('progressBar');
const progressWrap = document.getElementById('progressWrap');

playBtn.disabled = true;

CLIP_LENGTHS.slice(0, -1).forEach(len => {
    const marker      = document.createElement('div');
    marker.className  = 'progress-marker';
    marker.style.left = (len / MAX_CLIP * 100) + '%';
    progressWrap.appendChild(marker);
});

// ============================================
// GENRE PICKER
// ============================================
let activePicks = JSON.parse(localStorage.getItem(PICK_KEY) || 'null');

function showGenrePicker() {
    const overlay = document.getElementById('genrePicker');
    const grid    = document.getElementById('genreGrid');
    const btn     = document.getElementById('genreConfirmBtn');
    overlay.style.display = 'flex';
    document.body.classList.add('picker-active');
    grid.innerHTML = '';

    const picks = [];

    Object.entries(GENRES).forEach(([key, g]) => {
        const tile       = document.createElement('button');
        tile.className   = 'genre-tile';
        tile.textContent = g.label;
        tile.addEventListener('click', () => {
            if (tile.classList.contains('selected')) {
                tile.classList.remove('selected');
                picks.splice(picks.indexOf(key), 1);
            } else if (picks.length < 3) {
                tile.classList.add('selected');
                picks.push(key);
            }
            const rem       = 3 - picks.length;
            btn.disabled    = picks.length !== 3;
            btn.textContent = picks.length === 3 ? 'Play →' : `Choose ${rem} more`;
        });
        grid.appendChild(tile);
    });

    btn.addEventListener('click', () => {
        if (picks.length !== 3) return;
        localStorage.setItem(PICK_KEY, JSON.stringify(picks));
        activePicks = picks;
        overlay.style.display = 'none';
        document.body.classList.remove('picker-active');
        initGame(picks);
    });
}

// ============================================
// GAME STATE
// ============================================
let tabs      = [];  // [{genreKey, genreLabel, song, state, previewUrl, previewLoaded}]
let activeTab = 0;

function loadTabState(genreKey) {
    const k = 'earworm_' + genreKey + '_' + TODAY;
    return JSON.parse(localStorage.getItem(k) || 'null') || {
        attempt: 0, guesses: [], gameOver: false, won: false
    };
}
function saveTabState() {
    const t = tabs[activeTab];
    localStorage.setItem('earworm_' + t.genreKey + '_' + TODAY, JSON.stringify(t.state));
}

// ============================================
// GAME INIT
// ============================================
function initGame(picks) {
    tabs = picks.map(key => {
        const g = GENRES[key];
        return {
            genreKey:      key,
            genreLabel:    g.label,
            song:          g.songs[getDailyIndex(g.songs)],
            state:         loadTabState(key),
            previewUrl:    null,
            previewLoaded: false,
        };
    });

    buildTabBar();
    fetchAllPreviews();
    switchTab(0);
}

function buildTabBar() {
    const container = document.getElementById('genreTabs');
    container.innerHTML = '';
    tabs.forEach((t, i) => {
        const btn       = document.createElement('button');
        btn.className   = 'earlock-tab';
        btn.textContent = t.genreLabel;
        btn.addEventListener('click', () => switchTab(i));
        container.appendChild(btn);
    });
}

function switchTab(i) {
    // stop audio
    audio.pause();
    audio.currentTime = 0;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    playBtn.textContent = '▶';

    activeTab = i;

    // update tab styles
    document.querySelectorAll('.earlock-tab').forEach((b, idx) => {
        b.classList.remove('active', 'done-correct', 'done-wrong');
        if (idx === activeTab) b.classList.add('active');
        const t = tabs[idx];
        if (t.state.gameOver) b.classList.add(t.state.won ? 'done-correct' : 'done-wrong');
    });

    // load audio for this tab
    const t = tabs[activeTab];
    if (t.previewUrl) {
        audio.src        = t.previewUrl;
        playBtn.disabled = t.state.gameOver;
        audioNote.textContent = '';
    } else {
        audio.src        = '';
        playBtn.disabled = true;
        audioNote.textContent = t.previewLoaded ? 'Audio unavailable — guessing still works!' : 'Loading audio...';
    }

    render();
}

async function fetchAllPreviews() {
    await Promise.all(tabs.map(async (t, i) => {
        const url          = await fetchPreviewUrl(t.song.title, t.song.artist);
        t.previewUrl       = url || null;
        t.previewLoaded    = true;
        if (i === activeTab) {
            if (url) {
                audio.src        = url;
                playBtn.disabled = t.state.gameOver;
                audioNote.textContent = '';
            } else {
                audioNote.textContent = 'Audio unavailable — guessing still works!';
            }
        }
    }));
}

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
// AUDIO PLAYBACK
// ============================================
function startClip(seconds) {
    playBtn.disabled    = true;
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
            audio.currentTime   = 0;
            playBtn.disabled    = false;
            playBtn.textContent = '▶';
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        }, seconds * 1000);
    }).catch(() => {
        const t = tabs[activeTab];
        if (t && t.previewUrl) {
            audio.src = t.previewUrl;
            audio.load();
            audio.addEventListener('canplay', () => startClip(seconds), { once: true });
        }
    });
}

playBtn.addEventListener('click', () => {
    const t = tabs[activeTab];
    if (!t || !t.previewUrl) return;
    const seconds = CLIP_LENGTHS[Math.min(t.state.attempt, CLIP_LENGTHS.length - 1)];
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
let acIndex = -1;

function acSetIndex(i) {
    const items = autocomplete.querySelectorAll('.autocomplete-item');
    items.forEach(el => el.classList.remove('active'));
    acIndex = Math.max(-1, Math.min(i, items.length - 1));
    if (acIndex >= 0) items[acIndex].classList.add('active');
}

guessInput.addEventListener('input', () => {
    const val = guessInput.value.toLowerCase().trim();
    autocomplete.innerHTML = '';
    acIndex = -1;
    if (!val || !tabs.length) return;
    const songs = GENRES[tabs[activeTab].genreKey].songs;
    songs.filter(s =>
        s.title.toLowerCase().includes(val) || s.artist.toLowerCase().includes(val)
    ).slice(0, 6).forEach(song => {
        const item       = document.createElement('div');
        item.className   = 'autocomplete-item';
        item.textContent = `${song.title} — ${song.artist}`;
        item.addEventListener('click', () => {
            guessInput.value   = item.textContent;
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

// ============================================
// SUBMIT GUESS
// ============================================
function showEarlockMsg(msg) {
    const el = document.getElementById('earlockMsg');
    if (!el) return;
    el.textContent = msg;
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 2000);
}

function submitGuess(skipped) {
    if (!tabs.length) return;
    const t = tabs[activeTab];
    if (t.state.gameOver) return;
    const raw = guessInput.value.trim();
    if (!skipped && !raw) return;

    if (!skipped) {
        const songs   = GENRES[t.genreKey].songs;
        const matched = songs.some(s => raw === `${s.title} — ${s.artist}`);
        if (!matched) { showEarlockMsg('Please select a song from the list'); return; }
    }

    const correct = !skipped && raw.toLowerCase().includes(t.song.title.toLowerCase());
    t.state.guesses.push({ text: skipped ? '(skipped)' : raw, correct, skipped });
    t.state.attempt++;

    if (correct || t.state.attempt >= MAX_ATTEMPTS) {
        t.state.gameOver = true;
        t.state.won      = correct;
        if (tabs.every(tab => tab.state.gameOver)) markGamePlayed('earlock');
    }

    guessInput.value       = '';
    autocomplete.innerHTML = '';
    saveTabState();
    switchTab(activeTab);
}

document.getElementById('submitBtn').addEventListener('click', () => submitGuess(false));
document.getElementById('skipBtn').addEventListener('click',   () => submitGuess(true));
guessInput.addEventListener('keydown', e => { if (e.key === 'Enter' && acIndex < 0) submitGuess(false); });
document.addEventListener('click', e => {
    if (!guessInput.contains(e.target) && !autocomplete.contains(e.target))
        autocomplete.innerHTML = '';
});

// ============================================
// FULL PREVIEW (result screen)
// ============================================
function playFullPreview() {
    const t = tabs[activeTab];
    if (!t || !t.previewUrl) return;
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
            audio.src = t.previewUrl;
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
    if (!tabs.length) return;
    const t     = tabs[activeTab];
    const state = t.state;

    const clipIndex = Math.min(state.attempt, CLIP_LENGTHS.length - 1);
    const seconds   = CLIP_LENGTHS[clipIndex];
    clipLabel.textContent  = seconds + 's';
    clipPointer.style.left = (seconds / MAX_CLIP * 100) + '%';

    const audioSection = document.getElementById('audioSection');
    if (audioSection) audioSection.style.display = state.gameOver ? 'none' : 'flex';

    const rowsEl = document.getElementById('guessRows');
    rowsEl.innerHTML = '';
    for (let i = 0; i < MAX_ATTEMPTS; i++) {
        const row     = document.createElement('div');
        row.className = 'heardle-guess-row';
        if (i < state.guesses.length) {
            const g = state.guesses[i];
            row.classList.add(g.correct ? 'correct' : g.skipped ? 'skipped' : 'wrong');
            row.textContent = g.skipped ? 'Skipped' : g.text;
        }
        rowsEl.appendChild(row);
    }

    const inputSection = document.getElementById('inputSection');
    const resultBox    = document.getElementById('resultBox');

    if (state.gameOver) {
        inputSection.style.display = 'none';
        resultBox.style.display    = 'block';
        resultBox.className        = `result-box ${state.won ? 'win' : 'lose'}`;
        const resultText = state.won
            ? `<h3>Nice one!</h3><p>You got it in <strong>${state.attempt}</strong> guess${state.attempt !== 1 ? 'es' : ''}!</p>`
            : `<h3>Better luck tomorrow!</h3><p>The song was:</p>`;
        resultBox.innerHTML = `
            ${resultText}
            <p class="answer-reveal">${t.song.title} — ${t.song.artist}</p>
            <div class="full-player">
                <div class="progress-bar-wrap" id="fullProgressWrap">
                    <div class="progress-bar" id="fullProgressBar"></div>
                </div>
            </div>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        `;
        setTimeout(playFullPreview, 400);
    } else {
        inputSection.style.display = 'block';
        resultBox.style.display    = 'none';
        resultBox.innerHTML        = '';
    }
}

// ============================================
// BOOT
// ============================================
if (!activePicks) {
    showGenrePicker();
} else {
    initGame(activePicks);
}
