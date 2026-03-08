// ============================================
// DISCOVER — external games directory
// To add a game: append an object to GAMES below.
// cats: word | music | geography | math | film | misc
// ============================================
const GAMES = [
    // ---- WORD ----
    {name:"Wordle",         cat:"word",      source:"New York Times",  desc:"Guess the 5-letter word in 6 tries. The classic.",                             url:"https://www.nytimes.com/games/wordle"},
    {name:"Connections",    cat:"word",      source:"New York Times",  desc:"Group 16 words into 4 secret categories before you run out of guesses.",        url:"https://www.nytimes.com/games/connections"},
    {name:"Spelling Bee",   cat:"word",      source:"New York Times",  desc:"Make as many words as you can from 7 letters. The centre letter is required.",  url:"https://www.nytimes.com/puzzles/spelling-bee"},
    {name:"Letterboxed",    cat:"word",      source:"New York Times",  desc:"Connect letters around a square to build words. Each side can only be used once per word.", url:"https://www.nytimes.com/games/letter-boxed"},
    {name:"Quordle",        cat:"word",      source:"Merriam-Webster", desc:"Solve four Wordles simultaneously with the same set of guesses.",               url:"https://www.merriam-webster.com/games/quordle"},
    {name:"Contexto",       cat:"word",      source:"Contexto",        desc:"Find the secret word. Every guess is ranked by AI similarity — no letter clues.", url:"https://contexto.me"},
    {name:"Wordiply",       cat:"word",      source:"The Guardian",    desc:"Make the longest word you can that contains the given string of letters.",      url:"https://www.wordiply.com"},
    // ---- MUSIC ----
    {name:"Heardle",        cat:"music",     source:"Heardle.io",      desc:"Guess the song from a short clip. Each wrong guess unlocks a longer preview.",  url:"https://heardle.io"},
    // ---- GEOGRAPHY ----
    {name:"Worldle",        cat:"geography", source:"Worldle",         desc:"Guess the country from its silhouette. Direction and distance clues help.",     url:"https://worldle.teuteuf.fr"},
    {name:"Globle",         cat:"geography", source:"Globle",          desc:"Guess the mystery country. The globe glows hotter the closer you get.",         url:"https://globle-game.com"},
    {name:"Flagle",         cat:"geography", source:"Flagle",          desc:"Guess the country from its flag, revealed one tile at a time.",                 url:"https://flagle.io"},
    {name:"Tradle",         cat:"geography", source:"Tradle",          desc:"Guess the country from a chart of its exports. For the economics-minded.",      url:"https://oec.world/en/tradle"},
    // ---- MATH ----
    {name:"Nerdle",         cat:"math",      source:"Nerdle",          desc:"Wordle for maths. Guess the correct equation in 6 tries.",                      url:"https://nerdlegame.com"},
    {name:"Primel",         cat:"math",      source:"Primel",          desc:"Guess the 5-digit prime number — Wordle rules, prime numbers only.",            url:"https://converged.yt/primel"},
    // ---- FILM & TV ----
    {name:"Framed",         cat:"film",      source:"Framed",          desc:"Guess the movie from a single still frame. More frames revealed each guess.",   url:"https://framed.wtf"},
    {name:"Actorle",        cat:"film",      source:"Actorle",         desc:"Guess the actor from age, nationality, and filmography clues.",                 url:"https://actorle.app"},
    // ---- MISC ----
    {name:"Factle",         cat:"misc",      source:"Factle",          desc:"Rank the correct top 5 answers to a daily trivia question.",                    url:"https://factle.app"},
];

// ============================================
// CATEGORIES CONFIG
// ============================================
const CATS = [
    {id:"all",       label:"All"},
    {id:"word",      label:"Word"},
    {id:"music",     label:"Music"},
    {id:"geography", label:"Geography"},
    {id:"math",      label:"Math"},
    {id:"film",      label:"Film & TV"},
    {id:"misc",      label:"Misc"},
];

// ============================================
// STATE
// ============================================
let activeCat    = 'all';
let searchQuery  = '';

// ============================================
// RENDER
// ============================================
function renderFilters() {
    const bar = document.getElementById('discoverFilters');
    bar.innerHTML = '';
    CATS.forEach(c => {
        const btn = document.createElement('button');
        btn.className   = 'disc-filter-btn' + (c.id === activeCat ? ' active' : '');
        btn.textContent = c.label;
        btn.addEventListener('click', () => {
            activeCat = c.id;
            renderFilters();
            renderCards();
        });
        bar.appendChild(btn);
    });
}

function renderCards() {
    const grid = document.getElementById('discoverGrid');
    const q    = searchQuery.toLowerCase();

    const filtered = GAMES.filter(g => {
        const matchCat    = activeCat === 'all' || g.cat === activeCat;
        const matchSearch = !q || g.name.toLowerCase().includes(q) || g.desc.toLowerCase().includes(q) || g.source.toLowerCase().includes(q);
        return matchCat && matchSearch;
    });

    grid.innerHTML = '';

    if (filtered.length === 0) {
        grid.innerHTML = '<p class="disc-empty">No games found.</p>';
        return;
    }

    filtered.forEach(g => {
        const catLabel = CATS.find(c => c.id === g.cat)?.label || g.cat;
        const card     = document.createElement('a');
        card.className = 'disc-card';
        card.href      = g.url;
        card.target    = '_blank';
        card.rel       = 'noopener noreferrer';
        card.innerHTML = `
            <div class="disc-card-top">
                <span class="disc-card-name">${g.name}</span>
                <span class="disc-cat-tag">${catLabel}</span>
            </div>
            <p class="disc-card-desc">${g.desc}</p>
            <div class="disc-card-foot">
                <span class="disc-card-source">${g.source}</span>
                <span class="disc-play-lnk">Play ↗</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ============================================
// SEARCH
// ============================================
document.getElementById('discoverSearch').addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    renderCards();
});

// ============================================
// INIT
// ============================================
renderFilters();
renderCards();
