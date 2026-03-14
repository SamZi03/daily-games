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
    { title: "Blinding Lights",     artist: "The Weeknd",                    streams: 3900000000 },
    { title: "Starboy",             artist: "The Weeknd",                    streams: 2100000000 },
    { title: "Can't Feel My Face",  artist: "The Weeknd",                    streams: 1900000000 },
    { title: "I Feel It Coming",    artist: "The Weeknd",                    streams: 1700000000 },
    { title: "Earned It",           artist: "The Weeknd",                    streams: 1500000000 },
    { title: "God's Plan",          artist: "Drake",                         streams: 2200000000 },
    { title: "Hotline Bling",       artist: "Drake",                         streams: 1900000000 },
    { title: "In My Feelings",      artist: "Drake",                         streams: 1700000000 },
    { title: "Started From the Bottom", artist: "Drake",                     streams: 1100000000 },
    { title: "Passionfruit",        artist: "Drake",                         streams: 1200000000 },
    { title: "HUMBLE.",             artist: "Kendrick Lamar",                streams: 2100000000 },
    { title: "Not Like Us",         artist: "Kendrick Lamar",                streams: 1400000000 },
    { title: "Alright",             artist: "Kendrick Lamar",                streams: 900000000  },
    { title: "Swimming Pools",      artist: "Kendrick Lamar",                streams: 950000000  },
    { title: "Sicko Mode",          artist: "Travis Scott",                  streams: 2900000000 },
    { title: "Goosebumps",          artist: "Travis Scott",                  streams: 1800000000 },
    { title: "HIGHEST IN THE ROOM", artist: "Travis Scott",                  streams: 1200000000 },
    { title: "Lucid Dreams",        artist: "Juice WRLD",                    streams: 2200000000 },
    { title: "All Girls Are the Same", artist: "Juice WRLD",                 streams: 1000000000 },
    { title: "SAD!",                artist: "XXXTentacion",                  streams: 2000000000 },
    { title: "Moonlight",           artist: "XXXTentacion",                  streams: 1200000000 },
    { title: "Dior",                artist: "Pop Smoke",                     streams: 1500000000 },
    { title: "The Box",             artist: "Roddy Ricch",                   streams: 1700000000 },
    { title: "Drip Too Hard",       artist: "Lil Baby",                      streams: 1100000000 },
    { title: "Mask Off",            artist: "Future",                        streams: 1400000000 },
    { title: "Super Bass",          artist: "Nicki Minaj",                   streams: 1500000000 },
    { title: "Anaconda",            artist: "Nicki Minaj",                   streams: 1300000000 },
    { title: "Dakiti",              artist: "Bad Bunny",                     streams: 2400000000 },
    { title: "Titi Me Pregunto",    artist: "Bad Bunny",                     streams: 1900000000 },
    { title: "Me Porto Bonito",     artist: "Bad Bunny",                     streams: 1600000000 },
    { title: "Say So",              artist: "Doja Cat",                      streams: 1400000000 },
    { title: "Kiss Me More",        artist: "Doja Cat",                      streams: 1200000000 },
    { title: "Good Days",           artist: "SZA",                           streams: 1100000000 },
    { title: "Just The Way You Are", artist: "Bruno Mars",                   streams: 2400000000 },
    { title: "Locked Out of Heaven", artist: "Bruno Mars",                   streams: 1900000000 },
    { title: "24K Magic",           artist: "Bruno Mars",                    streams: 1600000000 },
    { title: "That's What I Like",  artist: "Bruno Mars",                    streams: 1500000000 },
    { title: "Grenade",             artist: "Bruno Mars",                    streams: 1400000000 },
    { title: "Someone You Loved",   artist: "Lewis Capaldi",                 streams: 2100000000 },
    { title: "Before You Go",       artist: "Lewis Capaldi",                 streams: 1400000000 },
    { title: "Without Me",          artist: "Halsey",                        streams: 1400000000 },
    { title: "Young Dumb & Broke",  artist: "Khalid",                        streams: 1300000000 },
    { title: "Closer",              artist: "The Chainsmokers",              streams: 3000000000 },
    { title: "Don't Let Me Down",   artist: "The Chainsmokers",              streams: 1600000000 },
    { title: "Something Just Like This", artist: "The Chainsmokers",         streams: 1700000000 },
    { title: "Happier",             artist: "Marshmello",                    streams: 1600000000 },
    { title: "Friends",             artist: "Marshmello",                    streams: 1200000000 },
    { title: "Summer",              artist: "Calvin Harris",                 streams: 1300000000 },
    { title: "This Is What You Came For", artist: "Calvin Harris",           streams: 1500000000 },
    { title: "Chandelier",          artist: "Sia",                           streams: 2200000000 },
    { title: "Cheap Thrills",       artist: "Sia",                           streams: 2200000000 },
    { title: "Thinkin Bout You",    artist: "Frank Ocean",                   streams: 1100000000 },
    { title: "Redbone",             artist: "Childish Gambino",              streams: 1300000000 },
    { title: "This Is America",     artist: "Childish Gambino",              streams: 1100000000 },
    { title: "Ocean Eyes",          artist: "Billie Eilish",                 streams: 1600000000 },
    { title: "Lovely",              artist: "Billie Eilish",                 streams: 2000000000 },
    { title: "What Was I Made For", artist: "Billie Eilish",                 streams: 1200000000 },
    { title: "Cardigan",            artist: "Taylor Swift",                  streams: 1800000000 },
    { title: "willow",              artist: "Taylor Swift",                  streams: 1200000000 },
    { title: "All Too Well",        artist: "Taylor Swift",                  streams: 1600000000 },
    { title: "Shake It Off",        artist: "Taylor Swift",                  streams: 3300000000 },
    { title: "Blank Space",         artist: "Taylor Swift",                  streams: 3000000000 },
    { title: "In The End",          artist: "Linkin Park",                   streams: 1900000000 },
    { title: "Numb",                artist: "Linkin Park",                   streams: 1600000000 },
    { title: "Boulevard of Broken Dreams", artist: "Green Day",              streams: 1500000000 },
    { title: "Mr. Brightside",      artist: "The Killers",                   streams: 1400000000 },
    { title: "Do I Wanna Know?",    artist: "Arctic Monkeys",                streams: 1200000000 },
    { title: "Yellow",              artist: "Coldplay",                      streams: 1700000000 },
    { title: "Fix You",             artist: "Coldplay",                      streams: 1400000000 },
    { title: "Viva la Vida",        artist: "Coldplay",                      streams: 1600000000 },
    { title: "Madness",             artist: "Muse",                          streams: 950000000  },
    { title: "Supermassive Black Hole", artist: "Muse",                      streams: 900000000  },
    { title: "Rehab",               artist: "Amy Winehouse",                 streams: 1000000000 },
    { title: "Back to Black",       artist: "Amy Winehouse",                 streams: 1100000000 },
    { title: "Take Me to Church",   artist: "Hozier",                        streams: 1500000000 },
    { title: "Summertime Sadness",  artist: "Lana Del Rey",                  streams: 1200000000 },
    { title: "The Less I Know the Better", artist: "Tame Impala",            streams: 1000000000 },
    { title: "Bohemian Rhapsody",   artist: "Queen",                         streams: 2500000000 },
    { title: "Don't Stop Me Now",   artist: "Queen",                         streams: 1300000000 },
    { title: "Billie Jean",         artist: "Michael Jackson",               streams: 1600000000 },
    { title: "Thriller",            artist: "Michael Jackson",               streams: 900000000  },
    { title: "Smells Like Teen Spirit", artist: "Nirvana",                   streams: 1400000000 },
    { title: "Enter Sandman",       artist: "Metallica",                     streams: 1200000000 },
    { title: "Welcome to the Jungle", artist: "Guns N' Roses",               streams: 1100000000 },
    { title: "Hotel California",    artist: "Eagles",                        streams: 1200000000 },
    { title: "Stairway to Heaven",  artist: "Led Zeppelin",                  streams: 1300000000 },
    { title: "Another Brick in the Wall", artist: "Pink Floyd",              streams: 950000000  },
    { title: "Hey Jude",            artist: "The Beatles",                   streams: 1100000000 },
    { title: "Come Together",       artist: "The Beatles",                   streams: 1000000000 },
    { title: "Rolling in the Deep", artist: "Adele",                         streams: 2800000000 },
    { title: "Hello",               artist: "Adele",                         streams: 2700000000 },
    { title: "Someone Like You",    artist: "Adele",                         streams: 2400000000 },
    { title: "I Will Always Love You", artist: "Whitney Houston",            streams: 1800000000 },
    { title: "I Wanna Dance with Somebody", artist: "Whitney Houston",       streams: 1400000000 },
    { title: "All I Want for Christmas Is You", artist: "Mariah Carey",      streams: 2600000000 },
    { title: "We Belong Together",  artist: "Mariah Carey",                  streams: 1100000000 },
    { title: "Dancing Queen",       artist: "ABBA",                          streams: 1300000000 },
    { title: "Mamma Mia",           artist: "ABBA",                          streams: 1100000000 },
    { title: "Uptown Funk",         artist: "Mark Ronson",                   streams: 3500000000 },
    { title: "Happy",               artist: "Pharrell Williams",             streams: 2200000000 },
    { title: "Despacito",           artist: "Luis Fonsi",                    streams: 8000000000 },
    { title: "Old Town Road",       artist: "Lil Nas X",                     streams: 2800000000 },
    { title: "Thank U Next",        artist: "Ariana Grande",                 streams: 2200000000 },
    { title: "7 Rings",             artist: "Ariana Grande",                 streams: 1900000000 },
    { title: "Bad Romance",         artist: "Lady Gaga",                     streams: 1800000000 },
    { title: "Poker Face",          artist: "Lady Gaga",                     streams: 1700000000 },
    { title: "Umbrella",            artist: "Rihanna",                       streams: 1400000000 },
    { title: "Diamonds",            artist: "Rihanna",                       streams: 2100000000 },
    { title: "We Found Love",       artist: "Rihanna",                       streams: 1600000000 },
    { title: "Crazy In Love",       artist: "Beyonce",                       streams: 1700000000 },
    { title: "Halo",                artist: "Beyonce",                       streams: 1500000000 },
    { title: "New Rules",           artist: "Dua Lipa",                      streams: 2400000000 },
    { title: "Don't Start Now",     artist: "Dua Lipa",                      streams: 2300000000 },
    { title: "Sorry",               artist: "Justin Bieber",                 streams: 2500000000 },
    { title: "Love Yourself",       artist: "Justin Bieber",                 streams: 2200000000 },
    { title: "Lose Yourself",       artist: "Eminem",                        streams: 2100000000 },
    { title: "Love the Way You Lie", artist: "Eminem",                       streams: 1700000000 },
    { title: "Gold Digger",         artist: "Kanye West",                    streams: 1200000000 },
    { title: "Power",               artist: "Kanye West",                    streams: 900000000  },
    { title: "Hips Don't Lie",      artist: "Shakira",                       streams: 1400000000 },
    { title: "Mi Gente",            artist: "J Balvin",                      streams: 1600000000 },
    { title: "Levels",              artist: "Avicii",                        streams: 1600000000 },
    { title: "Wake Me Up",          artist: "Avicii",                        streams: 2100000000 },
    { title: "Get Lucky",           artist: "Daft Punk",                     streams: 1600000000 },
    { title: "Lean On",             artist: "Major Lazer",                   streams: 2200000000 },
    { title: "Rockstar",            artist: "Post Malone",                   streams: 2500000000 },
    { title: "Circles",             artist: "Post Malone",                   streams: 2000000000 },
    { title: "Stan",                artist: "Eminem",                        streams: 1100000000 },
    { title: "How You Like That",   artist: "BLACKPINK",                     streams: 1200000000 },
    { title: "DNA",                 artist: "BTS",                           streams: 1100000000 },
    { title: "Boy With Luv",        artist: "BTS",                           streams: 1000000000 },
    { title: "Dynamite",            artist: "BTS",                           streams: 1800000000 },
    { title: "Doja",                artist: "Central Cee",                   streams: 800000000  },
    { title: "Funky Friday",        artist: "Dave",                          streams: 700000000  },
    { title: "Vossi Bop",           artist: "Stormzy",                       streams: 650000000  },
    { title: "Sprinter",            artist: "Dave",                          streams: 750000000  },
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
    const correct = right.streams === left.streams || guess === (right.streams > left.streams ? 'higher' : 'lower');

    const clickedEl      = document.getElementById(clickedSide === 'left' ? 'cardLeft' : 'cardRight');
    const leftStreamsEl  = document.getElementById('cardLeftStreams');
    const rightStreamsEl = document.getElementById('cardRightStreams');
    const leftAlreadyShown = state.index > 1;

    function finalize() {
        clickedEl.classList.add(correct ? 'hl-pop-correct' : 'hl-pop-wrong');
        if (correct) {
            state.score++;
            state.index++;
            if (state.index >= orderedSongs.length) state.index = 1;
            saveState(state);
            setTimeout(renderQuestion, 1600);
        } else {
            state.gameOver = true;
            markGamePlayed('statlock');
            saveState(state);
            setTimeout(showResult, 1600);
        }
    }

    if (leftAlreadyShown) {
        // Left card already shows its number — only reveal the right card
        animateCount(rightStreamsEl, right.streams, finalize);
    } else {
        // Round 1 — both cards are unknown, animate clicked first then the other
        const clickedStreamsEl = clickedSide === 'left' ? leftStreamsEl : rightStreamsEl;
        const otherStreamsEl   = clickedSide === 'left' ? rightStreamsEl : leftStreamsEl;
        const otherSong        = clickedSide === 'left' ? right : left;
        const clickedSong      = clickedSide === 'left' ? left : right;
        animateCount(clickedStreamsEl, clickedSong.streams, () => {
            animateCount(otherStreamsEl, otherSong.streams, finalize);
        });
    }
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
