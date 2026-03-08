// ============================================
// CLUELOCK — Word association / temperature game
// Type any word and get a rank showing how
// semantically close it is to the mystery word.
// Rank 1 = exact match, up to ~20,000 = very far.
// ============================================

// Daily word pool (cycles through the year)
const WORDS = [
    'ocean', 'fire', 'castle', 'jungle', 'gold',
    'storm', 'dream', 'mirror', 'thunder', 'diamond',
    'moon', 'coffee', 'music', 'football', 'winter',
    'summer', 'robot', 'vampire', 'treasure', 'mountain',
    'library', 'concert', 'shadow', 'space', 'birthday',
    'garden', 'pizza', 'forest', 'school', 'hospital',
];

// ============================================
// SIMILARITY DATA
// Scores 1-99 used internally, displayed as ranks
// Higher score = closer to the target word
// ============================================
const SIMILARITY = {
    ocean: {
        sea: 97, marine: 95, aquatic: 93, nautical: 91, water: 88,
        wave: 86, tide: 84, coast: 82, beach: 80, shore: 78,
        reef: 76, coral: 74, depth: 72, current: 70, bay: 68,
        island: 66, gulf: 64, surf: 62, sand: 60, fish: 65,
        whale: 63, shark: 61, dolphin: 59, crab: 57, seagull: 55,
        swim: 58, sail: 56, boat: 54, ship: 52, sailor: 50,
        harbour: 53, port: 51, vessel: 49, navy: 47, voyage: 45,
        cliff: 43, pirate: 41, tropical: 44, blue: 39, deep: 37,
        salty: 35, vast: 33, horizon: 31, storm: 29, flood: 27,
        river: 25, lake: 22, pool: 19, rain: 16, sky: 13,
        cold: 10, dark: 8, wet: 6,
    },
    fire: {
        flame: 97, blaze: 95, burn: 93, heat: 91, inferno: 89,
        smoke: 87, ash: 85, ember: 83, spark: 81, glow: 79,
        hot: 77, bonfire: 75, campfire: 73, wildfire: 71, torch: 69,
        lava: 67, volcano: 65, coal: 63, fuel: 61, charcoal: 59,
        candle: 57, match: 55, wood: 53, hearth: 51, pit: 49,
        warmth: 47, light: 45, red: 43, orange: 41, cook: 39,
        barbecue: 37, dragon: 35, alarm: 33, danger: 31, flare: 29,
        explosion: 27, destroy: 24, melt: 21, energy: 18, dark: 15,
        water: 12, cold: 9, ice: 7, rain: 5,
    },
    castle: {
        fortress: 97, fort: 95, palace: 93, tower: 91, dungeon: 89,
        moat: 87, wall: 85, gate: 83, drawbridge: 81, knight: 79,
        king: 77, queen: 75, throne: 73, kingdom: 71, prince: 69,
        princess: 67, dragon: 65, sword: 63, shield: 61, armour: 59,
        guard: 57, battle: 55, siege: 53, archer: 51, crown: 60,
        medieval: 70, stone: 49, ancient: 47, ruin: 45, flag: 43,
        history: 40, war: 38, attack: 36, defend: 34, iron: 32,
        roof: 30, door: 28, hall: 26, court: 24, lord: 22,
        old: 18, big: 15, strong: 12, dark: 9, cold: 7, tall: 5,
    },
    jungle: {
        rainforest: 97, tropical: 95, amazon: 93, forest: 90, wild: 88,
        tree: 86, vine: 84, plant: 82, leaf: 80, canopy: 78,
        snake: 76, monkey: 74, tiger: 72, elephant: 70, gorilla: 68,
        parrot: 66, frog: 64, spider: 62, bird: 60, insect: 58,
        hot: 72, humid: 70, wet: 65, rain: 68, green: 66,
        river: 56, mud: 54, swamp: 52, bush: 50, grass: 48,
        explore: 46, adventure: 44, danger: 42, hunt: 40, survive: 38,
        tribe: 36, africa: 34, brazil: 32, dark: 30, thick: 28,
        deep: 26, wildlife: 24, nature: 22, travel: 18, remote: 15,
        cold: 10, city: 8, road: 6, dry: 5,
    },
    gold: {
        golden: 97, treasure: 95, riches: 93, wealth: 91, silver: 89,
        coin: 87, jewel: 85, gem: 83, ring: 81, crown: 79,
        medal: 77, metal: 75, rich: 73, valuable: 71, bronze: 69,
        diamond: 67, necklace: 65, chain: 63, bar: 61, mine: 59,
        shiny: 57, sparkle: 55, shine: 53, bright: 51, glitter: 49,
        yellow: 47, expensive: 45, rare: 43, luxury: 41, trophy: 56,
        prize: 58, award: 52, olympic: 50, win: 38, reward: 36,
        money: 34, bank: 32, worth: 30, dig: 28, earth: 25,
        rock: 22, colour: 18, light: 15, hard: 12, dull: 8, cheap: 5,
    },
    storm: {
        hurricane: 97, tornado: 95, cyclone: 93, typhoon: 91, blizzard: 89,
        thunder: 87, lightning: 85, gale: 83, downpour: 81, rain: 79,
        hail: 77, wind: 75, flood: 73, cloud: 71, dark: 69,
        grey: 67, wet: 65, cold: 63, shelter: 61, danger: 59,
        weather: 57, sky: 55, sea: 53, wave: 51, snow: 49,
        chaos: 47, power: 45, electric: 43, forecast: 41, umbrella: 39,
        coat: 37, damage: 35, force: 33, strong: 31, heavy: 29,
        outdoor: 27, evening: 25, night: 23, fear: 21, loud: 19,
        calm: 15, quiet: 12, warm: 9, sun: 7, dry: 5,
    },
    dream: {
        nightmare: 97, sleep: 95, fantasy: 93, imagination: 91, vision: 89,
        wish: 87, hope: 85, illusion: 83, wonder: 81, thought: 79,
        mind: 77, night: 75, rest: 73, bed: 71, awake: 69,
        reality: 67, memory: 65, feeling: 63, emotion: 61, idea: 59,
        escape: 57, story: 55, cloud: 53, float: 51, peace: 49,
        calm: 47, soft: 45, dark: 43, strange: 41, vivid: 39,
        deep: 37, long: 35, forget: 33, morning: 31, eye: 29,
        head: 27, brain: 25, tired: 22, silent: 19, star: 16,
        white: 13, pale: 10, still: 7, quiet: 5,
    },
    mirror: {
        reflection: 97, glass: 95, image: 93, face: 91, surface: 89,
        look: 87, copy: 85, double: 83, twin: 81, beauty: 79,
        appearance: 77, vanity: 75, clear: 73, shiny: 71, polished: 69,
        bathroom: 67, bedroom: 65, window: 63, wall: 61, light: 59,
        silver: 57, bright: 55, smooth: 53, flat: 51, see: 49,
        selfie: 47, photo: 45, art: 43, frame: 41, shape: 39,
        shadow: 37, dark: 35, true: 33, real: 31, fake: 29,
        behind: 27, front: 25, angle: 22, check: 20, home: 18,
        room: 15, hand: 12, eye: 9, small: 7, big: 5,
    },
    thunder: {
        lightning: 97, storm: 95, rumble: 93, boom: 91, crash: 89,
        roar: 87, loud: 85, noise: 83, clap: 81, electric: 79,
        sky: 77, cloud: 75, rain: 73, dark: 71, power: 69,
        shock: 67, sound: 65, roll: 63, vibration: 61, echo: 59,
        fear: 57, danger: 55, weather: 53, force: 51, strong: 49,
        deep: 47, heavy: 45, sudden: 43, night: 41, window: 39,
        ground: 37, shake: 35, alarm: 33, outside: 31, dog: 29,
        quiet: 25, soft: 22, gentle: 18, calm: 15, still: 12,
        silent: 9, sleep: 7, dream: 5,
    },
    diamond: {
        gem: 97, jewel: 95, crystal: 93, ring: 91, precious: 89,
        sparkle: 87, shine: 85, necklace: 83, gold: 81, silver: 79,
        jewellery: 77, engagement: 75, wedding: 73, luxury: 71, expensive: 69,
        rare: 67, hard: 65, clear: 63, white: 61, rich: 59,
        beautiful: 57, gift: 55, love: 53, proposal: 51, stone: 49,
        rock: 47, earth: 45, mine: 43, glitter: 41, bright: 39,
        light: 37, value: 35, worth: 33, trade: 31, sell: 29,
        buy: 27, africa: 25, market: 22, small: 19, round: 16,
        sharp: 13, glass: 10, fake: 7, cheap: 5,
    },
    moon: {
        lunar: 97, night: 95, star: 93, sky: 91, moonlight: 89,
        orbit: 87, tide: 85, glow: 83, pale: 81, silver: 79,
        dark: 77, space: 75, planet: 73, earth: 71, sun: 69,
        light: 67, round: 65, full: 63, crescent: 61, phase: 59,
        crater: 57, gravity: 55, satellite: 53, eclipse: 51, astronaut: 49,
        rocket: 47, telescope: 45, wolf: 43, howl: 41, romance: 39,
        dream: 37, cloud: 35, horizon: 33, distant: 31, calm: 29,
        quiet: 27, cold: 25, white: 22, ocean: 20, water: 18,
        sleep: 15, soft: 12, float: 9, far: 7, high: 5,
    },
    coffee: {
        espresso: 97, latte: 95, brew: 93, bean: 91, caffeine: 89,
        barista: 87, roast: 85, aroma: 83, bitter: 81, hot: 79,
        mug: 77, cup: 75, morning: 73, energy: 71, milk: 69,
        cream: 67, sugar: 65, cafe: 63, drink: 61, wake: 59,
        dark: 57, brown: 55, strong: 53, fresh: 51, froth: 49,
        breakfast: 47, work: 45, office: 43, grind: 41, warm: 39,
        tea: 37, chocolate: 35, sweet: 33, relax: 31, tired: 29,
        busy: 27, daily: 25, smell: 22, food: 19, table: 16,
        shop: 13, slow: 10, cold: 7, iced: 5,
    },
    music: {
        melody: 97, rhythm: 95, song: 93, beat: 91, harmony: 89,
        tune: 87, note: 85, sound: 83, instrument: 81, band: 79,
        singer: 77, concert: 75, lyrics: 73, vocal: 71, guitar: 69,
        piano: 67, drums: 65, bass: 63, listen: 61, dance: 59,
        feel: 57, loud: 55, speaker: 53, headphone: 51, art: 49,
        emotion: 47, genre: 45, album: 43, track: 41, record: 39,
        radio: 37, live: 35, crowd: 33, perform: 31, stage: 29,
        fan: 27, show: 25, audio: 22, voice: 19, ear: 16,
        brain: 13, quiet: 10, silent: 7, noise: 5,
    },
    football: {
        goal: 97, pitch: 95, striker: 93, goalkeeper: 91, penalty: 89,
        foul: 87, referee: 85, match: 83, league: 81, stadium: 79,
        fan: 77, tackle: 75, ball: 73, kick: 71, team: 69,
        player: 67, manager: 65, score: 63, win: 61, loss: 59,
        draw: 57, trophy: 55, cup: 53, sport: 51, run: 49,
        pass: 47, shoot: 45, header: 43, corner: 41, throw: 39,
        chant: 37, shirt: 35, boot: 33, grass: 31, crowd: 29,
        weekend: 27, watch: 25, game: 22, compete: 20, outdoor: 18,
        fun: 15, tv: 12, seat: 9, loud: 7, rain: 5,
    },
    winter: {
        snow: 97, frost: 95, ice: 93, cold: 91, freeze: 89,
        blizzard: 87, hail: 85, sleet: 83, chill: 81, dark: 79,
        grey: 77, coat: 75, gloves: 73, scarf: 71, fireplace: 69,
        christmas: 67, snowman: 65, ski: 63, cosy: 61, bare: 59,
        december: 57, january: 55, season: 53, night: 51, wind: 49,
        storm: 47, rain: 45, wet: 43, fog: 41, hibernate: 39,
        animal: 37, sleep: 35, cover: 33, warm: 31, log: 29,
        fire: 27, soup: 25, hot: 22, indoor: 19, short: 16,
        spring: 13, autumn: 10, summer: 7, flower: 5,
    },
    summer: {
        sunshine: 97, hot: 95, warm: 93, heatwave: 91, sunny: 89,
        beach: 87, holiday: 85, swim: 83, outdoor: 81, barbecue: 79,
        picnic: 77, tan: 75, heat: 73, bright: 71, long: 69,
        july: 67, august: 65, june: 63, festival: 61, travel: 59,
        relax: 57, garden: 55, park: 53, light: 51, dry: 49,
        fun: 47, break: 45, sport: 43, evening: 41, late: 39,
        school: 37, freedom: 35, trip: 33, ice: 31, morning: 29,
        night: 27, early: 25, drought: 22, autumn: 18, spring: 15,
        winter: 12, rain: 9, grey: 7, cold: 5,
    },
    robot: {
        machine: 97, computer: 95, digital: 93, electric: 91, metal: 89,
        steel: 87, code: 85, programme: 83, sensor: 81, drone: 79,
        circuit: 77, wire: 75, engine: 73, screen: 71, technology: 69,
        factory: 67, engineer: 65, build: 63, design: 61, future: 59,
        smart: 57, learn: 55, control: 53, automatic: 51, power: 49,
        arm: 47, leg: 45, head: 43, human: 41, emotion: 39,
        think: 37, speak: 35, move: 33, science: 31, film: 29,
        fiction: 27, toy: 25, remote: 22, tool: 19, device: 17,
        hard: 14, cold: 11, fast: 8, strong: 5,
    },
    vampire: {
        dracula: 97, blood: 95, bat: 93, fangs: 91, coffin: 89,
        cape: 87, pale: 85, dark: 83, night: 81, bite: 79,
        immortal: 77, creature: 75, monster: 73, horror: 71, evil: 69,
        ghost: 67, castle: 65, gothic: 63, shadow: 61, graveyard: 59,
        garlic: 57, cross: 55, stake: 53, curse: 51, legend: 49,
        fear: 47, death: 45, grave: 43, black: 41, witch: 39,
        wolf: 37, moon: 35, midnight: 33, film: 31, story: 29,
        fiction: 27, novel: 25, romania: 22, scary: 19, hide: 16,
        cold: 13, silent: 10, alone: 7, dark: 83, lost: 5,
    },
    treasure: {
        riches: 97, haul: 96, stash: 95, plunder: 94, gold: 93,
        loot: 91, fortune: 89, bounty: 87, wealth: 85, jewel: 83,
        gem: 81, coin: 79, hoard: 77, chest: 75, pirate: 85,
        map: 80, buried: 73, hidden: 71, ship: 76, island: 74,
        sea: 72, boat: 70, captain: 68, skull: 66, rum: 64,
        sword: 62, ocean: 60, harbour: 58, compass: 56, voyage: 54,
        crew: 52, dig: 65, discover: 63, find: 61, cave: 59,
        vault: 57, safe: 55, key: 53, lock: 51, secret: 49,
        diamond: 67, silver: 65, crown: 63, ruby: 47, ring: 45,
        adventure: 50, quest: 48, explore: 46, mystery: 44, legend: 42,
        rich: 40, valuable: 38, reward: 36, prize: 34, rare: 32,
        water: 30, ancient: 28, lost: 25, history: 22, museum: 18,
        old: 15, deep: 12, far: 9, dark: 7, land: 5,
    },
    mountain: {
        peak: 97, summit: 95, cliff: 93, ridge: 91, hill: 89,
        slope: 87, valley: 85, climb: 83, top: 81, high: 79,
        steep: 77, rocky: 75, trail: 73, path: 71, hike: 69,
        snow: 67, glacier: 65, view: 63, nature: 61, landscape: 59,
        everest: 57, alps: 55, fresh: 53, air: 51, cold: 49,
        cloud: 47, eagle: 45, rock: 43, stone: 41, earth: 39,
        ground: 37, height: 35, sky: 33, forest: 31, tree: 29,
        wild: 27, remote: 25, silence: 22, far: 19, danger: 16,
        camp: 13, river: 10, deep: 7, flat: 5,
    },
    library: {
        book: 97, shelf: 95, read: 93, author: 91, novel: 89,
        story: 87, page: 85, chapter: 83, knowledge: 81, study: 79,
        quiet: 77, silence: 75, literature: 73, fiction: 71, learning: 69,
        education: 67, research: 65, history: 63, wisdom: 61, school: 59,
        university: 57, desk: 55, lamp: 53, word: 51, writing: 49,
        reader: 47, writer: 45, poem: 43, magazine: 41, newspaper: 39,
        catalogue: 37, reference: 35, archive: 33, index: 31, section: 29,
        room: 27, building: 25, visit: 22, borrow: 19, free: 17,
        public: 14, card: 11, old: 9, paper: 7, big: 5,
    },
    concert: {
        gig: 97, show: 95, stage: 93, crowd: 91, audience: 89,
        band: 87, singer: 85, musician: 83, ticket: 81, venue: 79,
        stadium: 77, arena: 75, tour: 73, encore: 71, festival: 69,
        live: 67, music: 65, song: 63, dance: 61, fan: 59,
        sound: 57, speaker: 55, light: 53, atmosphere: 51, cheer: 49,
        scream: 47, sing: 45, clap: 43, energy: 41, backstage: 39,
        support: 37, headline: 35, album: 33, artist: 31, night: 29,
        event: 27, queue: 25, fun: 22, loud: 19, busy: 17,
        outdoor: 14, seat: 11, indoor: 9, wait: 7, cold: 5,
    },
    shadow: {
        silhouette: 97, shade: 95, dark: 93, darkness: 91, dim: 89,
        outline: 87, figure: 85, gloom: 83, dusk: 81, night: 79,
        twilight: 77, sunset: 75, evening: 73, hidden: 71, ghost: 69,
        mystery: 67, fear: 65, secret: 63, unknown: 61, eclipse: 59,
        cloud: 57, light: 55, sun: 53, wall: 51, ground: 49,
        cast: 47, block: 45, shape: 43, phantom: 41, invisible: 39,
        grey: 37, cold: 35, quiet: 33, still: 31, behind: 29,
        corner: 27, forest: 25, black: 22, deep: 19, alone: 16,
        lost: 13, silent: 10, soft: 7, small: 5,
    },
    space: {
        universe: 97, galaxy: 95, star: 93, planet: 91, orbit: 89,
        moon: 87, rocket: 85, astronaut: 83, asteroid: 81, comet: 79,
        satellite: 77, telescope: 75, gravity: 73, alien: 71, dark: 69,
        vast: 67, cold: 65, empty: 63, mars: 61, jupiter: 59,
        saturn: 57, earth: 55, sun: 53, explore: 51, mission: 49,
        launch: 47, station: 45, shuttle: 43, infinity: 41, void: 39,
        black: 37, distant: 35, far: 33, science: 31, future: 29,
        dream: 27, wonder: 25, unknown: 22, sky: 19, cloud: 16,
        high: 13, air: 10, float: 7, deep: 5,
    },
    birthday: {
        party: 97, cake: 95, celebration: 93, gift: 91, present: 89,
        candle: 87, balloon: 85, surprise: 83, wish: 81, happy: 79,
        sing: 77, friends: 75, family: 73, fun: 71, joy: 69,
        memory: 67, age: 65, childhood: 63, sweet: 61, food: 59,
        drink: 57, game: 55, laugh: 53, love: 51, decoration: 49,
        invitation: 47, guest: 45, festive: 43, colour: 41, icing: 39,
        clown: 37, hat: 35, photo: 33, year: 31, special: 29,
        plan: 27, gather: 25, card: 22, wrap: 19, shop: 17,
        table: 14, chair: 11, date: 9, time: 7, day: 5,
    },
    garden: {
        plant: 97, flower: 95, lawn: 93, soil: 91, bush: 89,
        tree: 87, grass: 85, hedge: 83, grow: 81, water: 79,
        dig: 77, weed: 75, seed: 73, leaf: 71, petal: 69,
        blossom: 67, vegetable: 65, herb: 63, bee: 61, butterfly: 59,
        bird: 57, worm: 55, nature: 53, outdoor: 51, fresh: 49,
        green: 47, peaceful: 45, quiet: 43, spring: 41, summer: 39,
        season: 37, sun: 35, rain: 33, spade: 31, fence: 29,
        path: 27, pond: 25, home: 22, house: 19, back: 17,
        gate: 14, wall: 11, small: 9, open: 7, warm: 5,
    },
    pizza: {
        cheese: 97, dough: 95, crust: 93, topping: 91, tomato: 89,
        slice: 87, mozzarella: 85, pepperoni: 83, sauce: 81, oven: 79,
        bake: 77, italian: 75, delivery: 73, takeaway: 71, restaurant: 69,
        pasta: 67, garlic: 65, bread: 63, olive: 61, basil: 59,
        herb: 57, calzone: 55, food: 53, eat: 51, meal: 49,
        hungry: 47, share: 45, greasy: 43, hot: 41, round: 39,
        friday: 37, night: 35, friend: 33, box: 31, order: 29,
        phone: 27, wait: 25, table: 22, fork: 19, salt: 17,
        pepper: 14, tasty: 11, full: 9, warm: 7, plate: 5,
    },
    forest: {
        woodland: 97, wood: 95, tree: 93, grove: 91, canopy: 89,
        leaf: 87, branch: 85, trunk: 83, bark: 81, root: 79,
        deer: 77, fox: 75, bear: 73, wolf: 71, owl: 69,
        mushroom: 67, fern: 65, moss: 63, pine: 61, oak: 59,
        nature: 57, wild: 55, green: 53, fresh: 51, quiet: 49,
        dark: 47, shade: 45, damp: 43, path: 41, trail: 39,
        hike: 37, camp: 35, cabin: 33, log: 31, fire: 29,
        jungle: 27, park: 25, river: 22, stream: 20, bird: 18,
        cold: 15, air: 12, still: 9, deep: 7, alone: 5,
    },
    school: {
        classroom: 97, teacher: 95, student: 93, lesson: 91, homework: 89,
        exam: 87, grade: 85, learn: 83, study: 81, desk: 79,
        pencil: 77, book: 75, subject: 73, maths: 71, science: 69,
        english: 67, history: 65, lunch: 63, break: 61, playground: 59,
        uniform: 57, friend: 55, detention: 53, report: 51, rule: 49,
        pupil: 47, class: 45, board: 43, childhood: 41, memory: 39,
        young: 37, group: 35, test: 33, pass: 31, fail: 29,
        college: 27, university: 25, pen: 22, paper: 19, bag: 17,
        morning: 14, bus: 11, queue: 9, door: 7, bell: 5,
    },
    hospital: {
        doctor: 97, nurse: 95, patient: 93, ward: 91, surgery: 89,
        medicine: 87, treatment: 85, emergency: 83, ambulance: 81, clinic: 79,
        blood: 77, injection: 75, bandage: 73, bed: 71, operation: 69,
        prescription: 67, pharmacy: 65, health: 63, illness: 61, pain: 59,
        accident: 57, urgent: 55, recovery: 53, scan: 51, surgeon: 49,
        care: 47, heal: 45, staff: 43, uniform: 41, equipment: 39,
        machine: 37, monitor: 35, clean: 33, visitor: 31, wait: 29,
        worried: 27, quiet: 25, serious: 22, life: 19, help: 17,
        building: 14, large: 11, white: 9, busy: 7, cold: 5,
    },
};

// ============================================
// CLUES — 5 per word, clue 1 = vague, clue 5 = almost there
// ============================================
const CLUES = {
    ocean: [
        "It covers more than 70% of the Earth's surface.",
        "It's made of saltwater and is incredibly deep.",
        "Waves and tides move through it constantly.",
        "Sharks, whales and dolphins all live here.",
        "Think of the Pacific, Atlantic or Indian...",
    ],
    fire: [
        "Ancient humans learned how to make this.",
        "It produces both heat and light.",
        "It needs fuel and oxygen to survive.",
        "Smoke, ash and embers are part of it.",
        "Flames are the most visible part of this.",
    ],
    castle: [
        "You'd read about this in a history book.",
        "It's a large, fortified structure built for protection.",
        "Kings and queens once lived inside.",
        "It often has towers, a moat and a drawbridge.",
        "Medieval knights defended this type of building.",
    ],
    jungle: [
        "It's a type of natural environment found near the equator.",
        "It's extremely hot, humid and dense.",
        "You'd need a machete to cut through it.",
        "Monkeys, jaguars and exotic birds live here.",
        "The Amazon rainforest is the most famous example.",
    ],
    gold: [
        "It's something people have valued for thousands of years.",
        "It's a natural substance found in the earth.",
        "It's associated with wealth, luxury and royalty.",
        "Olympic champions receive a medal of this colour.",
        "A shiny yellow precious metal used in jewellery.",
    ],
    storm: [
        "It's a type of weather event.",
        "It can be dangerous and destructive.",
        "You'd want to stay indoors when this hits.",
        "Lightning and thunder often come with it.",
        "Hurricanes and tornadoes are extreme versions of this.",
    ],
    dream: [
        "It happens without you trying.",
        "It only involves your mind, not your body.",
        "It usually happens while you're unconscious.",
        "You often forget it as soon as you wake up.",
        "Your brain creates images and stories while you sleep.",
    ],
    mirror: [
        "You'd find this in most homes.",
        "It's flat, smooth and shiny.",
        "You use it to check your appearance.",
        "It shows you exactly what's in front of it.",
        "You see your own face reflected back at you.",
    ],
    thunder: [
        "It's a natural phenomenon linked to weather.",
        "It always comes alongside a bright flash in the sky.",
        "It makes a very loud, deep rumbling sound.",
        "It's caused by the rapid expansion of hot air.",
        "The loud boom you hear during a lightning storm.",
    ],
    diamond: [
        "It's something rare and precious.",
        "It's the hardest natural substance known to exist.",
        "It's often given as a romantic gift.",
        "It's a type of gemstone that sparkles in light.",
        "Engagement rings often feature one of these stones.",
    ],
    moon: [
        "You can see it from Earth without a telescope.",
        "It glows in the night sky.",
        "It influences the ocean's tides.",
        "Astronauts have walked on its surface.",
        "Earth's natural satellite that orbits our planet.",
    ],
    coffee: [
        "It's a very popular morning ritual around the world.",
        "It's a hot drink made from roasted beans.",
        "It contains caffeine, which gives you energy.",
        "Baristas craft this using an espresso machine.",
        "Lattes, cappuccinos and americanos are all types of this.",
    ],
    music: [
        "It's one of the oldest forms of human expression.",
        "It involves organised sound.",
        "Almost everyone enjoys some version of it.",
        "It has rhythm, melody and harmony.",
        "Bands, orchestras and solo artists all create this.",
    ],
    football: [
        "It's one of the most watched things on Earth.",
        "It involves two teams competing against each other.",
        "You score by getting the ball into the goal.",
        "Players can't touch the ball with their hands.",
        "The World Cup is the biggest event in this sport.",
    ],
    winter: [
        "It's one of the four seasons.",
        "Days are short and nights are long.",
        "You'd wear a coat, scarf and gloves.",
        "Snow and frost are common during this time.",
        "The coldest season of the year, after autumn.",
    ],
    summer: [
        "It's one of the four seasons.",
        "Schools close and many people go on holiday.",
        "You'd put on sunscreen and sunglasses.",
        "Long, warm days and lots of sunshine.",
        "The hottest season of the year, after spring.",
    ],
    robot: [
        "It's something invented by humans.",
        "It's powered by electricity and runs on code.",
        "It can be programmed to perform tasks automatically.",
        "You'd find them in factories and sci-fi films.",
        "A mechanical machine designed to act like a human.",
    ],
    vampire: [
        "It's a fictional creature from folklore.",
        "It only comes out at night.",
        "Garlic, sunlight and a wooden stake are its weaknesses.",
        "It has pale skin, a cape and sharp fangs.",
        "A creature of the night that survives by drinking blood.",
    ],
    treasure: [
        "People go on adventures to find it.",
        "It's associated with pirates and hidden maps.",
        "X marks the spot where it's buried.",
        "Gold, jewels and coins are often part of it.",
        "Valuable items hidden away and waiting to be discovered.",
    ],
    mountain: [
        "It's a large geographical feature.",
        "It took millions of years to form.",
        "Climbers try to reach the very top.",
        "The highest point is called the summit or peak.",
        "Everest is the tallest one of these in the world.",
    ],
    library: [
        "It's a public building you can visit for free.",
        "You go there to learn, study or relax.",
        "You can borrow things and bring them back later.",
        "It's very quiet inside — that's part of the rules.",
        "Thousands of books line the shelves in here.",
    ],
    concert: [
        "It's a type of event you buy a ticket for.",
        "People gather in large numbers to experience it.",
        "It takes place on a stage in front of an audience.",
        "The atmosphere is electric — crowds cheer and sing along.",
        "A live performance by a band or musical artist.",
    ],
    shadow: [
        "You can see it but you can't touch it.",
        "It's always dark, no matter where it appears.",
        "It appears when something blocks a source of light.",
        "On a sunny day you always have one following you.",
        "A dark shape cast on a surface when light is blocked.",
    ],
    space: [
        "It exists beyond our world.",
        "It's vast, cold and mostly empty.",
        "Astronauts and rockets travel into it.",
        "Stars, planets and galaxies fill it.",
        "The infinite universe beyond Earth's atmosphere.",
    ],
    birthday: [
        "It's a special occasion that everyone has.",
        "It comes around exactly once a year.",
        "Cake, candles and gifts are part of the tradition.",
        "Friends and family sing a famous song to you.",
        "The anniversary of the day you were born.",
    ],
    garden: [
        "You'd find this outside, often behind a house.",
        "Plants, flowers and grass grow here.",
        "You'd use a spade and a watering can here.",
        "Butterflies, bees and birds visit regularly.",
        "An outdoor space where you grow plants and flowers.",
    ],
    pizza: [
        "It's something you eat.",
        "It's extremely popular worldwide and very easy to order.",
        "It's often delivered straight to your door.",
        "It comes in a round shape with various toppings.",
        "Italian dish with a dough base, tomato sauce and cheese.",
    ],
    forest: [
        "It's a natural environment covering large areas of land.",
        "It's full of tall trees growing close together.",
        "Animals like deer, foxes and owls live here.",
        "It can feel dark and quiet deep inside.",
        "A large, dense area of woodland.",
    ],
    school: [
        "Most people have spent years of their life here.",
        "Children attend five days a week.",
        "You study subjects like maths, English and science.",
        "Teachers help students learn in classrooms.",
        "The place where children go to get an education.",
    ],
    hospital: [
        "It's a large building most people have visited.",
        "You hope you never need to go here in an emergency.",
        "Doctors and nurses work long shifts here.",
        "People go when they're sick, injured or having a baby.",
        "A medical facility where patients receive treatment and care.",
    ],
};

// ============================================
// DAILY WORD
// ============================================
const SAVE_KEY  = 'cluelock_' + getTodayString();
const todayWord = WORDS[getDailyIndex(WORDS)];

// ============================================
// STATE
// ============================================
function loadState() {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') || {
        guesses:      [],   // [{ word, rank }]
        cluesShown:   0,
        gameOver:     false,
        won:          false,
    };
}
function saveState(s) { localStorage.setItem(SAVE_KEY, JSON.stringify(s)); }

let state      = loadState();
let latestWord = null;

// ============================================
// SCORING — converts internal score to rank
// Rank 1 = exact match, up to ~20,000 = very far
// ============================================
function scoreToRank(score) {
    if (score >= 100) return 1;
    // Power 2.5 gives a gentler curve — score 60 ≈ rank 2000, score 40 ≈ rank 7000
    const t = (99 - score) / 98;
    return Math.round(2 + Math.pow(t, 2.5) * 19998);
}

function getRank(word) {
    const w = word.toLowerCase().trim();
    if (w === todayWord.toLowerCase()) return 1;
    const data = SIMILARITY[todayWord.toLowerCase()] || {};
    if (data[w] !== undefined) return scoreToRank(data[w]);
    // Unknown word — cold rank
    return Math.floor(Math.random() * 5000) + 15000;
}

function getRankColor(rank) {
    if (rank === 1)     return '#55b725';
    if (rank <= 50)     return '#55b725';
    if (rank <= 300)    return '#8dc926';
    if (rank <= 1000)   return '#dac316';
    if (rank <= 4000)   return '#d47a20';
    if (rank <= 10000)  return '#c84020';
    return '#3a8dca';
}

function getRankLabel(rank) {
    if (rank === 1)     return 'Exact!';
    if (rank <= 50)     return 'Scorching';
    if (rank <= 300)    return 'Hot';
    if (rank <= 1000)   return 'Warm';
    if (rank <= 4000)   return 'Lukewarm';
    if (rank <= 10000)  return 'Cold';
    return 'Freezing';
}

function rankToBarWidth(rank) {
    if (rank === 1) return 100;
    // Logarithmic scale: rank 2 ≈ 98%, rank 20000 = 0%
    const pct = (1 - Math.log(rank) / Math.log(20001)) * 100;
    return Math.max(0, Math.min(100, pct));
}

// ============================================
// DERIVED FORM DETECTION
// Reject conjugations, plurals, adverbs etc.
// Players must type the base/root form.
// ============================================
const ING_WHITELIST = new Set([
    'king', 'ring', 'sing', 'thing', 'sting', 'bring', 'spring', 'string',
    'swing', 'wing', 'ping', 'fling', 'cling', 'sling', 'ding', 'ceiling',
    'evening', 'morning', 'nothing', 'something', 'wedding', 'pudding',
    'building', 'boring', 'caring', 'during', 'feeling', 'meaning',
    'opening', 'warning', 'young', 'long', 'song', 'strong', 'among',
    'wrong', 'along', 'belong', 'lightning', 'darling', 'sibling',
]);

const LY_WHITELIST = new Set([
    'fly', 'ally', 'belly', 'bully', 'early', 'family', 'holy', 'jelly',
    'lily', 'only', 'reply', 'supply', 'ugly', 'woolly', 'rally', 'tally',
    'daily', 'italy', 'oily',
]);

const ED_WHITELIST = new Set([
    'red', 'bed', 'led', 'fed', 'wed', 'shed', 'sped', 'bred', 'weed',
    'seed', 'speed', 'need', 'greed', 'freed', 'creed', 'breed', 'indeed',
    'treed', 'proceed', 'agreed', 'exceed',
]);

function isDerivedForm(word) {
    if (word.length > 4 && word.endsWith('ing') && !ING_WHITELIST.has(word)) return true;
    if (word.length > 3 && word.endsWith('ly')  && !LY_WHITELIST.has(word))  return true;
    if (word.length > 4 && word.endsWith('ed')  && !ED_WHITELIST.has(word))  return true;
    return false;
}

// ============================================
// DICTIONARY VALIDATION
// ============================================
const validWordCache  = new Set(); // confirmed real words
const invalidWordCache = new Set(); // confirmed not real

async function isRealWord(word) {
    if (validWordCache.has(word))  return true;
    if (invalidWordCache.has(word)) return false;
    try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (res.ok) {
            validWordCache.add(word);
            return true;
        } else {
            invalidWordCache.add(word);
            return false;
        }
    } catch {
        // If offline or API fails, let the word through so the game still works
        return true;
    }
}

// ============================================
// SUBMIT
// ============================================
let submitting = false;

async function submitGuess() {
    if (state.gameOver || submitting) return;
    const input = document.getElementById('guessInput');
    const raw = input.value.trim();
    if (!raw) return;
    if (!/^[a-zA-Z]+$/.test(raw)) {
        showMessage('Single words only please');
        return;
    }
    if (raw.length < 2) {
        showMessage('Word too short');
        return;
    }
    const word = raw.toLowerCase();
    if (state.guesses.find(g => g.word === word)) {
        showMessage('Already guessed!');
        input.value = '';
        return;
    }

    // Validate it's a real word
    submitting = true;
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    showMessage('Checking...');

    const real = await isRealWord(word);
    submitting = false;
    btn.disabled = false;

    if (!real) {
        showMessage('Not a real word!');
        return;
    }

    if (isDerivedForm(word)) {
        showMessage('Root words only — try the base form!');
        return;
    }

    showMessage('');
    const rank = getRank(word);
    state.guesses.push({ word, rank });
    latestWord = word;

    if (rank === 1) {
        state.gameOver = true;
        state.won      = true;
        markGamePlayed('cluelock');
    }

    input.value = '';
    saveState(state);
    render();

    setTimeout(() => {
        const rows = document.querySelectorAll('.cl-guess-row');
        if (rows.length) rows[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
}

document.getElementById('submitBtn').addEventListener('click', submitGuess);
document.getElementById('guessInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') submitGuess();
});

function showMessage(msg) {
    const el = document.getElementById('clMessage');
    el.textContent = msg;
    setTimeout(() => { if (el.textContent === msg) el.textContent = ''; }, 1800);
}

// ============================================
// CLUES
// ============================================
function revealClue() {
    const wordClues = CLUES[todayWord.toLowerCase()] || [];
    if (state.cluesShown >= wordClues.length) return;
    state.cluesShown++;
    saveState(state);
    renderClues();
}

function renderClues() {
    const wordClues = CLUES[todayWord.toLowerCase()] || [];
    const listEl    = document.getElementById('clueList');
    const btn       = document.getElementById('clueBtn');
    if (!listEl || !btn) return;

    listEl.innerHTML = '';
    for (let i = 0; i < state.cluesShown; i++) {
        const el = document.createElement('p');
        el.className = 'cl-clue-item';
        el.textContent = `Clue ${i + 1}: ${wordClues[i]}`;
        listEl.appendChild(el);
    }

    const allShown = wordClues.length > 0 && state.cluesShown >= wordClues.length;
    if (allShown || state.gameOver) {
        btn.style.display = 'none';
    } else {
        btn.style.display = '';
        btn.textContent = `💡 Reveal Clue ${state.cluesShown + 1}`;
    }
}

document.getElementById('clueBtn').addEventListener('click', revealClue);

// ============================================
// RENDER
// ============================================
function render() {
    renderClues();
    const n = state.guesses.length;
    document.getElementById('guessCountDisplay').textContent =
        n === 1 ? '1 guess' : `${n} guesses`;

    const bestEl = document.getElementById('bestScoreDisplay');
    if (n > 0 && !state.won) {
        const bestRank = state.guesses.reduce((min, g) => Math.min(min, g.rank), Infinity);
        bestEl.textContent = `Best: #${bestRank.toLocaleString()} — ${getRankLabel(bestRank)}`;
        bestEl.style.color = getRankColor(bestRank);
    } else {
        bestEl.textContent = '';
    }

    // Guesses list — sorted by rank ascending (best first)
    const sorted = [...state.guesses].sort((a, b) => a.rank - b.rank);
    const listEl = document.getElementById('clGuesses');
    listEl.innerHTML = '';

    sorted.forEach(g => {
        const row = document.createElement('div');
        row.className = 'cl-guess-row' + (g.word === latestWord ? ' cl-new' : '');

        const color    = getRankColor(g.rank);
        const barWidth = rankToBarWidth(g.rank);
        const label    = getRankLabel(g.rank);

        row.innerHTML = `
            <div class="cl-word">${g.word}</div>
            <div class="cl-bar-wrap">
                <div class="cl-bar-fill" style="width:${barWidth}%;background:${color}"></div>
            </div>
            <div class="cl-score" style="color:${color}">#${g.rank.toLocaleString()}</div>
            <div class="cl-label">${label}</div>
        `;
        listEl.appendChild(row);
    });

    if (state.gameOver) {
        document.getElementById('inputSection').style.display = 'none';
        document.getElementById('clMessage').textContent = '';
        const box = document.getElementById('resultBox');
        box.style.display = 'block';
        box.className = 'result-box win';
        box.innerHTML = `
            <h3>You found it! 🎉</h3>
            <p>The mystery word was:</p>
            <p class="answer-reveal">${todayWord.toUpperCase()}</p>
            <p style="color:var(--muted);font-size:14px;">Found in <strong style="color:var(--text)">${state.guesses.length}</strong> guess${state.guesses.length !== 1 ? 'es' : ''}</p>
            <a href="../../index.html" class="back-home-btn">Back to Games</a>
        `;
    }
}

render();
