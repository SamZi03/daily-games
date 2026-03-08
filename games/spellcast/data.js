// ============================================
// SPELLLOCK — DATA FILE
// Add new word sets here. game.js handles all logic.
//
// Difficulty per round:
//   [0] R1 very easy  — 3-5 letters, everyday word
//   [1] R2 easy       — 5-6 letters, common word
//   [2] R3 medium     — tricky spelling, unusual pattern
//   [3] R4 hard       — long, commonly misspelled words
//   [4] R5 very hard  — obscure or rarely seen words, hard to spell
//
// Append new sets at the bottom of WORD_SETS.
// ============================================

const WORD_SETS = [
    [
        {word:'bird', definition:'A feathered animal that usually flies.', sentence:'A bird landed on the branch outside the window.'},
        {word:'cloud', definition:'A visible mass of water droplets floating in the sky.', sentence:'A large cloud blocked the sun on a warm afternoon.'},
        {word:'occurrence', definition:'Something that happens, especially something unusual.', sentence:'Heavy snowfall in July is a rare occurrence in Britain.'},
        {word:'miscellaneous', definition:'Consisting of many different types of things mixed together.', sentence:'The old box was full of miscellaneous items collected over many years.'},
        {word:'onomatopoeia', definition:'The use of words that imitate the sound they describe.', sentence:'Words like buzz and splash are classic examples of onomatopoeia.'},
    ],
    [
        {word:'fish', definition:'A cold-blooded animal that lives in water and has fins.', sentence:'She caught a fish from the river on a sunny day.'},
        {word:'storm', definition:'A period of bad weather with strong winds and heavy rain.', sentence:'The storm knocked over several trees in the park.'},
        {word:'pharmacy', definition:'A shop where medicines and health products are sold.', sentence:'She picked up her prescription from the pharmacy.'},
        {word:'accommodation', definition:'A place where someone lives or stays, especially for a short time.', sentence:'The school arranged accommodation for students visiting from abroad.'},
        {word:'connoisseur', definition:'A person with great knowledge and appreciation of something.', sentence:'The connoisseur could identify the wine region just by its taste.'},
    ],
    [
        {word:'jump', definition:'To push yourself off the ground and into the air.', sentence:'The children jump on the trampoline in the garden.'},
        {word:'honey', definition:'A sweet, sticky food made by bees.', sentence:'She spread honey on her toast every morning.'},
        {word:'orchestra', definition:'A large group of musicians who play different instruments together.', sentence:'The orchestra performed to a full audience.'},
        {word:'conscientious', definition:'Trying very hard to do something correctly and thoroughly.', sentence:'She was a conscientious student who always handed her work in on time.'},
        {word:'lieutenant', definition:'An officer of middle rank in the army, navy, or police.', sentence:'The lieutenant led his unit through the thick forest at dawn.'},
    ],
    [
        {word:'snow', definition:'Frozen water that falls from the sky in soft white flakes.', sentence:'Snow covered the ground overnight in winter.'},
        {word:'light', definition:'The energy that allows us to see things around us.', sentence:'The light in the room made it easier to read.'},
        {word:'necessary', definition:'Something that must be done or is very important.', sentence:'It is necessary to drink water to stay healthy.'},
        {word:'exaggerate', definition:'To make something seem bigger or worse than it really is.', sentence:'He tended to exaggerate his stories to make them more interesting.'},
        {word:'rendezvous', definition:'An agreed meeting between two or more people at a set place.', sentence:'They had arranged a rendezvous at the old bridge by the river.'},
    ],
    [
        {word:'road', definition:'A long hard surface built for vehicles and people to travel on.', sentence:'The road was quiet early on Sunday morning.'},
        {word:'apple', definition:'A round fruit with red, green, or yellow skin.', sentence:'She packed an apple in her lunch bag.'},
        {word:'nocturnal', definition:'Active at night rather than during the day.', sentence:'Owls are nocturnal creatures that hunt in darkness.'},
        {word:'mischievous', definition:'Enjoying causing trouble or mischief in a playful way.', sentence:'The mischievous puppy had chewed through the garden hose again.'},
        {word:'paraphernalia', definition:'A collection of equipment and accessories for a particular activity.', sentence:'The fishing paraphernalia filled the entire back seat of the car.'},
    ],
    [
        {word:'sun', definition:'The star at the centre of our solar system that gives us light.', sentence:'The sun shone brightly on a warm summer afternoon.'},
        {word:'bread', definition:'A food made from flour, water, and yeast, baked in an oven.', sentence:'She baked a fresh loaf of bread in the morning.'},
        {word:'rhythm', definition:'A strong regular pattern of sound or movement.', sentence:'The drummer kept a perfect rhythm throughout the song.'},
        {word:'surveillance', definition:'Careful watching of a person or place, especially by the police.', sentence:'The car park was monitored by surveillance cameras around the clock.'},
        {word:'surreptitious', definition:'Done secretly so that others will not notice.', sentence:'She took a surreptitious glance at her phone during the meeting.'},
    ],
    [
        {word:'rain', definition:'Water that falls from clouds in small drops.', sentence:'The rain fell heavily throughout the afternoon.'},
        {word:'river', definition:'A large natural stream of water flowing towards the sea.', sentence:'They kayaked along the river on a sunny day.'},
        {word:'labyrinth', definition:'A complicated network of paths that is very difficult to navigate.', sentence:'They got completely lost in the ancient labyrinth.'},
        {word:'questionnaire', definition:'A list of questions given to people to collect information.', sentence:'Each student was asked to fill in a questionnaire about their hobbies.'},
        {word:'rhododendron', definition:'A large shrub with evergreen leaves and clusters of bright flowers.', sentence:'The pink rhododendron stood out against the grey stone wall.'},
    ],
    [
        {word:'book', definition:'A set of printed pages bound together with a cover.', sentence:'She read a book by the window every evening.'},
        {word:'music', definition:'Sounds arranged in patterns to create something pleasant to hear.', sentence:'The music filled the room during the party.'},
        {word:'jeopardy', definition:'A situation of serious danger or risk of loss.', sentence:'The bad weather put their plans in jeopardy.'},
        {word:'entrepreneur', definition:'A person who starts their own business and takes financial risks.', sentence:'The young entrepreneur launched her first app at the age of sixteen.'},
        {word:'flabbergasted', definition:'Extremely surprised and shocked by something.', sentence:'He was completely flabbergasted when his name was called out as the winner.'},
    ],
    [
        {word:'cat', definition:'A small furry pet animal that purrs and meows.', sentence:'The cat curled up on the sofa by the fire.'},
        {word:'beach', definition:'An area of sand or pebbles next to the sea.', sentence:'The children played all day on the beach.'},
        {word:'conscience', definition:'The inner sense of what is right or wrong in your actions.', sentence:'His conscience told him to return the wallet he had found.'},
        {word:'pronunciation', definition:'The way in which a word is spoken out loud.', sentence:'The teacher gently corrected her pronunciation during the reading lesson.'},
        {word:'kaleidoscope', definition:'A tube with mirrors and coloured glass that creates shifting patterns.', sentence:'Looking through the kaleidoscope, she saw beautiful swirling shapes.'},
    ],
    [
        {word:'boat', definition:'A small vessel used for travelling on water.', sentence:'They rowed the boat across the calm lake.'},
        {word:'ocean', definition:'A vast area of saltwater that covers most of the Earth.', sentence:'The ship sailed across the ocean for three weeks.'},
        {word:'silhouette', definition:'A dark shape or outline seen against a lighter background.', sentence:'The silhouette of the tree stood out against the sunset.'},
        {word:'occasionally', definition:'Sometimes, but not very often.', sentence:'She occasionally stopped at the old café on her way home from work.'},
        {word:'chrysanthemum', definition:'A garden flower with many layered petals, common in autumn.', sentence:'The bright chrysanthemum in the vase filled the room with colour.'},
    ],
];
