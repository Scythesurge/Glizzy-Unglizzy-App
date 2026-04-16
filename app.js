const displayImage = document.getElementById('displayImage');
const glizzyButton = document.getElementById('glizzyButton');
const unglizzyButton = document.getElementById('unglizzyButton');
const glizzyAudio = document.getElementById('glizzyAudio');
const caption = document.getElementById('caption');

let manifest = { glizzyAudio: [], unglizzyAudio: [], glizzies: [], unglizzies: [] };
let lastGlizzyImage = null;
let lastUnglizzyImage = null;
let lastGlizzyAudio = null;
let lastUnglizzyAudio = null;

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
    lastGlizzyImage = manifest.glizzies[0];
    displayImage.src = lastGlizzyImage;
  }
}

async function playRandomAudio(kind) {
  const pool = kind === 'glizzy' ? manifest.glizzyAudio : manifest.unglizzyAudio;
  const last = kind === 'glizzy' ? lastGlizzyAudio : lastUnglizzyAudio;
  const sound = randomItemNoRepeat(pool, last);

  if (!sound) {
    caption.textContent = `no ${kind} audio found. feed the machine properly.`;
    return;
  }

  if (kind === 'glizzy') lastGlizzyAudio = sound;
  else lastUnglizzyAudio = sound;

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
  const last = kind === 'glizzy' ? lastGlizzyImage : lastUnglizzyImage;
  const image = randomItemNoRepeat(pool, last);

  if (!image) {
    caption.textContent = `no ${kind} images found. your manifest is doing crimes.`;
    return;
  }

  if (kind === 'glizzy') lastGlizzyImage = image;
  else lastUnglizzyImage = image;

  displayImage.src = image + `?t=${Date.now()}`;
  caption.textContent = randomItem(captions[kind]);
  await playRandomAudio(kind);
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
