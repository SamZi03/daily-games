// ============================================
// SPELLLOCK — DATA FILE
// Add new word sets here. game.js handles all logic.
//
// Difficulty per round:
//   [0] R1 very easy  — 3-5 letters, everyday word
//   [1] R2 easy       — 5-6 letters, common word
//   [2] R3 medium     — commonly misspelled everyday word
//   [3] R4 hard       — tricky spelling, unusual pattern
//   [4] R5 very hard  — 10-13 letters, regularly misspelled
//
// Append new sets at the bottom of WORD_SETS.
// ============================================

const WORD_SETS = [
    [
        {word:'bird', definition:'A feathered animal that usually flies.', sentence:'A bird landed on the branch outside the window.'},
        {word:'cloud', definition:'A visible mass of water droplets floating in the sky.', sentence:'A large cloud blocked the sun on a warm afternoon.'},
        {word:'separate', definition:'To move or keep things apart from each other.', sentence:'She had to separate the two piles of washing before putting them in.'},
        {word:'occurrence', definition:'Something that happens, especially something unusual.', sentence:'Heavy snowfall in July is a rare occurrence in Britain.'},
        {word:'miscellaneous', definition:'Consisting of many different types of things mixed together.', sentence:'The old box was full of miscellaneous items collected over many years.'},
    ],
    [
        {word:'fish', definition:'A cold-blooded animal that lives in water and has fins.', sentence:'She caught a fish from the river on a sunny day.'},
        {word:'storm', definition:'A period of bad weather with strong winds and heavy rain.', sentence:'The storm knocked over several trees in the park.'},
        {word:'recommend', definition:'To suggest that something is good or the right choice.', sentence:'The teacher was happy to recommend a book for the holidays.'},
        {word:'pharmacy', definition:'A shop where medicines and health products are sold.', sentence:'She picked up her prescription from the pharmacy.'},
        {word:'accommodation', definition:'A place where someone lives or stays, especially for a short time.', sentence:'The school arranged accommodation for students visiting from abroad.'},
    ],
    [
        {word:'jump', definition:'To push yourself off the ground and into the air.', sentence:'The children jump on the trampoline in the garden.'},
        {word:'honey', definition:'A sweet, sticky food made by bees.', sentence:'She spread honey on her toast every morning.'},
        {word:'wednesday', definition:'The day of the week that comes between Tuesday and Thursday.', sentence:'The whole class looked forward to football on Wednesday afternoon.'},
        {word:'orchestra', definition:'A large group of musicians who play different instruments together.', sentence:'The orchestra performed to a full audience.'},
        {word:'conscientious', definition:'Trying very hard to do something correctly and thoroughly.', sentence:'She was a conscientious student who always handed her work in on time.'},
    ],
    [
        {word:'snow', definition:'Frozen water that falls from the sky in soft white flakes.', sentence:'Snow covered the ground overnight in winter.'},
        {word:'light', definition:'The energy that allows us to see things around us.', sentence:'The light in the room made it easier to read.'},
        {word:'definitely', definition:'Without any doubt; used to say something is certain.', sentence:'She was definitely the best singer who auditioned that day.'},
        {word:'necessary', definition:'Something that must be done or is very important.', sentence:'It is necessary to drink water to stay healthy.'},
        {word:'exaggerate', definition:'To make something seem bigger or worse than it really is.', sentence:'He tended to exaggerate his stories to make them more interesting.'},
    ],
    [
        {word:'road', definition:'A long hard surface built for vehicles and people to travel on.', sentence:'The road was quiet early on Sunday morning.'},
        {word:'apple', definition:'A round fruit with red, green, or yellow skin.', sentence:'She packed an apple in her lunch bag.'},
        {word:'embarrass', definition:'To make someone feel awkward or ashamed in front of others.', sentence:'He did not want to embarrass himself at the school concert.'},
        {word:'nocturnal', definition:'Active at night rather than during the day.', sentence:'Owls are nocturnal creatures that hunt in darkness.'},
        {word:'mischievous', definition:'Enjoying causing trouble or mischief in a playful way.', sentence:'The mischievous puppy had chewed through the garden hose again.'},
    ],
    [
        {word:'sun', definition:'The star at the centre of our solar system that gives us light.', sentence:'The sun shone brightly on a warm summer afternoon.'},
        {word:'bread', definition:'A food made from flour, water, and yeast, baked in an oven.', sentence:'She baked a fresh loaf of bread in the morning.'},
        {word:'colleague', definition:'Someone you work with, especially in a professional job.', sentence:'She asked a colleague to cover her shift at the office.'},
        {word:'rhythm', definition:'A strong regular pattern of sound or movement.', sentence:'The drummer kept a perfect rhythm throughout the song.'},
        {word:'surveillance', definition:'Careful watching of a person or place, especially by the police.', sentence:'The car park was monitored by surveillance cameras around the clock.'},
    ],
    [
        {word:'rain', definition:'Water that falls from clouds in small drops.', sentence:'The rain fell heavily throughout the afternoon.'},
        {word:'river', definition:'A large natural stream of water flowing towards the sea.', sentence:'They kayaked along the river on a sunny day.'},
        {word:'government', definition:'The group of people who officially run and control a country.', sentence:'The government announced a new plan to improve local schools.'},
        {word:'labyrinth', definition:'A complicated network of paths that is very difficult to navigate.', sentence:'They got completely lost in the ancient labyrinth.'},
        {word:'questionnaire', definition:'A list of questions given to people to collect information.', sentence:'Each student was asked to fill in a questionnaire about their hobbies.'},
    ],
    [
        {word:'book', definition:'A set of printed pages bound together with a cover.', sentence:'She read a book by the window every evening.'},
        {word:'music', definition:'Sounds arranged in patterns to create something pleasant to hear.', sentence:'The music filled the room during the party.'},
        {word:'mosquito', definition:'A small flying insect that bites and can carry disease.', sentence:'A mosquito bite left a red mark on her arm.'},
        {word:'jeopardy', definition:'A situation of serious danger or risk of loss.', sentence:'The bad weather put their plans in jeopardy.'},
        {word:'entrepreneur', definition:'A person who starts their own business and takes financial risks.', sentence:'The young entrepreneur launched her first app at the age of sixteen.'},
    ],
    [
        {word:'cat', definition:'A small furry pet animal that purrs and meows.', sentence:'The cat curled up on the sofa by the fire.'},
        {word:'beach', definition:'An area of sand or pebbles next to the sea.', sentence:'The children played all day on the beach.'},
        {word:'beginning', definition:'The point at which something starts.', sentence:'The beginning of the film was slow but it got much better.'},
        {word:'conscience', definition:'The inner sense of what is right or wrong in your actions.', sentence:'His conscience told him to return the wallet he had found.'},
        {word:'pronunciation', definition:'The way in which a word is spoken out loud.', sentence:'The teacher gently corrected her pronunciation during the reading lesson.'},
    ],
    [
        {word:'boat', definition:'A small vessel used for travelling on water.', sentence:'They rowed the boat across the calm lake.'},
        {word:'ocean', definition:'A vast area of saltwater that covers most of the Earth.', sentence:'The ship sailed across the ocean for three weeks.'},
        {word:'boulevard', definition:'A wide road in a town or city, often with trees on either side.', sentence:'They walked slowly down the tree-lined boulevard.'},
        {word:'silhouette', definition:'A dark shape or outline seen against a lighter background.', sentence:'The silhouette of the tree stood out against the sunset.'},
        {word:'occasionally', definition:'Sometimes, but not very often.', sentence:'She occasionally stopped at the old café on her way home from work.'},
    ],
];
