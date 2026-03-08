// Sidebar — injected into every page
// Reads the GAMES array from app.js (loaded first)

function buildSidebar() {
    // Determine the base path (home page vs game pages)
    const isGame = window.location.pathname.includes('/games/');
    const base   = isGame ? '../../' : '';

    // Overlay (dark background behind sidebar)
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', closeSidebar);
    document.body.appendChild(overlay);

    // Sidebar panel
    const sidebar = document.createElement('div');
    sidebar.className = 'sidebar';
    sidebar.innerHTML = `
        <div class="sidebar-header">
            <a href="${base}index.html" class="sidebar-title">Streaks</a>
            <button class="sidebar-close" onclick="closeSidebar()">✕</button>
        </div>
        <div class="sidebar-games">
            ${GAMES.map(game => {
                const done = hasPlayedGame(game.id);
                return `
                <a href="${base}${game.url}"
                   class="sidebar-game-card ${!game.active ? 'sidebar-coming-soon' : ''} ${done ? 'sidebar-game-done' : ''}"
                   ${!game.active ? 'onclick="return false"' : ''}>
                    <div class="sidebar-game-title">${game.title}</div>
                    ${done ? '<span class="sidebar-done-badge">✓</span>' : ''}
                    ${!game.active ? '<span class="sidebar-soon-badge">Soon</span>' : ''}
                </a>`;
            }).join('')}
        </div>
    `;
    document.body.appendChild(sidebar);

    // Hamburger button — injected into the existing header
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.innerHTML = `<span></span><span></span><span></span>`;
    hamburger.addEventListener('click', openSidebar);

    const header = document.querySelector('.site-header .header-inner, .game-header');
    if (header) header.prepend(hamburger);
}

function openSidebar() {
    document.querySelector('.sidebar').classList.add('open');
    document.querySelector('.sidebar-overlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.querySelector('.sidebar-overlay').classList.remove('show');
    document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSidebar(); });

buildSidebar();
