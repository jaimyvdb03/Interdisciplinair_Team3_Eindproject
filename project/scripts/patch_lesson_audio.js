// Wire functional audio onto the four lesson pages. For each page:
//   - Inject a small "stepText" helper above renderStep
//   - Compute `const audio = stepText(...)` inside renderStep
//   - Replace `<AudioBtn label={tc.listen} />` with `<AudioBtn label={tc.listen} text={audio} />`
//
// Idempotent — running twice is a no-op.

const fs = require('fs');
const path = require('path');

const lessen = path.join(__dirname, '..', 'src', 'pages', 'lessen');

const PATCHES = {
  'CvMakenLes.js': {
    helper: `// Builds the spoken text for a step from its translated content.
function cvStepText(s) {
  const parts = [s.title];
  if (s.type === 'intro') { parts.push(s.body1, s.body2); }
  else if (s.type === 'list') { parts.push(s.body, ...s.items.map((i) => i.label)); }
  else if (s.type === 'mockup') { parts.push(s.body, s.noExpTitle, s.noExpText); }
  else if (s.type === 'methods') {
    parts.push(s.body);
    s.methods.forEach((m) => parts.push(m.label + '. ' + m.steps.join('. ')));
  }
  return parts.filter(Boolean).join('. ');
}

`,
    renderStepSig: 'function renderStep(s, tc) {',
    audioLine: '  const audio = cvStepText(s);',
  },
  'KledingGedragLes.js': {
    helper: `// Builds the spoken text for a step from its translated content.
function kgStepText(s, tk) {
  const parts = [s.title];
  if (s.type === 'intro') { parts.push(s.body1, s.body2, tk.introBody3, tk.introBody4); }
  else if (s.kind === 'clothing') { parts.push(s.body, tk.clothingExtra1, tk.clothingExtra2, ...s.items.map((i) => i.label)); }
  else if (s.kind === 'behavior') { parts.push(s.body, tk.behaviorExtra1, tk.behaviorExtra2, ...s.items.map((i) => i.label)); }
  return parts.filter(Boolean).join('. ');
}

`,
    renderStepSig: 'function renderStep(s, tc, tk) {',
    audioLine: '  const audio = kgStepText(s, tk);',
  },
  'OpTijdKomenLes.js': {
    helper: `// Builds the spoken text for a step from its translated content.
function otStepText(step, s) {
  const j = (...xs) => xs.filter(Boolean).join('. ');
  if (step === 0) return j(s.s0 && s.s0.title, s.s0 && s.s0.body);
  if (step === 1) return j(s.s1 && s.s1.sectionTitle, s.s1 && s.s1.subTitle, s.s1 && s.s1.body1, s.s1 && s.s1.body2);
  if (step === 2) return j(s.s2 && s.s2.sectionTitle, s.s2 && s.s2.subTitle, ...((s.s2 && s.s2.items) || []));
  if (step === 3) return j(s.s3 && s.s3.title, s.s3 && s.s3.intro, ...((s.s3 && s.s3.items) || []));
  if (step === 4) return j(s.s4 && s.s4.sectionTitle, s.s4 && s.s4.subTitle, s.s4 && s.s4.body1, s.s4 && s.s4.body2);
  if (step === 5) return j(s.s5 && s.s5.title, s.s5 && s.s5.body1, s.s5 && s.s5.body2);
  if (step === 6) return j(s.s6 && s.s6.title, s.s6 && s.s6.body1, s.s6 && s.s6.body2, ...(((s.s6 && s.s6.items) || []).map((i) => i.text)));
  return '';
}

`,
    renderStepSig: 'function renderStep(step, s, tc) {',
    audioLine: '  const audio = otStepText(step, s);',
  },
  'SollicitatiebriefLes.js': {
    helper: `// Builds the spoken text for a step from its translated content.
function briefStepText(step, sl) {
  const j = (...xs) => xs.filter(Boolean).join('. ');
  if (step === 0) return j(sl.s0 && sl.s0.title, sl.s0 && sl.s0.body);
  if (step === 1) return j(sl.s1 && sl.s1.title, sl.letterNote);
  if (step === 2) return j(sl.s2 && sl.s2.title, sl.s2 && sl.s2.intro, ...((sl.s2 && sl.s2.options) || []).map((o) => o.label + ': ' + o.example));
  if (step === 3) return j(sl.s3 && sl.s3.title, sl.s3 && sl.s3.body, sl.s3 && sl.s3.example);
  if (step === 4) return j(sl.s4 && sl.s4.title, sl.s4 && sl.s4.body);
  if (step === 5) return j(sl.s5 && sl.s5.title, sl.s5 && sl.s5.body, sl.s5 && sl.s5.noExpLabel, sl.s5 && sl.s5.noExp);
  if (step === 6) return j(sl.s6 && sl.s6.title, sl.s6 && sl.s6.body, sl.s6 && sl.s6.example);
  if (step === 7) return j(sl.s7 && sl.s7.title, sl.s7 && sl.s7.body1, sl.s7 && sl.s7.body2, sl.s7 && sl.s7.cvNote,
    ...((sl.s7 && sl.s7.closingOptions) || []).map((o) => o.label + ': ' + o.example), sl.s7 && sl.s7.formatNote);
  return '';
}

`,
    renderStepSig: 'function renderStep(step, sl, tc) {',
    audioLine: '  const audio = briefStepText(step, sl);',
  },
};

let total = 0;
for (const [file, p] of Object.entries(PATCHES)) {
  const fp = path.join(lessen, file);
  if (!fs.existsSync(fp)) { console.warn('skip — missing', fp); continue; }
  let src = fs.readFileSync(fp, 'utf8');
  let changed = false;

  // 1. Insert helper before renderStep (only if not already present).
  if (!src.includes(p.helper.split('\n')[0])) {
    if (!src.includes(p.renderStepSig)) {
      console.warn('  · ' + file + ': renderStepSig not found, skipping helper');
    } else {
      src = src.replace(p.renderStepSig, p.helper + p.renderStepSig);
      changed = true;
    }
  }

  // 2. Add audio line right after renderStep's opening brace (only if not present).
  if (!src.includes(p.audioLine.trim())) {
    src = src.replace(p.renderStepSig + '\n', p.renderStepSig + '\n' + p.audioLine + '\n');
    changed = true;
  }

  // 3. Replace AudioBtn placeholder with one that has text={audio}.
  const before = (src.match(/<AudioBtn label=\{tc\.listen\} \/>/g) || []).length;
  src = src.replace(/<AudioBtn label=\{tc\.listen\} \/>/g, '<AudioBtn label={tc.listen} text={audio} />');
  const after = (src.match(/<AudioBtn label=\{tc\.listen\} text=\{audio\} \/>/g) || []).length;
  if (before > 0) changed = true;

  if (changed) {
    fs.writeFileSync(fp, src);
    console.log('  ✓ ' + file + ' (replaced', after, 'AudioBtn placeholders)');
    total++;
  } else {
    console.log('  · ' + file + ' already patched');
  }
}

console.log(`\nDone. ${total} files updated.`);
