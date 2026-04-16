const displayImage = document.getElementById('displayImage');
const glizzyButton = document.getElementById('glizzyButton');
const unglizzyButton = document.getElementById('unglizzyButton');
const glizzyAudio = document.getElementById('glizzyAudio');
const caption = document.getElementById('caption');

let manifest = { audio: [], glizzies: [], unglizzies: [] };
let lastGlizzy = null;
let lastUnglizzy = null;
let lastAudio = null;

const captions = {
  glizzy: [
    'glizzy deployed.',
    'portable sausage event triggered.',
    'the glizzy has been randomized.',
    'snack fate has chosen.'
  ],
  unglizzy: [
    'unglizzy selected.',
    'false dog detected.',
    'the anti-dog has appeared.',
    'the sausage council says no.'
  ]
};

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function randomItemNoRepeat(list, lastValue) {
  if (!list || !list.length) return null;
  if (list.length === 1) return list[0];
  let value;
  do {
    value = randomItem(list);
  } while (value === lastValue);
  return value;
}

async function loadManifest() {
  const resp = await fetch('./assets/manifest.json');
  manifest = await resp.json();
  if (manifest.glizzies?.length) {
    lastGlizzy = manifest.glizzies[0];
    displayImage.src = lastGlizzy;
  }
}

async function playRandomAudio() {
  const sound = randomItemNoRepeat(manifest.audio, lastAudio);
  if (!sound) return;
  lastAudio = sound;
  try {
    glizzyAudio.pause();
    glizzyAudio.currentTime = 0;
    glizzyAudio.src = sound;
    await glizzyAudio.play();
  } catch {
    caption.textContent = 'audio blocked. tap again, coward browser.';
  }
}

async function handlePool(kind) {
  const pool = kind === 'glizzy' ? manifest.glizzies : manifest.unglizzies;
  const last = kind === 'glizzy' ? lastGlizzy : lastUnglizzy;
  const image = randomItemNoRepeat(pool, last);
  if (!image) {
    caption.textContent = `no ${kind} assets found. you forgot to feed the machine.`;
    return;
  }
  if (kind === 'glizzy') lastGlizzy = image;
  else lastUnglizzy = image;
  displayImage.src = image + `?t=${Date.now()}`;
  caption.textContent = randomItem(captions[kind]);
  await playRandomAudio();
}

glizzyButton.addEventListener('click', () => handlePool('glizzy'));
unglizzyButton.addEventListener('click', () => handlePool('unglizzy'));

loadManifest().catch(() => {
  caption.textContent = 'manifest failed to load. glizzy infrastructure compromised.';
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
