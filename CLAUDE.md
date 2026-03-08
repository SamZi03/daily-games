# Daily Streaks — Project Guide for Claude

## What this project is
A collection of daily browser games (no frameworks, vanilla HTML/CSS/JS).
Each game resets daily, saves progress in localStorage, and tracks streaks.
Live at: https://samzi03.github.io/daily-games
Repo: https://github.com/SamZi03/daily-games

---

## Agent roles — who touches what

This project uses a split data/logic structure so different agents can work
without stepping on each other. Stick to your lane.

### Content Agent
**Job:** Add new words, songs, countries, clues — anything that expands game content.
**Only touches:** `games/*/data.js`
**Never touches:** `game.js`, `index.html`, `style.css`
**Rules:**
- Append new entries at the bottom of the relevant array/object. Never rewrite existing entries.
- Use compact format (no alignment padding — see existing entries for style).
- For SpellLock: follow the difficulty rules in data.js header comment.
- For ClueLock: every new word needs a matching SIMILARITY block and CLUES block.
- For EarLock: just `{title, artist, year}` — no URLs needed.

### Game Logic Agent
**Job:** Fix bugs, add new features, change game mechanics.
**Only touches:** `games/*/game.js`
**Never touches:** `data.js` (reads it, never edits it)
**Rules:**
- Do not reformat or move data that belongs in data.js.
- Keep logic lean — no helper functions unless used in 3+ places.

### Style Agent
**Job:** Visual changes, layout tweaks, new CSS classes.
**Only touches:** `css/style.css`
**Never touches:** JS files or data files.

### Full-Stack Agent (default Claude session)
**Job:** Multi-file features that span logic + style, bug fixes, new game pages.
**Touches:** Anything needed, but respects the data/logic split.

---

## File structure

```
daily-games/
  index.html              — home page / game selector
  css/style.css           — all styles (single file)
  js/
    app.js                — shared helpers (getDailyIndex, getTodayString, markGamePlayed)
    sidebar.js            — streak sidebar
  games/
    clueless/             — ClueLock (word association / temperature rank game)
      data.js             — WORDS, SIMILARITY, CLUES
      game.js             — logic only
      index.html
    spellcast/            — SpellLock (listen and spell)
      data.js             — WORD_SETS
      game.js             — logic only
      index.html
    earworm/              — EarLock (guess the song from a clip)
      data.js             — SONGS
      game.js             — logic only
      index.html
    global/               — GeoLock (guess the country)
      game.js             — logic + country data (countries list is final, not expanding)
      index.html
    cover/                — CoverLock
    lexico/               — LexiLock
    recall/               — RecallLock
    higher-lower/         — HighLock
```

---

## Shared helper functions (in js/app.js)

```js
getDailyIndex(array)   // returns today's index into any array, resets daily
getTodayString()       // returns 'YYYY-MM-DD'
markGamePlayed(id)     // call on game completion to update streak sidebar
```

Always call `markGamePlayed(id)` when a game ends. Game IDs:
- ClueLock: `'cluelock'`
- SpellLock: `'spelllock'`  ← legacy name, do not change
- EarLock: `'earlock'`
- GeoLock: `'geolock'`

---

## Key conventions

### Token efficiency (user is on Pro tier — tokens are limited)
- **Read data.js files minimally.** For content expansion, you only need to read
  the last few entries to confirm format, then append.
- **Targeted edits only.** Never rewrite a whole file when a small Edit will do.
- **Compact data format.** No alignment padding in data files. Compare:
  - Bad:  `{word:'bird',      definition:'A feathered animal...', sentence:'...'}`
  - Good: `{word:'bird', definition:'A feathered animal...', sentence:'...'}`

### Data file rules
- New entries always go at the **bottom** of their array/object (append-only).
- Never reorder existing entries — getDailyIndex is date-based, so reordering
  changes which content players see on a given day.
- Each data.js has a header comment explaining the format — read it before editing.

### Git workflow
- Always `git add [specific files]` — never `git add .` or `git add -A`
- Commit message format: `GameName: short description of change`
- Push after every completed task: `git push`

### Style
- Dark theme. CSS variables in style.css (--bg, --text, --muted, --accent etc.)
- Use `var(--text)` for readable text, `var(--muted)` only for truly secondary info.
- Mobile-first. All games must work on a phone screen.

### No over-engineering
- Don't add features not asked for.
- Don't add comments to code you didn't change.
- Don't create abstractions for one-off operations.

---

## Games that will expand (content agent territory)

| Game | Expanding | Current count | Target |
|------|-----------|---------------|--------|
| SpellLock | Yes — add word sets | 10 sets | 52+ (one per week) |
| EarLock | Yes — add songs | ~260 songs | 365+ |
| ClueLock | Yes — add words | 30 words | 365 words |
| GeoLock | No — country list is final | 197 countries | — |

---

## ClueLock data format (most complex — read carefully)

```js
// In WORDS array:
'newword',

// In SIMILARITY object — scores 5-99, higher = closer to target word:
newword: {
    closeword1:97, closeword2:95, closeword3:90,  // very close
    relatedword:70, vaguelyrelated:50,              // medium
    distantword:20, veryfarword:8,                  // far
},

// In CLUES array — 5 clues, vague to obvious:
newword: [
    "Very vague clue — could be many things.",
    "Slightly more specific.",
    "Getting warmer.",
    "Quite specific now.",
    "Almost gives it away.",
],
```

SIMILARITY entries need ~40-50 words covering the full score range 5-97.
Use only GCSE-level vocabulary (no obscure words in the similarity table).

---

## SpellLock difficulty rules

```
R1 [0]: 3-5 letters, everyday word (bird, cat, rain)
R2 [1]: 5-6 letters, common word (storm, bread, music)
R3 [2]: tricky spelling pattern (occurrence, pharmacy, rhythm, jeopardy)
R4 [3]: long, commonly misspelled (miscellaneous, surveillance, entrepreneur)
R5 [4]: obscure, rarely seen, hard to spell (onomatopoeia, rhododendron, chrysanthemum)
```
