#!/usr/bin/env node
/*
 * One-off image generator for TEAMTOM, using Azure OpenAI gpt-image-2.
 *
 *   node scripts/generate_images.js              # generate all missing targets
 *   node scripts/generate_images.js --force      # regenerate even if file exists
 *   node scripts/generate_images.js --only intro_hard    # one target by key
 *   node scripts/generate_images.js --list       # print targets and exit
 *   node scripts/generate_images.js --probe      # generate ONE cheap probe image to verify the API contract
 *
 * Reads AZURE_IMAGE_* from process.env or a local .env / .env.local in the
 * project root. Writes PNGs straight into public/images/. The generated images
 * are NOT committed (they are large) — they ride along in the deploy zip.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// ── minimal .env loader (no dependency) ──────────────────────────────────────
function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const txt = fs.readFileSync(file, 'utf8');
  for (const rawLine of txt.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnvFile(path.join(ROOT, '.env.local'));
loadEnvFile(path.join(ROOT, '.env'));

const ENDPOINT   = (process.env.AZURE_IMAGE_ENDPOINT || '').replace(/\/+$/, '');
const API_KEY    = process.env.AZURE_IMAGE_API_KEY || '';
const DEPLOYMENT = process.env.AZURE_IMAGE_DEPLOYMENT || 'gpt-image-2';
const API_VER    = process.env.AZURE_IMAGE_API_VERSION || '2024-02-01';

if (!ENDPOINT || !API_KEY) {
  console.error('Missing AZURE_IMAGE_ENDPOINT or AZURE_IMAGE_API_KEY (set them in .env.local).');
  process.exit(1);
}

const URL =
  `${ENDPOINT}/openai/deployments/${encodeURIComponent(DEPLOYMENT)}` +
  `/images/generations?api-version=${encodeURIComponent(API_VER)}`;

// ── targets ──────────────────────────────────────────────────────────────────
const SOLL = path.join(ROOT, 'public', 'images', 'sollicitatie');
const TRIV = path.join(ROOT, 'public', 'images', 'trivia');

const STYLE =
  ' Photorealistic, warm, friendly, bright soft natural lighting, inviting. ' +
  'Square composition. No on-screen text, no captions, no watermarks, no brand logos.';

// Framing instructions used on every portrait so the head is clearly visible.
const PORTRAIT_FRAME =
  ' COMPOSITION: medium close-up portrait, head-and-shoulders to mid-chest visible, ' +
  'subject CENTERED horizontally, FACE in the upper third of the frame, looking directly ' +
  'at the camera, eye-level perspective. Background softly blurred. The full head is ' +
  'completely visible inside the frame — DO NOT crop the top of the head or the chin. ' +
  'The subject fills most of the frame; the setting is only the backdrop.';

const TARGETS = [
  // ── Sanne difficulty hero images (head-and-shoulders portraits) ──
  {
    key: 'intro_easy', dir: SOLL, file: 'intro_easy.png',
    prompt: 'Medium close-up portrait of a friendly female supermarket store manager named Sanne, in ' +
      'her early thirties, with a warm reassuring smile, wearing a neat blue-and-white grocery uniform ' +
      'with a name badge. She stands near the entrance of a small, cozy village supermarket in the ' +
      'Netherlands on a sunny day; the calm tidy store with wooden shelves and fresh produce is softly ' +
      'blurred behind her. Relaxed, welcoming small-town atmosphere.' + PORTRAIT_FRAME + STYLE,
  },
  {
    key: 'intro_medium', dir: SOLL, file: 'intro_medium.png',
    prompt: 'Medium close-up portrait of a confident, approachable female supermarket store manager named ' +
      'Sanne, around thirty, with a warm smile, wearing a neat blue-and-white grocery uniform with a name ' +
      'badge. She stands in a bright, well-stocked produce aisle of a modern city supermarket in ' +
      'Rotterdam, Netherlands — the aisle is softly blurred behind her. Professional yet friendly, clean ' +
      'and modern.' + PORTRAIT_FRAME + STYLE,
  },
  {
    key: 'intro_hard', dir: SOLL, file: 'intro_hard.png',
    prompt: 'Medium close-up portrait of a focused, business-like but still warm female supermarket store ' +
      'manager named Sanne, around thirty, wearing a neat blue-and-white grocery uniform with a name badge. ' +
      'She is in a large, busy city supermarket in Amsterdam Zuidoost during rush hour — many blurred ' +
      'shoppers move in the background conveying energy and slight time pressure. Her gaze is direct and ' +
      'attentive.' + PORTRAIT_FRAME + STYLE,
  },
  // ── Trivia intro (quizmaster Pim portrait) ──
  {
    key: 'trivia_intro', dir: TRIV, file: 'trivia_intro.png',
    prompt: 'Medium close-up portrait of a friendly multilingual quiz-show host named Pim, a warm ' +
      'approachable man in his thirties, in a smart-casual blazer over a crisp shirt, giving a welcoming ' +
      'smile. Behind him a softly blurred sleek quiz-show stage with bright cheerful lighting and a clean ' +
      'neutral backdrop.' + PORTRAIT_FRAME + STYLE,
  },
  // ── Trivia topic tiles ──
  { key: 'geography', dir: TRIV, file: 'geography.png',
    prompt: 'A colorful world globe and a folded paper world map on a wooden desk, a small compass beside them, ' +
      'cozy study lighting. Theme: world geography.' + STYLE },
  { key: 'history', dir: TRIV, file: 'history.png',
    prompt: 'A stack of old leather-bound history books, an antique brass hourglass and a rolled parchment ' +
      'on a warm wooden table, soft museum lighting. Theme: history.' + STYLE },
  { key: 'science', dir: TRIV, file: 'science.png',
    prompt: 'A microscope, colorful laboratory beakers and flasks, and a small model atom on a clean bench in a ' +
      'bright friendly laboratory. Theme: science.' + STYLE },
  { key: 'language', dir: TRIV, file: 'language.png',
    prompt: 'Open books with pages forming gentle speech bubbles, scattered colorful letters from several ' +
      'alphabets, a fountain pen, warm reading-nook lighting. Theme: language.' + STYLE },
  { key: 'culture', dir: TRIV, file: 'culture.png',
    prompt: 'A pair of theater comedy-and-tragedy masks, a framed painting and a small classical statue on a ' +
      'shelf in a warm art-gallery setting. Theme: arts and culture.' + STYLE },
  { key: 'food', dir: TRIV, file: 'food.png',
    prompt: 'A rustic wooden table with fresh bread, colorful fruits and small dishes of food from around the ' +
      'world, warm inviting kitchen light. Theme: food.' + STYLE },
  { key: 'sports', dir: TRIV, file: 'sports.png',
    prompt: 'An arrangement of assorted sports equipment — a soccer ball, a tennis racket, running shoes and a ' +
      'medal — on green turf with bright energetic daylight. Theme: sports.' + STYLE },
  { key: 'music', dir: TRIV, file: 'music.png',
    prompt: 'An acoustic guitar, a trumpet and headphones with floating musical notes, warm concert-stage ' +
      'lighting on a dark background. Theme: music.' + STYLE },
];

// ── args ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const LIST  = args.includes('--list');
const PROBE = args.includes('--probe');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx !== -1 ? args[onlyIdx + 1] : null;

if (LIST) {
  for (const t of TARGETS) console.log(`${t.key.padEnd(14)} -> ${path.relative(ROOT, path.join(t.dir, t.file))}`);
  process.exit(0);
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }

async function generateOne(target) {
  ensureDir(target.dir);
  const out = path.join(target.dir, target.file);
  if (!FORCE && fs.existsSync(out)) {
    console.log(`skip   ${target.key} (exists)`);
    return { key: target.key, status: 'skipped' };
  }
  // gpt-image-2 always returns base64 (b64_json); no url option. quality: high.
  const body = {
    prompt: target.prompt,
    n: 1,
    size: '1024x1024',
    quality: 'high',
    output_format: 'png',
  };
  const t0 = Date.now();
  const resp = await fetch(URL, {
    method: 'POST',
    headers: { 'api-key': API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!resp.ok) {
    const errTxt = await resp.text().catch(() => '');
    throw new Error(`HTTP ${resp.status} for ${target.key}: ${errTxt.slice(0, 600)}`);
  }
  const data = await resp.json();
  const item = data && data.data && data.data[0] ? data.data[0] : null;
  let buf;
  if (item && item.b64_json) {
    buf = Buffer.from(item.b64_json, 'base64');
  } else if (item && item.url) {
    const imgResp = await fetch(item.url);
    buf = Buffer.from(await imgResp.arrayBuffer());
  } else {
    throw new Error(`No image data for ${target.key}: ${JSON.stringify(data).slice(0, 400)}`);
  }
  fs.writeFileSync(out, buf);
  console.log(`ok     ${target.key} (${(buf.length / 1024).toFixed(0)} KB, ${Date.now() - t0} ms)`);
  return { key: target.key, status: 'ok', bytes: buf.length };
}

(async () => {
  let list = TARGETS;
  if (PROBE) list = [TARGETS.find((t) => t.key === 'geography')];
  else if (ONLY) {
    const t = TARGETS.find((x) => x.key === ONLY);
    if (!t) { console.error(`Unknown target: ${ONLY}`); process.exit(1); }
    list = [t];
  }

  console.log(`Endpoint: ${URL}`);
  console.log(`Generating ${list.length} image(s)...\n`);
  let okCount = 0, skipCount = 0, failCount = 0;
  for (const target of list) {
    try {
      const r = await generateOne(target);
      if (r.status === 'ok') okCount++;
      else if (r.status === 'skipped') skipCount++;
    } catch (e) {
      failCount++;
      console.error(`FAIL   ${target.key}: ${e.message}`);
    }
  }
  console.log(`\nDone. ok=${okCount} skipped=${skipCount} failed=${failCount}`);
  process.exit(failCount > 0 ? 1 : 0);
})();
