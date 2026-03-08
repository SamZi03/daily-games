// ============================================
// GAMES LIST
// To add a game: add an object to this array
// To remove a game: delete its object
// To disable (show as coming soon): set active: false
// ============================================
const GAMES = [
    {
        id: 'earlock',
        title: 'EarLock',
        description: 'Guess the song from a short audio clip. Each wrong guess reveals a longer clip.',
        icon: '🎵',
        url: 'games/earworm/index.html',
        active: true
    },
    {
        id: 'statlock',
        title: 'StatLock',
        description: 'Which song has more Spotify streams? Score as many in a row as you can.',
        icon: '📈',
        url: 'games/higher-lower/index.html',
        active: true
    },
    {
        id: 'coverlock',
        title: 'CoverLock',
        description: 'Guess the song from its album artwork. The cover gets clearer with each guess.',
        icon: '🎨',
        url: 'games/cover/index.html',
        active: true
    },
    {
        id: 'lexilock',
        title: 'WordLock',
        description: 'Guess the hidden word in 6 tries. Choose from 3 to 7 letter words.',
        icon: '🔤',
        url: 'games/lexico/index.html',
        active: true
    },
    {
        id: 'spelllock',
        title: 'SpellLock',
        description: 'Listen to a word and spell it correctly. Five words, five rounds.',
        icon: '🐝',
        url: 'games/spellcast/index.html',
        active: true
    },
    {
        id: 'geolock',
        title: 'GeoLock',
        description: 'Guess the mystery country. Countries glow hotter the closer you get.',
        icon: '🌍',
        url: 'games/global/index.html',
        active: true
    },
    {
        id: 'cluelock',
        title: 'ClueLock',
        description: 'Type any word and get a score showing how close it is to the mystery word.',
        icon: '🔍',
        url: 'games/clueless/index.html',
        active: true
    }
];

// ============================================
// DATE HELPERS
// ============================================
function getTodayString() {
    return new Date().toISOString().split('T')[0]; // e.g. "2025-03-06"
}

function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
}

function formatDateDisplay(str) {
    const d = new Date(str + 'T12:00:00');
    return d.toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
}

// Use date as a number seed to pick today's item from a list
function getDailyIndex(list) {
    const seed = parseInt(getTodayString().replace(/-/g, ''));
    return seed % list.length;
}

// ============================================
// STREAK TRACKING
// ============================================
function getStreak() {
    return JSON.parse(localStorage.getItem('streak') || '{"count":0,"lastPlayed":""}');
}

function updateStreak() {
    const today = getTodayString();
    const data = getStreak();
    if (data.lastPlayed === today) return;
    data.count = (data.lastPlayed === getYesterdayString()) ? data.count + 1 : 1;
    data.lastPlayed = today;
    localStorage.setItem('streak', JSON.stringify(data));
}

// ============================================
// PLAYED GAMES TRACKING
// ============================================
function getPlayedToday() {
    const stored = JSON.parse(localStorage.getItem('playedGames') || '{}');
    return stored[getTodayString()] || [];
}

function getGameStreak(gameId) {
    return JSON.parse(localStorage.getItem('gameStreak_' + gameId) || '{"count":0,"lastPlayed":""}');
}

function updateGameStreak(gameId) {
    const today = getTodayString();
    const data  = getGameStreak(gameId);
    if (data.lastPlayed === today) return;
    data.count      = (data.lastPlayed === getYesterdayString()) ? data.count + 1 : 1;
    data.lastPlayed = today;
    localStorage.setItem('gameStreak_' + gameId, JSON.stringify(data));
}

function markGamePlayed(gameId) {
    const today = getTodayString();
    const stored = JSON.parse(localStorage.getItem('playedGames') || '{}');
    if (!stored[today]) stored[today] = [];
    if (!stored[today].includes(gameId)) stored[today].push(gameId);
    localStorage.setItem('playedGames', JSON.stringify(stored));
    updateGameStreak(gameId);
    updateStreak();
}

function hasPlayedGame(gameId) {
    return getPlayedToday().includes(gameId);
}

// ============================================
// CARD VISUALS — one per game
// ============================================
const CARD_VISUALS = {
    earlock: `
        <div class="cv-earlock">
            <div class="cv-ear-bar"><div class="cv-ear-fill"></div></div>
            <div class="cv-ear-play">▶</div>
        </div>`,
    statlock: `
        <div class="cv-statlock">
            <span class="cv-stat-up">↑</span>
            <span class="cv-stat-down">↓</span>
        </div>`,
    coverlock: `
        <div class="cv-coverlock">
            <div class="cv-cover-art"></div>
        </div>`,
    lexilock: `
        <div class="cv-lexilock">
            <div class="cv-lt cv-lt-g">W</div>
            <div class="cv-lt cv-lt-y">O</div>
            <div class="cv-lt cv-lt-e">R</div>
            <div class="cv-lt cv-lt-g">D</div>
            <div class="cv-lt cv-lt-e">S</div>
        </div>`,
    spelllock: `
        <div class="cv-spelllock">
            <span class="cv-spk">🔊</span>
            <span class="cv-qqq">???</span>
        </div>`,
    geolock: `
        <div class="cv-geolock">
            <span class="cv-earth">🌍</span>
            <div class="cv-geo-dots">
                <span style="background:#6a7a3a"></span>
                <span style="background:#c8981a"></span>
                <span style="background:#c62121"></span>
            </div>
        </div>`,
    cluelock: `
        <div class="cv-cluelock">
            <span class="cv-clue-search">🔍</span>
            <div class="cv-clue-tempbar"></div>
        </div>`,
};

// ============================================
// RENDER HOME PAGE
// ============================================
function renderHomePage() {
    const dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.textContent = formatDateDisplay(getTodayString());

    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = getStreak().count;

    const grid = document.getElementById('gamesGrid');
    if (!grid) return;

    GAMES.forEach(game => {
        const done   = hasPlayedGame(game.id);
        const card   = document.createElement('a');
        card.href    = game.active ? game.url : '#';
        card.className = `game-card${done ? ' played' : ''}${!game.active ? ' coming-soon' : ''}`;

        const visual  = CARD_VISUALS[game.id] || '';
        const gStreak = getGameStreak(game.id).count;
        card.innerHTML = `
            <div class="card-top">
                <div class="card-title">${game.title}</div>
                ${done ? '<span class="card-done-check">✓</span>' : ''}
                ${!game.active ? '<span class="card-soon-badge">Soon</span>' : ''}
            </div>
            <div class="card-visual">${visual}</div>
            ${gStreak > 0 ? `<div class="card-streak">🔥 ${gStreak} day streak</div>` : ''}
        `;

        if (!game.active) {
            card.addEventListener('click', e => e.preventDefault());
        }

        grid.appendChild(card);
    });
}

function resetForTesting() {
    const today = getTodayString();
    // Clear played-games record for today
    const stored = JSON.parse(localStorage.getItem('playedGames') || '{}');
    delete stored[today];
    localStorage.setItem('playedGames', JSON.stringify(stored));
    // Clear every localStorage key that contains today's date (covers all games + Lexico per-length keys)
    Object.keys(localStorage)
        .filter(k => k.includes(today))
        .forEach(k => localStorage.removeItem(k));
    location.reload();
}

renderHomePage();

// ============================================
// SITE FOOTER — injected on pages without a hardcoded footer
// ============================================
(function injectFooter() {
    if (document.querySelector('.site-footer')) return; // already present
    const isGame = window.location.pathname.includes('/games/');
    const base   = isGame ? '../../' : '';
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `&copy; ${new Date().getFullYear()} Daily Streaks &nbsp;&middot;&nbsp; <a href="${base}legal.html">Privacy &amp; Legal</a>`;
    document.body.appendChild(footer);
}());
