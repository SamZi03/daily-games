// ============================================
// GAMES LIST
// To add a game: add an object to this array
// To remove a game: delete its object
// To disable (show as coming soon): set active: false
// ============================================
const GAMES = [
    {
        id: 'heardle',
        title: 'Heardle',
        description: 'Guess the song from a short audio clip. Each wrong guess reveals a longer clip.',
        icon: '🎵',
        url: 'games/heardle/index.html',
        active: true
    },
    {
        id: 'higher-lower',
        title: 'Higher or Lower',
        description: 'Which song has more Spotify streams? Score as many in a row as you can.',
        icon: '📈',
        url: 'games/higher-lower/index.html',
        active: true
    },
    {
        id: 'cover',
        title: 'Cover',
        description: 'Guess the song from its album artwork. The cover gets clearer with each guess.',
        icon: '🎨',
        url: 'games/cover/index.html',
        active: true
    },
    {
        id: 'lyrics',
        title: 'Lyrics',
        description: 'Guess the song from its lyrics. One line revealed at a time.',
        icon: '📝',
        url: 'games/lyrics/index.html',
        active: true
    },
    {
        id: 'globle',
        title: 'Globle',
        description: 'Guess the mystery country. The globe heats up as you get closer.',
        icon: '🌍',
        url: 'games/globle/index.html',
        active: false
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

function markGamePlayed(gameId) {
    const today = getTodayString();
    const stored = JSON.parse(localStorage.getItem('playedGames') || '{}');
    if (!stored[today]) stored[today] = [];
    if (!stored[today].includes(gameId)) stored[today].push(gameId);
    localStorage.setItem('playedGames', JSON.stringify(stored));
    updateStreak();
}

function hasPlayedGame(gameId) {
    return getPlayedToday().includes(gameId);
}

// ============================================
// RENDER HOME PAGE
// ============================================
function renderHomePage() {
    const dateEl = document.getElementById('todayDate');
    if (dateEl) dateEl.textContent = formatDateDisplay(getTodayString());

    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = getStreak().count;

    const played = getPlayedToday();
    const activeGames = GAMES.filter(g => g.active);
    const completedEl = document.getElementById('gamesCompletedText');
    if (completedEl) {
        completedEl.textContent = `${played.length} of ${activeGames.length} games completed today`;
    }

    const grid = document.getElementById('gamesGrid');
    if (!grid) return;

    GAMES.forEach(game => {
        const done = hasPlayedGame(game.id);
        const card = document.createElement('a');
        card.href = game.active ? game.url : '#';
        card.className = `game-card${done ? ' played' : ''}${!game.active ? ' coming-soon' : ''}`;

        card.innerHTML = `
            <span class="card-icon">${game.icon}</span>
            <div class="card-title">${game.title}</div>
            <div class="card-description">${game.description}</div>
            <div class="card-play-btn">${done ? 'View Result' : 'Play'}</div>
        `;

        if (!game.active) {
            card.addEventListener('click', e => e.preventDefault());
        }

        grid.appendChild(card);
    });
}

function resetForTesting() {
    const today = getTodayString();
    // Clear today's played games and all game saves
    const stored = JSON.parse(localStorage.getItem('playedGames') || '{}');
    delete stored[today];
    localStorage.setItem('playedGames', JSON.stringify(stored));
    ['heardle', 'higher-lower', 'cover', 'lyrics'].forEach(id => {
        localStorage.removeItem(id + '_' + today);
    });
    location.reload();
}

renderHomePage();
