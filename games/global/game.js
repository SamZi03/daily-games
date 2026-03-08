// ============================================
// GLOBLE — Guess the mystery country on a globe
// Countries are coloured by distance (cold→hot)
// No guess limit — keep going until you find it
// ============================================

const COUNTRIES = [
    // Americas
    { name: "Canada",                    code: 124,  lat:  56.13, lon: -106.35 },
    { name: "United States",             code: 840,  lat:  37.09, lon:  -95.71 },
    { name: "Mexico",                    code: 484,  lat:  23.63, lon: -102.55 },
    { name: "Guatemala",                 code: 320,  lat:  15.78, lon:  -90.23 },
    { name: "Belize",                    code: 84,   lat:  17.19, lon:  -88.50 },
    { name: "Honduras",                  code: 340,  lat:  15.20, lon:  -86.24 },
    { name: "El Salvador",               code: 222,  lat:  13.79, lon:  -88.90 },
    { name: "Nicaragua",                 code: 558,  lat:  12.87, lon:  -85.21 },
    { name: "Costa Rica",                code: 188,  lat:   9.75, lon:  -83.75 },
    { name: "Panama",                    code: 591,  lat:   8.54, lon:  -80.78 },
    { name: "Cuba",                      code: 192,  lat:  21.52, lon:  -77.78 },
    { name: "Jamaica",                   code: 388,  lat:  18.11, lon:  -77.30 },
    { name: "Haiti",                     code: 332,  lat:  18.97, lon:  -72.29 },
    { name: "Dominican Republic",        code: 214,  lat:  18.74, lon:  -70.16 },
    { name: "Trinidad and Tobago",       code: 780,  lat:  10.69, lon:  -61.22 },
    { name: "Colombia",                  code: 170,  lat:   4.57, lon:  -74.30 },
    { name: "Venezuela",                 code: 862,  lat:   6.42, lon:  -66.59 },
    { name: "Guyana",                    code: 328,  lat:   4.86, lon:  -58.93 },
    { name: "Suriname",                  code: 740,  lat:   3.92, lon:  -56.03 },
    { name: "Ecuador",                   code: 218,  lat:  -1.83, lon:  -78.18 },
    { name: "Peru",                      code: 604,  lat:  -9.19, lon:  -75.02 },
    { name: "Brazil",                    code: 76,   lat: -14.24, lon:  -51.93 },
    { name: "Bolivia",                   code: 68,   lat: -16.29, lon:  -63.59 },
    { name: "Paraguay",                  code: 600,  lat: -23.44, lon:  -58.44 },
    { name: "Chile",                     code: 152,  lat: -35.68, lon:  -71.54 },
    { name: "Argentina",                 code: 32,   lat: -38.42, lon:  -63.62 },
    { name: "Uruguay",                   code: 858,  lat: -32.52, lon:  -55.77 },

    // Europe
    { name: "Iceland",                   code: 352,  lat:  64.96, lon:  -19.02 },
    { name: "Norway",                    code: 578,  lat:  60.47, lon:    8.47 },
    { name: "Sweden",                    code: 752,  lat:  60.13, lon:   18.64 },
    { name: "Finland",                   code: 246,  lat:  61.92, lon:   25.75 },
    { name: "Denmark",                   code: 208,  lat:  56.26, lon:    9.50 },
    { name: "United Kingdom",            code: 826,  lat:  55.38, lon:   -3.44 },
    { name: "Ireland",                   code: 372,  lat:  53.41, lon:   -8.24 },
    { name: "Portugal",                  code: 620,  lat:  39.40, lon:   -8.22 },
    { name: "Spain",                     code: 724,  lat:  40.46, lon:   -3.75 },
    { name: "France",                    code: 250,  lat:  46.23, lon:    2.21 },
    { name: "Belgium",                   code: 56,   lat:  50.50, lon:    4.47 },
    { name: "Netherlands",               code: 528,  lat:  52.13, lon:    5.29 },
    { name: "Luxembourg",                code: 442,  lat:  49.82, lon:    6.13 },
    { name: "Switzerland",               code: 756,  lat:  46.82, lon:    8.23 },
    { name: "Austria",                   code: 40,   lat:  47.52, lon:   14.55 },
    { name: "Germany",                   code: 276,  lat:  51.17, lon:   10.45 },
    { name: "Italy",                     code: 380,  lat:  41.87, lon:   12.57 },
    { name: "Greece",                    code: 300,  lat:  39.07, lon:   21.82 },
    { name: "Poland",                    code: 616,  lat:  51.92, lon:   19.15 },
    { name: "Czech Republic",            code: 203,  lat:  49.82, lon:   15.47 },
    { name: "Slovakia",                  code: 703,  lat:  48.67, lon:   19.70 },
    { name: "Hungary",                   code: 348,  lat:  47.16, lon:   19.50 },
    { name: "Romania",                   code: 642,  lat:  45.94, lon:   24.97 },
    { name: "Bulgaria",                  code: 100,  lat:  42.73, lon:   25.49 },
    { name: "Serbia",                    code: 688,  lat:  44.02, lon:   21.01 },
    { name: "Croatia",                   code: 191,  lat:  45.10, lon:   15.20 },
    { name: "Bosnia and Herzegovina",    code: 70,   lat:  43.92, lon:   17.68 },
    { name: "Slovenia",                  code: 705,  lat:  46.15, lon:   14.99 },
    { name: "Albania",                   code: 8,    lat:  41.15, lon:   20.17 },
    { name: "North Macedonia",           code: 807,  lat:  41.61, lon:   21.75 },
    { name: "Montenegro",                code: 499,  lat:  42.71, lon:   19.37 },
    { name: "Moldova",                   code: 498,  lat:  47.41, lon:   28.37 },
    { name: "Ukraine",                   code: 804,  lat:  48.38, lon:   31.17 },
    { name: "Belarus",                   code: 112,  lat:  53.71, lon:   27.95 },
    { name: "Lithuania",                 code: 440,  lat:  55.17, lon:   23.88 },
    { name: "Latvia",                    code: 428,  lat:  56.88, lon:   24.60 },
    { name: "Estonia",                   code: 233,  lat:  58.60, lon:   25.01 },
    { name: "Russia",                    code: 643,  lat:  61.52, lon:  105.32 },

    // Middle East & Central Asia
    { name: "Turkey",                    code: 792,  lat:  38.96, lon:   35.24 },
    { name: "Georgia",                   code: 268,  lat:  42.32, lon:   43.36 },
    { name: "Armenia",                   code: 51,   lat:  40.07, lon:   45.04 },
    { name: "Azerbaijan",                code: 31,   lat:  40.14, lon:   47.58 },
    { name: "Kazakhstan",                code: 398,  lat:  48.02, lon:   66.92 },
    { name: "Uzbekistan",                code: 860,  lat:  41.38, lon:   64.59 },
    { name: "Turkmenistan",              code: 795,  lat:  40.55, lon:   58.00 },
    { name: "Kyrgyzstan",                code: 417,  lat:  41.20, lon:   74.77 },
    { name: "Tajikistan",                code: 762,  lat:  38.86, lon:   71.28 },
    { name: "Afghanistan",               code: 4,    lat:  33.94, lon:   67.71 },
    { name: "Iraq",                      code: 368,  lat:  33.22, lon:   43.68 },
    { name: "Iran",                      code: 364,  lat:  32.43, lon:   53.69 },
    { name: "Syria",                     code: 760,  lat:  34.80, lon:   38.99 },
    { name: "Lebanon",                   code: 422,  lat:  33.85, lon:   35.86 },
    { name: "Jordan",                    code: 400,  lat:  30.59, lon:   36.24 },
    { name: "Israel",                    code: 376,  lat:  31.05, lon:   34.85 },
    { name: "Saudi Arabia",              code: 682,  lat:  23.89, lon:   45.08 },
    { name: "Yemen",                     code: 887,  lat:  15.55, lon:   48.52 },
    { name: "Oman",                      code: 512,  lat:  21.51, lon:   55.92 },
    { name: "United Arab Emirates",      code: 784,  lat:  23.42, lon:   53.85 },
    { name: "Qatar",                     code: 634,  lat:  25.35, lon:   51.18 },
    { name: "Bahrain",                   code: 48,   lat:  26.00, lon:   50.55 },
    { name: "Kuwait",                    code: 414,  lat:  29.31, lon:   47.48 },

    // South & Southeast Asia
    { name: "Pakistan",                  code: 586,  lat:  30.38, lon:   69.35 },
    { name: "India",                     code: 356,  lat:  20.59, lon:   78.96 },
    { name: "Nepal",                     code: 524,  lat:  28.39, lon:   84.12 },
    { name: "Bhutan",                    code: 64,   lat:  27.51, lon:   90.43 },
    { name: "Bangladesh",                code: 50,   lat:  23.68, lon:   90.36 },
    { name: "Sri Lanka",                 code: 144,  lat:   7.87, lon:   80.77 },
    { name: "Myanmar",                   code: 104,  lat:  17.11, lon:   96.66 },
    { name: "Thailand",                  code: 764,  lat:  15.87, lon:  100.99 },
    { name: "Laos",                      code: 418,  lat:  19.86, lon:  102.50 },
    { name: "Vietnam",                   code: 704,  lat:  14.06, lon:  108.28 },
    { name: "Cambodia",                  code: 116,  lat:  12.57, lon:  104.99 },
    { name: "Malaysia",                  code: 458,  lat:   4.21, lon:  108.97 },
    { name: "Singapore",                 code: 702,  lat:   1.35, lon:  103.82 },
    { name: "Indonesia",                 code: 360,  lat:  -0.79, lon:  113.92 },
    { name: "Philippines",               code: 608,  lat:  12.88, lon:  121.77 },
    { name: "Brunei",                    code: 96,   lat:   4.54, lon:  114.73 },
    { name: "East Timor",                code: 626,  lat:  -8.87, lon:  125.73 },

    // East Asia
    { name: "China",                     code: 156,  lat:  35.86, lon:  104.20 },
    { name: "Mongolia",                  code: 496,  lat:  46.86, lon:  103.85 },
    { name: "North Korea",               code: 408,  lat:  40.34, lon:  127.51 },
    { name: "South Korea",               code: 410,  lat:  35.91, lon:  127.77 },
    { name: "Japan",                     code: 392,  lat:  36.20, lon:  138.25 },

    // Africa
    { name: "Morocco",                   code: 504,  lat:  31.79, lon:   -7.09 },
    { name: "Algeria",                   code: 12,   lat:  28.03, lon:    1.66 },
    { name: "Tunisia",                   code: 788,  lat:  33.89, lon:    9.54 },
    { name: "Libya",                     code: 434,  lat:  26.34, lon:   17.23 },
    { name: "Egypt",                     code: 818,  lat:  26.82, lon:   30.80 },
    { name: "Sudan",                     code: 729,  lat:  12.86, lon:   30.22 },
    { name: "South Sudan",               code: 728,  lat:   6.88, lon:   31.31 },
    { name: "Ethiopia",                  code: 231,  lat:   9.15, lon:   40.49 },
    { name: "Eritrea",                   code: 232,  lat:  15.18, lon:   39.78 },
    { name: "Djibouti",                  code: 262,  lat:  11.83, lon:   42.59 },
    { name: "Somalia",                   code: 706,  lat:   5.15, lon:   46.20 },
    { name: "Kenya",                     code: 404,  lat:  -0.02, lon:   37.91 },
    { name: "Uganda",                    code: 800,  lat:   1.37, lon:   32.29 },
    { name: "Tanzania",                  code: 834,  lat:  -6.37, lon:   34.89 },
    { name: "Rwanda",                    code: 646,  lat:  -1.94, lon:   29.87 },
    { name: "Burundi",                   code: 108,  lat:  -3.37, lon:   29.92 },
    { name: "DR Congo",                  code: 180,  lat:  -4.04, lon:   21.76 },
    { name: "Congo",                     code: 178,  lat:  -0.23, lon:   15.83 },
    { name: "Central African Republic",  code: 140,  lat:   6.61, lon:   20.94 },
    { name: "Cameroon",                  code: 120,  lat:   3.85, lon:   11.50 },
    { name: "Nigeria",                   code: 566,  lat:   9.08, lon:    8.68 },
    { name: "Niger",                     code: 562,  lat:  17.61, lon:    8.08 },
    { name: "Chad",                      code: 148,  lat:  15.45, lon:   18.73 },
    { name: "Mali",                      code: 466,  lat:  17.57, lon:   -3.99 },
    { name: "Burkina Faso",              code: 854,  lat:  12.36, lon:   -1.56 },
    { name: "Senegal",                   code: 686,  lat:  14.50, lon:  -14.45 },
    { name: "Gambia",                    code: 270,  lat:  13.44, lon:  -15.31 },
    { name: "Guinea-Bissau",             code: 624,  lat:  11.80, lon:  -15.18 },
    { name: "Guinea",                    code: 324,  lat:   9.95, lon:  -11.24 },
    { name: "Sierra Leone",              code: 694,  lat:   8.46, lon:  -11.78 },
    { name: "Liberia",                   code: 430,  lat:   6.43, lon:   -9.43 },
    { name: "Ivory Coast",               code: 384,  lat:   7.54, lon:   -5.55 },
    { name: "Ghana",                     code: 288,  lat:   7.95, lon:   -1.02 },
    { name: "Togo",                      code: 768,  lat:   8.62, lon:    0.82 },
    { name: "Benin",                     code: 204,  lat:   9.31, lon:    2.32 },
    { name: "Mauritania",                code: 478,  lat:  21.01, lon:  -10.94 },
    { name: "Gabon",                     code: 266,  lat:  -0.80, lon:   11.61 },
    { name: "Equatorial Guinea",         code: 226,  lat:   1.65, lon:   10.27 },
    { name: "Angola",                    code: 24,   lat: -11.20, lon:   17.87 },
    { name: "Zambia",                    code: 894,  lat: -13.13, lon:   27.85 },
    { name: "Zimbabwe",                  code: 716,  lat: -19.02, lon:   29.15 },
    { name: "Mozambique",                code: 508,  lat: -18.67, lon:   35.53 },
    { name: "Malawi",                    code: 454,  lat: -13.25, lon:   34.30 },
    { name: "Botswana",                  code: 72,   lat: -22.33, lon:   24.68 },
    { name: "Namibia",                   code: 516,  lat: -22.96, lon:   18.49 },
    { name: "South Africa",              code: 710,  lat: -30.56, lon:   22.94 },
    { name: "Eswatini",                  code: 748,  lat: -26.52, lon:   31.47 },
    { name: "Lesotho",                   code: 426,  lat: -29.61, lon:   28.23 },
    { name: "Madagascar",                code: 450,  lat: -18.77, lon:   46.87 },
    { name: "Cape Verde",                code: 132,  lat:  16.54, lon:  -24.01 },
    { name: "Sao Tome and Principe",     code: 678,  lat:   0.19, lon:    6.61 },
    { name: "Comoros",                   code: 174,  lat: -11.65, lon:   43.33 },
    { name: "Seychelles",                code: 690,  lat:  -4.68, lon:   55.49 },
    { name: "Mauritius",                 code: 480,  lat: -20.35, lon:   57.55 },

    // Small island nations — Caribbean
    { name: "Bahamas",                   code: 44,   lat:  25.03, lon:  -77.40 },
    { name: "Barbados",                  code: 52,   lat:  13.19, lon:  -59.54 },
    { name: "Antigua and Barbuda",       code: 28,   lat:  17.06, lon:  -61.80 },
    { name: "Dominica",                  code: 212,  lat:  15.41, lon:  -61.37 },
    { name: "Grenada",                   code: 308,  lat:  12.12, lon:  -61.68 },
    { name: "Saint Lucia",               code: 662,  lat:  13.91, lon:  -60.98 },
    { name: "Saint Vincent and the Grenadines", code: 670, lat: 12.98, lon: -61.29 },
    { name: "Saint Kitts and Nevis",     code: 659,  lat:  17.36, lon:  -62.78 },

    // Small European nations
    { name: "Andorra",                   code: 20,   lat:  42.55, lon:    1.60 },
    { name: "Monaco",                    code: 492,  lat:  43.74, lon:    7.41 },
    { name: "San Marino",                code: 674,  lat:  43.94, lon:   12.46 },
    { name: "Liechtenstein",             code: 438,  lat:  47.17, lon:    9.56 },
    { name: "Malta",                     code: 470,  lat:  35.94, lon:   14.38 },
    { name: "Cyprus",                    code: 196,  lat:  35.13, lon:   33.43 },

    // Asia
    { name: "Maldives",                  code: 462,  lat:   3.20, lon:   73.22 },

    // Oceania
    { name: "Australia",                 code: 36,   lat: -25.27, lon:  133.78 },
    { name: "New Zealand",               code: 554,  lat: -40.90, lon:  174.89 },
    { name: "Papua New Guinea",          code: 598,  lat:  -6.31, lon:  143.96 },
    { name: "Fiji",                      code: 242,  lat: -17.71, lon:  178.07 },
    { name: "Vanuatu",                   code: 548,  lat: -15.38, lon:  166.96 },
    { name: "Solomon Islands",           code: 90,   lat:  -9.65, lon:  160.16 },
    { name: "Samoa",                     code: 882,  lat: -13.76, lon: -172.10 },
    { name: "Tonga",                     code: 776,  lat: -21.18, lon: -175.20 },
    { name: "Kiribati",                  code: 296,  lat:  -3.37, lon: -168.73 },
    { name: "Micronesia",                code: 583,  lat:   7.43, lon:  150.55 },
    { name: "Palau",                     code: 585,  lat:   7.52, lon:  134.58 },
    { name: "Marshall Islands",          code: 584,  lat:   7.13, lon:  171.18 },
    { name: "Nauru",                     code: 520,  lat:  -0.53, lon:  166.92 },
    { name: "Tuvalu",                    code: 798,  lat:  -7.11, lon:  177.65 },
];

// ============================================
// DIFFICULTY MODE
// ============================================
let hardMode = localStorage.getItem('geolock_hard') === 'true';

function updateModeBtn() {
    const btn = document.getElementById('modeBtn');
    if (!btn) return;
    btn.textContent = hardMode ? '🔒 Hard mode' : '🧭 Easy mode';
    btn.style.color = hardMode ? '#c84020' : '#55b725';
}

document.getElementById('modeBtn').addEventListener('click', () => {
    hardMode = !hardMode;
    localStorage.setItem('geolock_hard', hardMode);
    updateModeBtn();
    render();
});

updateModeBtn();

// ============================================
// DAILY COUNTRY
// ============================================
const SAVE_KEY     = 'global_' + getTodayString();
const todayCountry = COUNTRIES[getDailyIndex(COUNTRIES)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        guesses: [], // [{ name, km, bearing }]
        gameOver: false,
        won: false,
    };
}
function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state = loadState();

// ============================================
// MATHS
// ============================================
function haversine(lat1, lon1, lat2, lon2) {
    const R  = 6371;
    const r  = x => x * Math.PI / 180;
    const dL = r(lat2 - lat1);
    const dO = r(lon2 - lon1);
    const a  = Math.sin(dL / 2) ** 2 +
               Math.cos(r(lat1)) * Math.cos(r(lat2)) * Math.sin(dO / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

function getBearing(lat1, lon1, lat2, lon2) {
    const r  = x => x * Math.PI / 180;
    const dO = r(lon2 - lon1);
    const y  = Math.sin(dO) * Math.cos(r(lat2));
    const x  = Math.cos(r(lat1)) * Math.sin(r(lat2)) -
               Math.sin(r(lat1)) * Math.cos(r(lat2)) * Math.cos(dO);
    return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function getArrow(bearing) {
    return ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'][Math.round(bearing / 45) % 8];
}

function formatKm(km) {
    return km < 100 ? Math.round(km) + ' km'
         : km < 1000 ? Math.round(km / 10) * 10 + ' km'
         : Math.round(km).toLocaleString() + ' km';
}

// ============================================
// COLOURS
// ============================================
function getTempColor(km, border) {
    if (border)       return '#c62121'; // borders answer
    if (km === 0)     return '#55b725'; // correct
    if (km < 500)     return '#e8602a'; // scorching
    if (km < 1500)    return '#d45520'; // very hot
    if (km < 3000)    return '#c8981a'; // hot
    if (km < 5500)    return '#6a7a3a'; // warm
    if (km < 9000)    return '#7a9ab0'; // cold
    return '#b0c8d8';                   // freezing
}

function getTempLabel(km, border) {
    if (border)       return 'Borders!';
    if (km === 0)     return 'Correct!';
    if (km < 500)     return 'Scorching';
    if (km < 1500)    return 'Very Hot';
    if (km < 3000)    return 'Hot';
    if (km < 5500)    return 'Warm';
    if (km < 9000)    return 'Cold';
    return 'Freezing';
}

// ============================================
// BORDER DETECTION
// ============================================
let neighborsList   = [];
let worldGeometries = [];

function areBorders(codeA, codeB) {
    const idxA = worldGeometries.findIndex(g => +g.id === codeA);
    const idxB = worldGeometries.findIndex(g => +g.id === codeB);
    if (idxA === -1 || idxB === -1) return false;
    return neighborsList[idxA] && neighborsList[idxA].includes(idxB);
}

// ============================================
// GLOBE
// ============================================
let svgEl, projection, pathFn, countryFeatures, globeReady = false;

async function initGlobe() {
    const wrap   = document.getElementById('globeContainer');
    const W      = Math.min(wrap.clientWidth, 420);
    const H      = W;
    const radius = W / 2 - 4;

    svgEl = d3.select('#globeContainer')
        .append('svg')
        .attr('viewBox', `0 0 ${W} ${H}`)
        .attr('style', 'width:100%;display:block;touch-action:none;');

    projection = d3.geoOrthographic()
        .scale(radius)
        .rotate([0, -20])
        .translate([W / 2, H / 2])
        .clipAngle(90);

    pathFn = d3.geoPath().projection(projection);

    // Clip path — countries are masked to the globe circle
    svgEl.append('defs')
        .append('clipPath').attr('id', 'globe-clip')
        .append('circle')
        .attr('cx', W / 2).attr('cy', H / 2).attr('r', radius);

    // Ocean sphere
    svgEl.append('circle')
        .attr('cx', W / 2).attr('cy', H / 2).attr('r', radius)
        .attr('fill', '#1a6896')
        .attr('stroke', '#1a4a70').attr('stroke-width', 1);

    let world;
    try {
        world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
    } catch (e) {
        document.querySelector('.globle-drag-hint').textContent = 'Globe failed to load — guessing still works';
        return;
    }

    countryFeatures = topojson.feature(world, world.objects.countries).features;
    worldGeometries = world.objects.countries.geometries;
    neighborsList   = topojson.neighbors(worldGeometries);

    // Draw all countries inside a clipped group so nothing spills outside the circle
    const countryGroup = svgEl.append('g').attr('clip-path', 'url(#globe-clip)');
    countryGroup.selectAll('.globe-country')
        .data(countryFeatures)
        .enter()
        .append('path')
        .attr('class', d => 'globe-country gc-' + d.id)
        .attr('d', pathFn)
        .attr('fill', '#4a7a45')
        .attr('stroke', '#2a4a28')
        .attr('stroke-width', 0.5);

    // Drag to rotate (single finger / mouse only)
    const drag = d3.drag()
        .filter(event => !event.touches || event.touches.length === 1)
        .on('drag', event => {
            const [rx, ry] = projection.rotate();
            const k = 75 / projection.scale();
            projection.rotate([rx + event.dx * k, ry - event.dy * k]);
            svgEl.selectAll('path').attr('d', pathFn);
        });
    svgEl.call(drag);

    // Scroll-wheel zoom
    svgEl.on('wheel', event => {
        event.preventDefault();
        const factor   = event.deltaY > 0 ? 0.92 : 1.08;
        const minScale = radius;
        const maxScale = radius * 4;
        projection.scale(Math.max(minScale, Math.min(maxScale, projection.scale() * factor)));
        svgEl.selectAll('path').attr('d', pathFn);
    }, { passive: false });

    // Pinch-to-zoom (two fingers)
    let pinchDist = null;
    svgEl.on('touchstart', event => {
        if (event.touches.length === 2) {
            pinchDist = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
        }
    }, { passive: true });

    svgEl.on('touchmove', event => {
        if (event.touches.length === 2 && pinchDist !== null) {
            event.preventDefault();
            const newDist = Math.hypot(
                event.touches[0].clientX - event.touches[1].clientX,
                event.touches[0].clientY - event.touches[1].clientY
            );
            const factor   = newDist / pinchDist;
            pinchDist      = newDist;
            const minScale = radius;
            const maxScale = radius * 4;
            projection.scale(Math.max(minScale, Math.min(maxScale, projection.scale() * factor)));
            svgEl.selectAll('path').attr('d', pathFn);
        }
    }, { passive: false });

    svgEl.on('touchend', () => { pinchDist = null; });

    globeReady = true;

    // Re-colour any already-saved guesses
    state.guesses.forEach(g => colorCountry(g));
}

function colorCountry(guess) {
    if (!globeReady) return;
    const c = COUNTRIES.find(c => c.name === guess.name);
    if (!c) return;
    const color = getTempColor(guess.km, guess.border);
    const isCorrect = guess.km === 0 && !guess.border;
    svgEl.selectAll('.gc-' + c.code)
        .attr('fill', color)
        .attr('stroke', isCorrect ? '#fff' : '#161819')
        .attr('stroke-width', isCorrect ? 1.5 : 0.4);
}

function rotateTo(country) {
    if (!globeReady || !svgEl) return;
    const targetRotate = [-country.lon, -country.lat];
    const current      = projection.rotate();
    const interp       = d3.interpolate(current, targetRotate);

    d3.transition().duration(900).ease(d3.easeCubicInOut)
        .tween('rotate', () => t => {
            projection.rotate(interp(t));
            svgEl.selectAll('path').attr('d', pathFn);
        });
}

// ============================================
// AUTOCOMPLETE
// ============================================
const countryInput = document.getElementById('countryInput');
const autocomplete = document.getElementById('autocomplete');

// Deduplicate COUNTRIES by name for autocomplete
const uniqueCountries = COUNTRIES.filter((c, i, arr) => arr.findIndex(x => x.name === c.name) === i);

countryInput.addEventListener('input', () => {
    const val = countryInput.value.toLowerCase().trim();
    autocomplete.innerHTML = '';
    if (!val) return;

    uniqueCountries
        .filter(c => c.name.toLowerCase().includes(val))
        .slice(0, 7)
        .forEach(c => {
            const item       = document.createElement('div');
            item.className   = 'autocomplete-item';
            item.textContent = c.name;
            item.addEventListener('click', () => {
                countryInput.value = c.name;
                autocomplete.innerHTML = '';
            });
            autocomplete.appendChild(item);
        });
});

document.addEventListener('click', e => {
    if (!countryInput.contains(e.target) && !autocomplete.contains(e.target)) {
        autocomplete.innerHTML = '';
    }
});

// ============================================
// SUBMIT GUESS
// ============================================
function submitGuess() {
    if (state.gameOver) return;
    const raw     = countryInput.value.trim();
    if (!raw) return;

    const country = uniqueCountries.find(c => c.name.toLowerCase() === raw.toLowerCase());
    if (!country) {
        countryInput.classList.add('shake');
        setTimeout(() => countryInput.classList.remove('shake'), 400);
        showMsg('Country not found — check spelling');
        return;
    }

    const alreadyGuessed = state.guesses.find(g => g.name === country.name);
    if (alreadyGuessed) {
        showMsg('Already guessed!');
        return;
    }

    let km        = Math.round(haversine(country.lat, country.lon, todayCountry.lat, todayCountry.lon));
    const bearing = getBearing(country.lat, country.lon, todayCountry.lat, todayCountry.lon);
    const won     = country.name === todayCountry.name;
    const border  = !won && areBorders(country.code, todayCountry.code);
    if (border) km = 0;

    const guess = { name: country.name, km, bearing, border };
    state.guesses.push(guess);

    if (won) {
        state.gameOver = true;
        state.won      = true;
        markGamePlayed('geolock');
    }

    countryInput.value     = '';
    autocomplete.innerHTML = '';
    saveState(state);

    colorCountry(guess);
    rotateTo(country);
    render();
}

document.getElementById('submitBtn').addEventListener('click', submitGuess);
countryInput.addEventListener('keydown', e => { if (e.key === 'Enter') submitGuess(); });

function showMsg(msg) {
    const old = document.querySelector('.globle-msg');
    if (old) old.remove();
    const el       = document.createElement('p');
    el.className   = 'globle-msg';
    el.textContent = msg;
    document.getElementById('inputSection').before(el);
    setTimeout(() => el.remove(), 2000);
}

// ============================================
// RENDER
// ============================================
function render() {
    // Guess count
    const n = state.guesses.length;
    document.getElementById('guessCount').textContent =
        n === 0 ? '0 guesses' : n === 1 ? '1 guess' : n + ' guesses';

    // Guess history — newest first
    const history = document.getElementById('guessHistory');
    history.innerHTML = '';
    [...state.guesses].reverse().forEach(g => {
        const row       = document.createElement('div');
        row.className   = 'globle-guess-row';
        const dot       = document.createElement('div');
        dot.className   = 'globle-temp-dot';
        dot.style.background = getTempColor(g.km, g.border);

        const nameEl    = document.createElement('span');
        nameEl.className = 'globle-guess-name';
        nameEl.textContent = g.name;

        const arrow     = document.createElement('span');
        arrow.className = 'globle-arrow';
        arrow.textContent = (g.km === 0 || hardMode) ? '' : getArrow(g.bearing);

        const dist      = document.createElement('span');
        dist.className  = 'globle-distance';
        dist.textContent = (g.km === 0 && !g.border) ? 'Correct!'
                         : g.border ? '0 km away'
                         : formatKm(g.km) + ' away';

        const label     = document.createElement('span');
        label.className = 'globle-temp-label';
        label.textContent = getTempLabel(g.km, g.border);

        row.append(dot, nameEl, arrow, dist, label);
        history.appendChild(row);
    });

    // Game over
    if (state.gameOver) {
        document.getElementById('inputSection').style.display = 'none';
        const box   = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className     = 'result-box win';
        box.innerHTML     = `
            <h3>You found it!</h3>
            <p>The mystery country was <strong>${todayCountry.name}</strong>.</p>
            <p>You guessed it in <strong>${state.guesses.length}</strong> ${state.guesses.length === 1 ? 'try' : 'tries'}.</p>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        `;
    }
}

// ============================================
// INIT
// ============================================
initGlobe();
render();
