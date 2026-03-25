// GROUPLOCK — Connections-style game logic

const TODAY    = getTodayString();
const SAVE_KEY = 'grouplock_' + TODAY;

const COLORS = {
    yellow: {bg:'#f9df6d', text:'#1a1a1a'},
    green:  {bg:'#a0c35a', text:'#1a1a1a'},
    blue:   {bg:'#b0c4ef', text:'#1a1a1a'},
    purple: {bg:'#ba81c5', text:'#1a1a1a'},
};

const puzzle = PUZZLES[getDailyIndex(PUZZLES)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        solvedColors: [],   // e.g. ['yellow','green']
        guesses:      [],   // [{items:[...], correct:bool}]
        mistakes:     0,
        gameOver:     false,
        won:          false,
    };
}
function saveState() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }

let state    = loadState();
let selected = [];
let shuffled = [];

// ============================================
// BUILD TILE POOL
// ============================================
function buildPool() {
    const solved = new Set(state.solvedColors);
    const pool   = [];
    puzzle.categories.forEach(cat => {
        if (!solved.has(cat.color)) pool.push(...cat.items);
    });
    return pool;
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ============================================
// RENDER
// ============================================
function render() {
    const solved     = new Set(state.solvedColors);
    const solvedRows = document.getElementById('solvedRows');
    const tileGrid   = document.getElementById('tileGrid');
    const submitBtn  = document.getElementById('submitBtn');
    const mistakesEl = document.getElementById('mistakeDots');
    const msgEl      = document.getElementById('groupMsg');

    // Solved rows (in color order)
    solvedRows.innerHTML = '';
    ['yellow','green','blue','purple'].forEach(color => {
        if (!solved.has(color)) return;
        const cat  = puzzle.categories.find(c => c.color === color);
        const row  = document.createElement('div');
        row.className = 'conn-solved-row';
        row.style.background = COLORS[color].bg;
        row.style.color      = COLORS[color].text;
        row.innerHTML = `<span class="conn-solved-label">${cat.label}</span><span class="conn-solved-items">${cat.items.join(', ')}</span>`;
        solvedRows.appendChild(row);
    });

    // Mistake dots
    mistakesEl.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const dot = document.createElement('div');
        dot.className = 'conn-dot' + (i < (4 - state.mistakes) ? ' active' : '');
        mistakesEl.appendChild(dot);
    }

    // Tiles
    tileGrid.innerHTML = '';
    if (!state.gameOver) {
        shuffled.forEach(item => {
            const tile    = document.createElement('button');
            tile.className = 'conn-tile' + (selected.includes(item) ? ' selected' : '');
            tile.textContent = item;
            tile.addEventListener('click', () => toggleTile(item));
            tileGrid.appendChild(tile);
        });
    }

    submitBtn.disabled = selected.length !== 4 || state.gameOver;

    if (state.gameOver) renderResult();
}

function renderResult() {
    const resultEl = document.getElementById('resultBox');
    resultEl.style.display = 'block';
    const won = state.won;
    resultEl.innerHTML = `
        <div class="conn-result ${won ? 'win' : 'lose'}">
            <h3>${won ? 'Solved it!' : 'Better luck tomorrow!'}</h3>
            <div class="conn-result-grid">
                ${buildShareGrid()}
            </div>
            <button class="btn btn-primary conn-share-btn" id="shareBtn">Share result</button>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        </div>
    `;
    document.getElementById('shareBtn').addEventListener('click', shareResult);
}

function buildShareGrid() {
    const emojis = {yellow:'🟨', green:'🟩', blue:'🟦', purple:'🟪'};
    return state.guesses.map(g => {
        return `<div class="conn-share-row">${g.items.map(item => {
            const cat = puzzle.categories.find(c => c.items.includes(item));
            return emojis[cat ? cat.color : 'yellow'];
        }).join('')}</div>`;
    }).join('');
}

function shareResult() {
    const emojis = {yellow:'🟨', green:'🟩', blue:'🟦', purple:'🟪'};
    const rows = state.guesses.map(g =>
        g.items.map(item => {
            const cat = puzzle.categories.find(c => c.items.includes(item));
            return emojis[cat ? cat.color : 'yellow'];
        }).join('')
    ).join('\n');
    const text = `GroupLock ${TODAY}\n${rows}`;
    navigator.clipboard.writeText(text).then(() => showMsg('Copied to clipboard!'));
}

// ============================================
// GAME LOGIC
// ============================================
function toggleTile(item) {
    if (state.gameOver) return;
    const idx = selected.indexOf(item);
    if (idx >= 0) {
        selected.splice(idx, 1);
    } else if (selected.length < 4) {
        selected.push(item);
    }
    render();
}

function showMsg(msg, duration = 2000) {
    const el = document.getElementById('groupMsg');
    el.textContent = msg;
    el.style.opacity = '1';
    setTimeout(() => { el.style.opacity = '0'; }, duration);
}

function shakeWrongTiles() {
    document.querySelectorAll('.conn-tile.selected').forEach(t => {
        t.classList.add('shake');
        setTimeout(() => t.classList.remove('shake'), 500);
    });
}

function submitGuess() {
    if (selected.length !== 4 || state.gameOver) return;

    state.guesses.push({items: [...selected], correct: false});

    // Check each category
    let matched = null;
    let nearMiss = false;

    for (const cat of puzzle.categories) {
        if (state.solvedColors.includes(cat.color)) continue;
        const overlap = selected.filter(i => cat.items.includes(i)).length;
        if (overlap === 4) { matched = cat; break; }
        if (overlap === 3) nearMiss = true;
    }

    if (matched) {
        state.guesses[state.guesses.length - 1].correct = true;
        state.solvedColors.push(matched.color);
        selected = [];
        // rebuild shuffled without solved items
        shuffled = shuffleArray(buildPool());

        if (state.solvedColors.length === 4) {
            state.gameOver = true;
            state.won = true;
            markGamePlayed('grouplock');
        }
        saveState();
        render();
    } else {
        state.mistakes++;
        if (state.mistakes >= 4) {
            // Reveal all remaining
            state.solvedColors = ['yellow','green','blue','purple'];
            state.gameOver = true;
            state.won = false;
            markGamePlayed('grouplock');
            selected = [];
            saveState();
            render();
            return;
        }
        saveState();
        shakeWrongTiles();
        if (nearMiss) setTimeout(() => showMsg('One away!'), 550);
    }
}

document.getElementById('submitBtn').addEventListener('click', submitGuess);
document.getElementById('shuffleBtn').addEventListener('click', () => {
    shuffled = shuffleArray(shuffled);
    render();
});
document.getElementById('deselectBtn').addEventListener('click', () => {
    selected = [];
    render();
});

// ============================================
// BOOT
// ============================================
shuffled = shuffleArray(buildPool());

render();
