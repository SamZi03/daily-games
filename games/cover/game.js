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
    {title:"Calm Down", artist:"Rema"},
    {title:"Industry Baby", artist:"Lil Nas X"},
    {title:"Unholy", artist:"Sam Smith"},
    {title:"Save Your Tears", artist:"The Weeknd"},
    {title:"Butter", artist:"BTS"},
    {title:"Sunflower", artist:"Post Malone"},
    {title:"Bad Guy", artist:"Billie Eilish"},
    {title:"Montero", artist:"Lil Nas X"},
    // 2010s / 2020s
    {title:"Sign of the Times", artist:"Harry Styles"},
    {title:"Adore You", artist:"Harry Styles"},
    {title:"Cardigan", artist:"Taylor Swift"},
    {title:"Shake It Off", artist:"Taylor Swift"},
    {title:"Blank Space", artist:"Taylor Swift"},
    {title:"All Too Well", artist:"Taylor Swift"},
    {title:"willow", artist:"Taylor Swift"},
    {title:"Ocean Eyes", artist:"Billie Eilish"},
    {title:"Lovely", artist:"Billie Eilish"},
    {title:"What Was I Made For", artist:"Billie Eilish"},
    {title:"Can't Feel My Face", artist:"The Weeknd"},
    {title:"Starboy", artist:"The Weeknd"},
    {title:"Die For You", artist:"The Weeknd"},
    {title:"God's Plan", artist:"Drake"},
    {title:"One Dance", artist:"Drake"},
    {title:"Hold On, We're Going Home", artist:"Drake"},
    {title:"HUMBLE.", artist:"Kendrick Lamar"},
    {title:"Not Like Us", artist:"Kendrick Lamar"},
    {title:"Alright", artist:"Kendrick Lamar"},
    {title:"Sicko Mode", artist:"Travis Scott"},
    {title:"Goosebumps", artist:"Travis Scott"},
    {title:"Lucid Dreams", artist:"Juice WRLD"},
    {title:"SAD!", artist:"XXXTentacion"},
    {title:"Dior", artist:"Pop Smoke"},
    {title:"The Box", artist:"Roddy Ricch"},
    {title:"Say So", artist:"Doja Cat"},
    {title:"Kiss Me More", artist:"Doja Cat"},
    {title:"Good Days", artist:"SZA"},
    {title:"Rockstar", artist:"Post Malone"},
    {title:"Circles", artist:"Post Malone"},
    {title:"White Iverson", artist:"Post Malone"},
    {title:"Redbone", artist:"Childish Gambino"},
    {title:"This Is America", artist:"Childish Gambino"},
    {title:"Super Bass", artist:"Nicki Minaj"},
    {title:"Anaconda", artist:"Nicki Minaj"},
    {title:"Dakiti", artist:"Bad Bunny"},
    {title:"Titi Me Pregunto", artist:"Bad Bunny"},
    {title:"How You Like That", artist:"BLACKPINK"},
    {title:"Ddu-Du Ddu-Du", artist:"BLACKPINK"},
    {title:"DNA", artist:"BTS"},
    {title:"Boy With Luv", artist:"BTS"},
    // Rock / Alternative
    {title:"In The End", artist:"Linkin Park"},
    {title:"Numb", artist:"Linkin Park"},
    {title:"Do I Wanna Know?", artist:"Arctic Monkeys"},
    {title:"R U Mine?", artist:"Arctic Monkeys"},
    {title:"Mr. Brightside", artist:"The Killers"},
    {title:"Human", artist:"The Killers"},
    {title:"Welcome to the Black Parade", artist:"My Chemical Romance"},
    {title:"Helena", artist:"My Chemical Romance"},
    {title:"Sugar, We're Goin Down", artist:"Fall Out Boy"},
    {title:"Centuries", artist:"Fall Out Boy"},
    {title:"Misery Business", artist:"Paramore"},
    {title:"Still Into You", artist:"Paramore"},
    {title:"Boulevard of Broken Dreams", artist:"Green Day"},
    {title:"American Idiot", artist:"Green Day"},
    {title:"Everlong", artist:"Foo Fighters"},
    {title:"Best of You", artist:"Foo Fighters"},
    {title:"Yellow", artist:"Coldplay"},
    {title:"Fix You", artist:"Coldplay"},
    {title:"Viva la Vida", artist:"Coldplay"},
    {title:"Madness", artist:"Muse"},
    {title:"Supermassive Black Hole", artist:"Muse"},
    {title:"Rehab", artist:"Amy Winehouse"},
    {title:"Back to Black", artist:"Amy Winehouse"},
    {title:"Take Me to Church", artist:"Hozier"},
    {title:"Summertime Sadness", artist:"Lana Del Rey"},
    {title:"Born to Die", artist:"Lana Del Rey"},
    {title:"The Less I Know the Better", artist:"Tame Impala"},
    // Legends
    {title:"Bohemian Rhapsody", artist:"Queen"},
    {title:"Don't Stop Me Now", artist:"Queen"},
    {title:"We Will Rock You", artist:"Queen"},
    {title:"Billie Jean", artist:"Michael Jackson"},
    {title:"Thriller", artist:"Michael Jackson"},
    {title:"Smooth Criminal", artist:"Michael Jackson"},
    {title:"Smells Like Teen Spirit", artist:"Nirvana"},
    {title:"Come As You Are", artist:"Nirvana"},
    {title:"Stairway to Heaven", artist:"Led Zeppelin"},
    {title:"Kashmir", artist:"Led Zeppelin"},
    {title:"Another Brick in the Wall", artist:"Pink Floyd"},
    {title:"Comfortably Numb", artist:"Pink Floyd"},
    {title:"Hey Jude", artist:"The Beatles"},
    {title:"Come Together", artist:"The Beatles"},
    {title:"Here Comes the Sun", artist:"The Beatles"},
    {title:"Back in Black", artist:"AC/DC"},
    {title:"Highway to Hell", artist:"AC/DC"},
    {title:"Thunderstruck", artist:"AC/DC"},
    {title:"Enter Sandman", artist:"Metallica"},
    {title:"Nothing Else Matters", artist:"Metallica"},
    {title:"Sweet Child O' Mine", artist:"Guns N' Roses"},
    {title:"Welcome to the Jungle", artist:"Guns N' Roses"},
    {title:"(I Can't Get No) Satisfaction", artist:"The Rolling Stones"},
    {title:"Paint It Black", artist:"The Rolling Stones"},
    {title:"Hotel California", artist:"Eagles"},
    {title:"Purple Rain", artist:"Prince"},
    {title:"When Doves Cry", artist:"Prince"},
    {title:"Heroes", artist:"David Bowie"},
    {title:"Space Oddity", artist:"David Bowie"},
    {title:"Ziggy Stardust", artist:"David Bowie"},
    {title:"Rocket Man", artist:"Elton John"},
    {title:"Tiny Dancer", artist:"Elton John"},
    {title:"Crocodile Rock", artist:"Elton John"},
    {title:"In the Air Tonight", artist:"Phil Collins"},
    {title:"I Will Always Love You", artist:"Whitney Houston"},
    {title:"I Wanna Dance with Somebody", artist:"Whitney Houston"},
    {title:"All I Want for Christmas Is You", artist:"Mariah Carey"},
    {title:"We Belong Together", artist:"Mariah Carey"},
    {title:"Dancing Queen", artist:"ABBA"},
    {title:"Mamma Mia", artist:"ABBA"},
    {title:"Waterloo", artist:"ABBA"},
    {title:"Rolling in the Deep", artist:"Adele"},
    {title:"Hello", artist:"Adele"},
    {title:"Someone Like You", artist:"Adele"},
    {title:"No One", artist:"Alicia Keys"},
    {title:"Fallin'", artist:"Alicia Keys"},
    {title:"All of Me", artist:"John Legend"},
    {title:"Uptown Funk", artist:"Mark Ronson"},
    {title:"Happy", artist:"Pharrell Williams"},
    {title:"Despacito", artist:"Luis Fonsi"},
    {title:"Hips Don't Lie", artist:"Shakira"},
    {title:"I Gotta Feeling", artist:"Black Eyed Peas"},
    {title:"Just The Way You Are", artist:"Bruno Mars"},
    {title:"24K Magic", artist:"Bruno Mars"},
    {title:"Thank U Next", artist:"Ariana Grande"},
    {title:"7 Rings", artist:"Ariana Grande"},
    {title:"Don't Start Now", artist:"Dua Lipa"},
    {title:"New Rules", artist:"Dua Lipa"},
    {title:"Bad Romance", artist:"Lady Gaga"},
    {title:"Poker Face", artist:"Lady Gaga"},
    {title:"Umbrella", artist:"Rihanna"},
    {title:"Diamonds", artist:"Rihanna"},
    {title:"We Found Love", artist:"Rihanna"},
    {title:"Sorry", artist:"Justin Bieber"},
    {title:"Love Yourself", artist:"Justin Bieber"},
    {title:"Baby", artist:"Justin Bieber"},
    {title:"Senorita", artist:"Shawn Mendes"},
    {title:"Chandelier", artist:"Sia"},
    {title:"Cheap Thrills", artist:"Sia"},
    {title:"Closer", artist:"The Chainsmokers"},
    {title:"Something Just Like This", artist:"The Chainsmokers"},
    {title:"Happier", artist:"Marshmello"},
    {title:"Summer", artist:"Calvin Harris"},
    {title:"This Is What You Came For", artist:"Calvin Harris"},
    {title:"Levels", artist:"Avicii"},
    {title:"Wake Me Up", artist:"Avicii"},
    {title:"Titanium", artist:"David Guetta"},
    {title:"Get Lucky", artist:"Daft Punk"},
    {title:"One More Time", artist:"Daft Punk"},
    {title:"Lean On", artist:"Major Lazer"},
    {title:"Rather Be", artist:"Clean Bandit"},
    {title:"Rockabye", artist:"Clean Bandit"},
    {title:"Stay With Me", artist:"Sam Smith"},
    {title:"Old Town Road", artist:"Lil Nas X"},
    {title:"Lose Yourself", artist:"Eminem"},
    {title:"Stan", artist:"Eminem"},
    {title:"Gold Digger", artist:"Kanye West"},
    {title:"Power", artist:"Kanye West"},
    {title:"In Da Club", artist:"50 Cent"},
    {title:"Yeah!", artist:"Usher"},
    {title:"Crazy In Love", artist:"Beyonce"},
    {title:"Halo", artist:"Beyonce"},
    {title:"Single Ladies", artist:"Beyonce"},
    {title:"Telephone", artist:"Lady Gaga"},
    {title:"California Gurls", artist:"Katy Perry"},
    {title:"Roar", artist:"Katy Perry"},
    {title:"Firework", artist:"Katy Perry"},
    {title:"Wrecking Ball", artist:"Miley Cyrus"},
    {title:"Problem", artist:"Ariana Grande"},
    {title:"Hotline Bling", artist:"Drake"},
    {title:"Stressed Out", artist:"Twenty One Pilots"},
    {title:"Believer", artist:"Imagine Dragons"},
    {title:"Radioactive", artist:"Imagine Dragons"},
    {title:"...Baby One More Time", artist:"Britney Spears"},
    {title:"Toxic", artist:"Britney Spears"},
    {title:"Wannabe", artist:"Spice Girls"},
    {title:"I Want It That Way", artist:"Backstreet Boys"},
    {title:"Wonderwall", artist:"Oasis"},
    {title:"Don't Look Back In Anger", artist:"Oasis"},
    {title:"Take On Me", artist:"a-ha"},
    {title:"Livin' on a Prayer", artist:"Bon Jovi"},
    {title:"Girls Just Wanna Have Fun", artist:"Cyndi Lauper"},
    {title:"Like a Prayer", artist:"Madonna"},
    {title:"Material Girl", artist:"Madonna"},
    {title:"Wake Me Up Before You Go-Go", artist:"Wham!"},
    {title:"Careless Whisper", artist:"George Michael"},
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
