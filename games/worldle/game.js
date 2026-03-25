// SHAPELOCK — Worldle-style. Guess country from silhouette.
// Distance + direction hint for each wrong guess. 6 attempts.

const MAX_ATTEMPTS = 6;
const TODAY        = getTodayString();
const SAVE_KEY     = 'shapelock_' + TODAY;
const TOPO_URL     = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Countries pool: name, ISO numeric code (matches TopoJSON), lat/lon centroid
const COUNTRIES = [
    {name:"Canada",code:124,lat:56.13,lon:-106.35},
    {name:"United States",code:840,lat:37.09,lon:-95.71},
    {name:"Mexico",code:484,lat:23.63,lon:-102.55},
    {name:"Guatemala",code:320,lat:15.78,lon:-90.23},
    {name:"Honduras",code:340,lat:15.20,lon:-86.24},
    {name:"El Salvador",code:222,lat:13.79,lon:-88.90},
    {name:"Nicaragua",code:558,lat:12.87,lon:-85.21},
    {name:"Costa Rica",code:188,lat:9.75,lon:-83.75},
    {name:"Panama",code:591,lat:8.54,lon:-80.78},
    {name:"Cuba",code:192,lat:21.52,lon:-77.78},
    {name:"Haiti",code:332,lat:18.97,lon:-72.29},
    {name:"Dominican Republic",code:214,lat:18.74,lon:-70.16},
    {name:"Colombia",code:170,lat:4.57,lon:-74.30},
    {name:"Venezuela",code:862,lat:6.42,lon:-66.59},
    {name:"Ecuador",code:218,lat:-1.83,lon:-78.18},
    {name:"Peru",code:604,lat:-9.19,lon:-75.02},
    {name:"Brazil",code:76,lat:-14.24,lon:-51.93},
    {name:"Bolivia",code:68,lat:-16.29,lon:-63.59},
    {name:"Paraguay",code:600,lat:-23.44,lon:-58.44},
    {name:"Chile",code:152,lat:-35.68,lon:-71.54},
    {name:"Argentina",code:32,lat:-38.42,lon:-63.62},
    {name:"Uruguay",code:858,lat:-32.52,lon:-55.77},
    {name:"Iceland",code:352,lat:64.96,lon:-19.02},
    {name:"Norway",code:578,lat:60.47,lon:8.47},
    {name:"Sweden",code:752,lat:60.13,lon:18.64},
    {name:"Finland",code:246,lat:61.92,lon:25.75},
    {name:"Denmark",code:208,lat:56.26,lon:9.50},
    {name:"United Kingdom",code:826,lat:55.38,lon:-3.44},
    {name:"Ireland",code:372,lat:53.41,lon:-8.24},
    {name:"Portugal",code:620,lat:39.40,lon:-8.22},
    {name:"Spain",code:724,lat:40.46,lon:-3.75},
    {name:"France",code:250,lat:46.23,lon:2.21},
    {name:"Belgium",code:56,lat:50.50,lon:4.47},
    {name:"Netherlands",code:528,lat:52.13,lon:5.29},
    {name:"Switzerland",code:756,lat:46.82,lon:8.23},
    {name:"Austria",code:40,lat:47.52,lon:14.55},
    {name:"Germany",code:276,lat:51.17,lon:10.45},
    {name:"Italy",code:380,lat:41.87,lon:12.57},
    {name:"Greece",code:300,lat:39.07,lon:21.82},
    {name:"Poland",code:616,lat:51.92,lon:19.15},
    {name:"Czech Republic",code:203,lat:49.82,lon:15.47},
    {name:"Slovakia",code:703,lat:48.67,lon:19.70},
    {name:"Hungary",code:348,lat:47.16,lon:19.50},
    {name:"Romania",code:642,lat:45.94,lon:24.97},
    {name:"Bulgaria",code:100,lat:42.73,lon:25.49},
    {name:"Serbia",code:688,lat:44.02,lon:21.01},
    {name:"Croatia",code:191,lat:45.10,lon:15.20},
    {name:"Albania",code:8,lat:41.15,lon:20.17},
    {name:"Ukraine",code:804,lat:48.38,lon:31.17},
    {name:"Belarus",code:112,lat:53.71,lon:27.95},
    {name:"Lithuania",code:440,lat:55.17,lon:23.88},
    {name:"Latvia",code:428,lat:56.88,lon:24.60},
    {name:"Estonia",code:233,lat:58.60,lon:25.01},
    {name:"Russia",code:643,lat:61.52,lon:105.32},
    {name:"Turkey",code:792,lat:38.96,lon:35.24},
    {name:"Georgia",code:268,lat:42.32,lon:43.36},
    {name:"Kazakhstan",code:398,lat:48.02,lon:66.92},
    {name:"Uzbekistan",code:860,lat:41.38,lon:64.59},
    {name:"Afghanistan",code:4,lat:33.94,lon:67.71},
    {name:"Iraq",code:368,lat:33.22,lon:43.68},
    {name:"Iran",code:364,lat:32.43,lon:53.69},
    {name:"Syria",code:760,lat:34.80,lon:38.99},
    {name:"Saudi Arabia",code:682,lat:23.89,lon:45.08},
    {name:"Yemen",code:887,lat:15.55,lon:48.52},
    {name:"Oman",code:512,lat:21.51,lon:55.92},
    {name:"United Arab Emirates",code:784,lat:23.42,lon:53.85},
    {name:"Pakistan",code:586,lat:30.38,lon:69.35},
    {name:"India",code:356,lat:20.59,lon:78.96},
    {name:"Nepal",code:524,lat:28.39,lon:84.12},
    {name:"Bangladesh",code:50,lat:23.68,lon:90.36},
    {name:"Sri Lanka",code:144,lat:7.87,lon:80.77},
    {name:"Myanmar",code:104,lat:17.11,lon:96.66},
    {name:"Thailand",code:764,lat:15.87,lon:100.99},
    {name:"Vietnam",code:704,lat:14.06,lon:108.28},
    {name:"Cambodia",code:116,lat:12.57,lon:104.99},
    {name:"Malaysia",code:458,lat:4.21,lon:108.97},
    {name:"Indonesia",code:360,lat:-0.79,lon:113.92},
    {name:"Philippines",code:608,lat:12.88,lon:121.77},
    {name:"China",code:156,lat:35.86,lon:104.20},
    {name:"Mongolia",code:496,lat:46.86,lon:103.85},
    {name:"South Korea",code:410,lat:35.91,lon:127.77},
    {name:"Japan",code:392,lat:36.20,lon:138.25},
    {name:"Morocco",code:504,lat:31.79,lon:-7.09},
    {name:"Algeria",code:12,lat:28.03,lon:1.66},
    {name:"Tunisia",code:788,lat:33.89,lon:9.54},
    {name:"Libya",code:434,lat:26.34,lon:17.23},
    {name:"Egypt",code:818,lat:26.82,lon:30.80},
    {name:"Sudan",code:729,lat:12.86,lon:30.22},
    {name:"Ethiopia",code:231,lat:9.15,lon:40.49},
    {name:"Somalia",code:706,lat:5.15,lon:46.20},
    {name:"Kenya",code:404,lat:-0.02,lon:37.91},
    {name:"Uganda",code:800,lat:1.37,lon:32.29},
    {name:"Tanzania",code:834,lat:-6.37,lon:34.89},
    {name:"DR Congo",code:180,lat:-4.04,lon:21.76},
    {name:"Angola",code:24,lat:-11.20,lon:17.87},
    {name:"Zambia",code:894,lat:-13.13,lon:27.85},
    {name:"Zimbabwe",code:716,lat:-19.02,lon:29.15},
    {name:"Mozambique",code:508,lat:-18.67,lon:35.53},
    {name:"South Africa",code:710,lat:-30.56,lon:22.94},
    {name:"Madagascar",code:450,lat:-18.77,lon:46.87},
    {name:"Nigeria",code:566,lat:9.08,lon:8.68},
    {name:"Niger",code:562,lat:17.61,lon:8.08},
    {name:"Mali",code:466,lat:17.57,lon:-3.99},
    {name:"Cameroon",code:120,lat:3.85,lon:11.50},
    {name:"Ghana",code:288,lat:7.95,lon:-1.02},
    {name:"Senegal",code:686,lat:14.50,lon:-14.45},
    {name:"Australia",code:36,lat:-25.27,lon:133.78},
    {name:"New Zealand",code:554,lat:-40.90,lon:174.89},
    {name:"Papua New Guinea",code:598,lat:-6.31,lon:143.96},
    {name:"Sweden",code:752,lat:60.13,lon:18.64},
    {name:"Namibia",code:516,lat:-22.96,lon:18.49},
    {name:"Botswana",code:72,lat:-22.33,lon:24.68},
    {name:"Colombia",code:170,lat:4.57,lon:-74.30},
    {name:"North Korea",code:408,lat:40.34,lon:127.51},
    {name:"Laos",code:418,lat:19.86,lon:102.50},
    {name:"Chad",code:148,lat:15.45,lon:18.73},
    {name:"Jordan",code:400,lat:30.59,lon:36.24},
    {name:"Israel",code:376,lat:31.05,lon:34.85},
    {name:"South Sudan",code:728,lat:6.88,lon:31.31},
];

// Remove duplicate entries
const seen = new Set();
const POOL = COUNTRIES.filter(c => { if (seen.has(c.code)) return false; seen.add(c.code); return true; });

// ============================================
// DAILY PICK
// ============================================
const todayCountry = POOL[getDailyIndex(POOL)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        guesses: [], gameOver: false, won: false
    };
}
function saveState() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }
let state = loadState();

// ============================================
// MATHS
// ============================================
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371, r = x => x * Math.PI / 180;
    const dL = r(lat2 - lat1), dO = r(lon2 - lon1);
    const a = Math.sin(dL/2)**2 + Math.cos(r(lat1))*Math.cos(r(lat2))*Math.sin(dO/2)**2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

function getBearing(lat1, lon1, lat2, lon2) {
    const r = x => x * Math.PI / 180;
    const dO = r(lon2 - lon1);
    const y = Math.sin(dO) * Math.cos(r(lat2));
    const x = Math.cos(r(lat1)) * Math.sin(r(lat2)) - Math.sin(r(lat1)) * Math.cos(r(lat2)) * Math.cos(dO);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function proximity(km) {
    return Math.max(0, Math.round((1 - km / 20000) * 100));
}

// ============================================
// SVG SILHOUETTE
// ============================================
let topoData = null;
let currentFill = '#4a5060';

async function loadSilhouette(fillColor) {
    const svg     = document.getElementById('shapeSvg');
    const loading = document.getElementById('shapeLoading');
    currentFill = fillColor || currentFill;

    try {
        if (!topoData) {
            const res  = await fetch(TOPO_URL);
            topoData   = await res.json();
        }
        const features = topojson.feature(topoData, topoData.objects.countries).features;
        const feature  = features.find(f => +f.id === todayCountry.code);

        if (!feature) { loading.textContent = 'Shape unavailable'; return; }

        loading.style.display = 'none';
        svg.innerHTML = '';

        const W = 300, H = 220;
        const proj = d3.geoMercator().fitSize([W, H], feature);
        const path = d3.geoPath().projection(proj);

        const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        el.setAttribute('d', path(feature));
        el.setAttribute('fill', currentFill);
        el.setAttribute('stroke', '#fff');
        el.setAttribute('stroke-width', '0.5');
        svg.appendChild(el);
    } catch {
        loading.textContent = 'Shape unavailable';
    }
}

// ============================================
// AUTOCOMPLETE
// ============================================
const input       = document.getElementById('countryInput');
const acDrop      = document.getElementById('autocomplete');
let acIndex = -1;

function acSetIndex(i) {
    const items = acDrop.querySelectorAll('.autocomplete-item');
    items.forEach(el => el.classList.remove('active'));
    acIndex = Math.max(-1, Math.min(i, items.length - 1));
    if (acIndex >= 0) items[acIndex].classList.add('active');
}

input.addEventListener('input', () => {
    const val = input.value.toLowerCase().trim();
    acDrop.innerHTML = '';
    acIndex = -1;
    if (!val) return;
    POOL.filter(c => c.name.toLowerCase().startsWith(val))
        .concat(POOL.filter(c => !c.name.toLowerCase().startsWith(val) && c.name.toLowerCase().includes(val)))
        .slice(0, 8)
        .forEach(c => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = c.name;
            item.addEventListener('click', () => { input.value = c.name; acDrop.innerHTML = ''; });
            acDrop.appendChild(item);
        });
});

input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); acSetIndex(acIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); acSetIndex(acIndex - 1); }
    else if (e.key === 'Enter') {
        const active = acDrop.querySelector('.autocomplete-item.active');
        if (active) { e.preventDefault(); input.value = active.textContent; acDrop.innerHTML = ''; acIndex = -1; }
        else submitGuess();
    }
});
document.addEventListener('click', e => {
    if (!input.contains(e.target) && !acDrop.contains(e.target)) acDrop.innerHTML = '';
});

// ============================================
// RENDER GUESS ROWS
// ============================================
function renderRows() {
    const el = document.getElementById('guessRows');
    el.innerHTML = '';
    state.guesses.forEach(g => {
        const row  = document.createElement('div');
        row.className = 'shape-guess-row';

        const pct  = proximity(g.km);
        const isCorrect = g.km === 0;

        row.innerHTML = `
            <span class="shape-guess-name">${g.name}</span>
            <span class="shape-guess-dist">${isCorrect ? '✓' : (g.km >= 1000 ? Math.round(g.km/100)/10 + 'k' : Math.round(g.km)) + ' km'}</span>
            <span class="shape-guess-arrow" style="transform:rotate(${g.bearing}deg)">${isCorrect ? '' : '↑'}</span>
            <div class="shape-prox-wrap">
                <div class="shape-prox-bar" style="width:${pct}%"></div>
                <span class="shape-prox-pct">${pct}%</span>
            </div>
        `;

        if (isCorrect) row.classList.add('correct');
        el.appendChild(row);
    });
}

// ============================================
// SUBMIT
// ============================================
function submitGuess() {
    if (state.gameOver) return;
    const raw = input.value.trim();
    if (!raw) return;

    const match = POOL.find(c => c.name.toLowerCase() === raw.toLowerCase());
    if (!match) { showShapeMsg('Country not found — select from the list'); return; }

    const already = state.guesses.find(g => g.name === match.name);
    if (already) { showShapeMsg('Already guessed!'); return; }

    const km      = match.code === todayCountry.code ? 0 :
        haversine(match.lat, match.lon, todayCountry.lat, todayCountry.lon);
    const bearing = match.code === todayCountry.code ? 0 :
        getBearing(match.lat, match.lon, todayCountry.lat, todayCountry.lon);

    state.guesses.push({name: match.name, km: Math.round(km), bearing: Math.round(bearing)});
    input.value = '';
    acDrop.innerHTML = '';

    const won = match.code === todayCountry.code;
    if (won || state.guesses.length >= MAX_ATTEMPTS) {
        state.gameOver = true;
        state.won = won;
        markGamePlayed('shapelock');
        loadSilhouette(won ? '#55b725' : '#c62121');
    }

    saveState();
    renderRows();
    if (state.gameOver) showResult();
}

function showShapeMsg(msg) {
    const el = document.getElementById('resultBox');
    // Use a temporary toast instead
    const toast = document.createElement('p');
    toast.className = 'shape-msg-toast';
    toast.textContent = msg;
    document.querySelector('.shape-container').appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

function showResult() {
    document.getElementById('inputSection').style.display = 'none';
    const el = document.getElementById('resultBox');
    el.style.display = 'block';
    const guesses = state.guesses.length;
    el.innerHTML = `
        <div class="result-box ${state.won ? 'win' : 'lose'}">
            ${state.won
                ? `<h3>Correct!</h3><p>You found <strong>${todayCountry.name}</strong> in ${guesses} guess${guesses !== 1 ? 'es' : ''}!</p>`
                : `<h3>Better luck tomorrow!</h3><p>The country was <strong>${todayCountry.name}</strong>.</p>`
            }
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        </div>
    `;
}

document.getElementById('submitBtn').addEventListener('click', submitGuess);

// ============================================
// BOOT
// ============================================
loadSilhouette();
renderRows();
if (state.gameOver) {
    showResult();
    loadSilhouette(state.won ? '#55b725' : '#c62121');
    document.getElementById('inputSection').style.display = 'none';
}
