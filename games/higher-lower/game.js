// ============================================
// SONG DATABASE (Spotify streams, approximate)
// ============================================
const SONGS = [
    { title: "Shape of You",        artist: "Ed Sheeran",                    streams: 4000000000 },
    { title: "Blinding Lights",     artist: "The Weeknd",                    streams: 3900000000 },
    { title: "Cruel Summer",        artist: "Taylor Swift",                  streams: 3100000000 },
    { title: "Sunflower",           artist: "Post Malone",                   streams: 3200000000 },
    { title: "Dance Monkey",        artist: "Tones and I",                   streams: 2700000000 },
    { title: "Bad Guy",             artist: "Billie Eilish",                 streams: 2800000000 },
    { title: "As It Was",           artist: "Harry Styles",                  streams: 2600000000 },
    { title: "Rockstar",            artist: "Post Malone",                   streams: 2500000000 },
    { title: "One Dance",           artist: "Drake",                         streams: 2400000000 },
    { title: "Senorita",            artist: "Shawn Mendes",                  streams: 2400000000 },
    { title: "Levitating",          artist: "Dua Lipa",                      streams: 2200000000 },
    { title: "Watermelon Sugar",    artist: "Harry Styles",                  streams: 2100000000 },
    { title: "Heat Waves",          artist: "Glass Animals",                 streams: 2000000000 },
    { title: "Save Your Tears",     artist: "The Weeknd",                    streams: 2000000000 },
    { title: "Stay",                artist: "The Kid LAROI",                 streams: 2300000000 },
    { title: "drivers license",     artist: "Olivia Rodrigo",                streams: 1800000000 },
    { title: "Easy On Me",          artist: "Adele",                         streams: 1700000000 },
    { title: "good 4 u",            artist: "Olivia Rodrigo",                streams: 1600000000 },
    { title: "Calm Down",           artist: "Rema",                          streams: 1600000000 },
    { title: "Industry Baby",       artist: "Lil Nas X",                     streams: 1500000000 },
    { title: "Flowers",             artist: "Miley Cyrus",                   streams: 1500000000 },
    { title: "Kill Bill",           artist: "SZA",                           streams: 1400000000 },
    { title: "Golden Hour",         artist: "JVKE",                          streams: 1300000000 },
    { title: "Butter",              artist: "BTS",                           streams: 1300000000 },
    { title: "Unholy",              artist: "Sam Smith",                     streams: 1200000000 },
    { title: "abcdefu",             artist: "GAYLE",                         streams: 1200000000 },
    { title: "Peaches",             artist: "Justin Bieber",                 streams: 1100000000 },
    { title: "Anti-Hero",           artist: "Taylor Swift",                  streams: 1900000000 },
    { title: "Escapism.",           artist: "RAYE",                          streams: 900000000  },
    { title: "vampire",             artist: "Olivia Rodrigo",                streams: 1000000000 },
];

const SAVE_KEY = 'higher-lower_' + getTodayString();

// ============================================
// ITUNES ARTWORK CACHE
// ============================================
const artworkCache = {};

async function getArtwork(title, artist) {
    const key = title + artist;
    if (artworkCache[key] !== undefined) return artworkCache[key];
    try {
        const q   = encodeURIComponent(`${title} ${artist}`);
        const res = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=5`);
        const data = await res.json();
        const match = data.results.find(r =>
            r.trackName.toLowerCase().includes(title.toLowerCase())
        ) || data.results[0];
        const url = match ? match.artworkUrl100.replace('100x100bb', '400x400bb') : null;
        artworkCache[key] = url;
        return url;
    } catch {
        artworkCache[key] = null;
        return null;
    }
}

// ============================================
// HELPERS
// ============================================
function formatStreams(n) {
    return Math.round(n).toLocaleString();
}

// Seeded daily shuffle
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
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        index: 1,
        score: 0,
        gameOver: false
    };
}

function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state    = loadState();
let busy     = false; // prevent double-clicks during animation

function leftSong()  { return orderedSongs[state.index - 1]; }
function rightSong() { return orderedSongs[state.index % orderedSongs.length]; }

// ============================================
// BUILD CARD HTML
// ============================================
function cardHTML(id, song, showStreams) {
    return `
        <div class="hl-card" id="${id}">
            <div class="hl-card-img-wrap">
                <img class="hl-card-img" id="${id}Img" src="" alt="${song.title}">
            </div>
            <div class="hl-song-title">${song.title}</div>
            <div class="hl-song-artist">${song.artist}</div>
            <div class="hl-streams" id="${id}Streams">
                ${showStreams ? formatStreams(song.streams) : '?'}
            </div>
        </div>
    `;
}

// ============================================
// COUNT-UP ANIMATION
// ============================================
function animateCount(el, target, onDone) {
    const duration = 1400;
    const start    = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = target * eased;
        el.textContent = formatStreams(current);
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            el.textContent = formatStreams(target);
            if (onDone) onDone();
        }
    }

    requestAnimationFrame(step);
}

// ============================================
// RENDER QUESTION
// ============================================
async function renderQuestion() {
    if (state.gameOver) { showResult(); return; }

    busy = false;
    document.getElementById('scoreDisplay').textContent  = state.score;
    document.getElementById('questionDisplay').textContent = `Streak: ${state.score}`;
    document.getElementById('resultBox').style.display   = 'none';

    const left  = leftSong();
    const right = rightSong();

    // Left card already had its streams revealed in the previous round (unless it's the first round)
    const leftRevealed = state.index > 1;
    document.getElementById('hlCards').innerHTML =
        cardHTML('cardLeft', left, leftRevealed) + cardHTML('cardRight', right, false);

    // Load artwork in parallel
    const [leftUrl, rightUrl] = await Promise.all([
        getArtwork(left.title, left.artist),
        getArtwork(right.title, right.artist)
    ]);

    const leftImg  = document.getElementById('cardLeftImg');
    const rightImg = document.getElementById('cardRightImg');
    if (leftUrl)  { leftImg.src  = leftUrl;  }
    if (rightUrl) { rightImg.src = rightUrl; }

    // Clicking left card = guessing left has more (right is lower)
    // Clicking right card = guessing right has more (right is higher)
    document.getElementById('cardLeft').addEventListener('click',  () => choose('lower',  'left'));
    document.getElementById('cardRight').addEventListener('click', () => choose('higher', 'right'));
}

// ============================================
// CHOOSE
// ============================================
function choose(guess, clickedSide) {
    if (busy || state.gameOver) return;
    busy = true;

    const left    = leftSong();
    const right   = rightSong();
    // If streams are equal, both answers count as correct
    const correct = right.streams === left.streams || guess === (right.streams > left.streams ? 'higher' : 'lower');

    // Count up the clicked card first, then the other card, then show result
    const clickedSong   = clickedSide === 'left' ? left : right;
    const otherSong     = clickedSide === 'left' ? right : left;
    const clickedEl     = document.getElementById(clickedSide === 'left' ? 'cardLeft' : 'cardRight');
    const otherEl       = document.getElementById(clickedSide === 'left' ? 'cardRight' : 'cardLeft');
    const clickedStreams = document.getElementById(clickedSide === 'left' ? 'cardLeftStreams' : 'cardRightStreams');
    const otherStreams   = document.getElementById(clickedSide === 'left' ? 'cardRightStreams' : 'cardLeftStreams');

    // Step 1: count up clicked card
    animateCount(clickedStreams, clickedSong.streams, () => {
        // Step 2: count up the other card
        animateCount(otherStreams, otherSong.streams, () => {
            // Step 3: show result on clicked card
            clickedEl.classList.add(correct ? 'hl-pop-correct' : 'hl-pop-wrong');

            if (correct) {
                state.score++;
                state.index++;
                if (state.index >= orderedSongs.length) state.index = 1;
                saveState(state);
                setTimeout(renderQuestion, 1600);
            } else {
                state.gameOver = true;
                markGamePlayed('higher-lower');
                saveState(state);
                setTimeout(showResult, 1600);
            }
        });
    });
}

// ============================================
// RESULT
// ============================================
function showResult() {
    document.getElementById('hlCards').innerHTML = '';

    const box = document.getElementById('resultBox');
    box.style.display = 'block';
    box.className = `result-box ${state.score >= 5 ? 'win' : 'lose'}`;
    box.innerHTML = `
        <h3>${state.score >= 10 ? 'Incredible! 🔥' : state.score >= 5 ? 'Nice streak! 🎉' : 'Better luck tomorrow!'}</h3>
        <p>You got <strong>${state.score}</strong> in a row</p>
        <a href="../../index.html" class="back-home-btn">Back to Games</a>
    `;
}

renderQuestion();
