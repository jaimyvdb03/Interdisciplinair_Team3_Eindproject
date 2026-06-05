// One-off prompt patcher.
//  - Sanne (sanne_prompts.json): rewrites step 5 (CLOSING) into explicit
//    sub-steps so the model answers the candidate's last question BEFORE
//    calling end_interview.
//  - Trivia (trivia_prompts.json): forces immediate transition to the next
//    round after score_round, and nudges difficulty slightly upward.

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

// ── Sanne ──────────────────────────────────────────────────────────────────
const sannePath = path.join(root, 'sanne_prompts.json');
const sanne = JSON.parse(fs.readFileSync(sannePath, 'utf8'));

// The replacement text for the closing-step line. We replace the entire
// step 5 line (which varies slightly per difficulty) with a multi-line
// instruction. We use string replace per variant for safety.

const sanneClosingByLang = {
  nl: `5) AFRONDING — in deze vaste volgorde:
   a) Vraag warm: "Heb jij zelf nog een vraag voor mij?"
   b) Wacht tot de kandidaat klaar is met praten.
   c) Geef ECHT antwoord op de vraag in 2 of 3 korte zinnen. Geen ontwijking, geen "daar komen we later op terug". Als je iets niet precies weet, zeg dat eerlijk maar geef toch een korte, behulpzame richting.
   d) Bedank de kandidaat warm voor het gesprek en sluit kort af.
   e) Roep PAS DAARNA end_interview aan.

Belangrijke regel: end_interview komt PAS nadat je werkelijk hebt geantwoord op de vraag van de kandidaat en afscheid hebt genomen. Sla deze volgorde nooit over.`,
  en: `5) CLOSING — in this fixed order:
   a) Ask warmly: "Do you have a question for me?"
   b) Wait until the candidate has finished speaking.
   c) ACTUALLY answer their question in 2 or 3 short sentences. No deflection, no "we can come back to that later". If you are not sure, say so honestly but still give a short, helpful direction.
   d) Thank the candidate warmly for the conversation and close briefly.
   e) ONLY THEN call end_interview.

Important rule: end_interview comes ONLY AFTER you have really answered the candidate's question and said goodbye. Never skip this order.`,
  es: `5) CIERRE — en este orden fijo:
   a) Pregunta con calidez: "¿Tienes alguna pregunta para mí?"
   b) Espera hasta que el candidato termine de hablar.
   c) DE VERDAD responde a su pregunta en 2 o 3 frases cortas. Sin evasivas, sin "podemos volver a eso después". Si no lo sabes con certeza, dilo con honestidad pero da una breve dirección útil.
   d) Da las gracias con calidez por la conversación y cierra brevemente.
   e) SOLO ENTONCES llama a end_interview.

Regla importante: end_interview viene SOLO DESPUÉS de haber respondido realmente a la pregunta del candidato y de haberte despedido. Nunca te saltes este orden.`,
};

const sanneClosingNeedles = [
  // easy NL
  '5) AFRONDING: vraag of de kandidaat een vraag heeft, beantwoord die kort, bedank warm, sluit af.',
  // medium NL
  '5) AFRONDING — vraag of de kandidaat een vraag heeft, beantwoord die kort, bedank warm, sluit af.',
  // hard NL
  '5) AFRONDING: vraag of de kandidaat een vraag heeft, beantwoord kort, bedank warm, sluit af.',
  // easy EN
  '5) CLOSING: ask if the candidate has a question, answer it briefly, thank them warmly, end.',
  // medium EN
  '5) CLOSING — ask if the candidate has a question, answer it briefly, thank them warmly, end.',
  // hard EN
  '5) CLOSING: ask if the candidate has a question, answer briefly, thank them warmly, end.',
  // easy ES
  '5) CIERRE: pregunta si el candidato tiene una pregunta, respóndela brevemente, agradece con calidez, termina.',
  // medium ES
  '5) CIERRE — pregunta si el candidato tiene una pregunta, respóndela brevemente, dale las gracias con calidez, termina.',
  // hard ES
  '5) CIERRE: pregunta si tiene una duda, responde corto, da las gracias con calidez, termina.',
];

function pickReplacement(lang) { return sanneClosingByLang[lang]; }

let sanneReplacements = 0;
for (const diff of ['easy', 'medium', 'hard']) {
  for (const lang of ['nl', 'en', 'es']) {
    let txt = sanne[diff][lang];
    let replaced = false;
    for (const needle of sanneClosingNeedles) {
      if (txt.includes(needle)) {
        txt = txt.replace(needle, pickReplacement(lang));
        replaced = true;
        break;
      }
    }
    if (!replaced) {
      console.error('  ✗ no needle matched for', diff, lang, '— skipping (left as-is)');
      continue;
    }
    sanne[diff][lang] = txt;
    sanneReplacements++;
    console.log('  ✓', diff, '/', lang, 'closing rewritten,', txt.length, 'chars total');
  }
}

fs.writeFileSync(sannePath, JSON.stringify(sanne, null, 2) + '\n');
console.log('Sanne: rewrote step 5 in', sanneReplacements, 'of 9 variants');

// ── Trivia ──────────────────────────────────────────────────────────────────
const trivPath = path.join(root, 'trivia_prompts.json');
const triv = JSON.parse(fs.readFileSync(trivPath, 'utf8'));

const trivPatches = {
  nl: {
    difficulty: {
      from: 'Het zijn algemene wereldvragen, geschikt voor iedereen, niet te moeilijk.',
      to: 'Het zijn algemene wereldvragen voor een algemeen ontwikkeld publiek — iets uitdagender dan basale weetjes, maar geen academische strikvragen. Een mix van makkelijke instappers en wat pittiger vragen die mensen aan het denken zetten.',
    },
    autoContinue: {
      from: '3. Na het antwoord: zeg of het goed was, geef een uitleg van het juiste antwoord in een zin, roep dan TOOL score_round(round, points, max, topic, correct) aan. points is 0 tot 10, max is 10, een antwoord dat dicht in de buurt komt mag punten krijgen, correct is true of false.',
      to: '3. Na het antwoord: zeg of het goed was, geef een uitleg van het juiste antwoord in een zin, roep dan TOOL score_round(round, points, max, topic, correct) aan. points is 0 tot 10, max is 10, een antwoord dat dicht in de buurt komt mag punten krijgen, correct is true of false.\n4. ONMIDDELLIJK na score_round ga je door naar de volgende ronde: roep TOOL start_round aan met het nieuwe rondenummer en thema, en stel de nieuwe vraag. Wacht NIET op een seintje van de speler. Pauzeer NIET tussen rondes. Alleen na ronde 5 stop je en roep je end_quiz aan.',
    },
  },
  en: {
    difficulty: {
      from: 'They are general world questions, suitable for everyone, not too hard.',
      to: 'They are general world questions for a generally educated audience — a bit more challenging than basic trivia, but no academic trick questions. Mix easy openers with slightly harder questions that make people think.',
    },
    autoContinue: {
      from: '3. After the answer: say whether it was right, explain the correct answer in one sentence, then call TOOL score_round(round, points, max, topic, correct). points is 0 to 10, max is 10, a close answer may receive partial points, correct is true or false.',
      to: '3. After the answer: say whether it was right, explain the correct answer in one sentence, then call TOOL score_round(round, points, max, topic, correct). points is 0 to 10, max is 10, a close answer may receive partial points, correct is true or false.\n4. IMMEDIATELY after score_round you move to the next round: call TOOL start_round with the new round number and topic, and ask the next question. Do NOT wait for the player to prompt you. Do NOT pause between rounds. Only after round 5 do you stop and call end_quiz.',
    },
  },
  es: {
    difficulty: {
      from: 'Son preguntas generales del mundo, adecuadas para todos, no demasiado difíciles.',
      to: 'Son preguntas generales del mundo para un público con cultura general — un poco más desafiantes que trivialidades básicas, pero sin trampas académicas. Mezcla preguntas fáciles con otras un poco más difíciles que hagan pensar.',
    },
    autoContinue: {
      from: '3. Tras la respuesta: di si fue correcta, explica la respuesta correcta en una frase, y luego llama a TOOL score_round(round, points, max, topic, correct). points es 0 a 10, max es 10, una respuesta cercana puede recibir puntos parciales, correct es true o false.',
      to: '3. Tras la respuesta: di si fue correcta, explica la respuesta correcta en una frase, y luego llama a TOOL score_round(round, points, max, topic, correct). points es 0 a 10, max es 10, una respuesta cercana puede recibir puntos parciales, correct es true o false.\n4. INMEDIATAMENTE después de score_round pasas a la siguiente ronda: llama a TOOL start_round con el nuevo número de ronda y tema, y haz la nueva pregunta. NO esperes a que el jugador te lo pida. NO pauses entre rondas. Solo después de la ronda 5 paras y llamas a end_quiz.',
    },
  },
};

let trivReplacements = 0;
for (const lang of ['nl', 'en', 'es']) {
  let txt = triv[lang] || '';
  const patches = trivPatches[lang];
  for (const k of Object.keys(patches)) {
    const { from, to } = patches[k];
    if (txt.includes(from)) {
      txt = txt.replace(from, to);
      console.log('  ✓ trivia', lang, k);
      trivReplacements++;
    } else {
      // Fallback: append a strong instruction at the end if the original
      // wording has drifted.
      console.warn('  · trivia', lang, k, 'needle not found — appending');
      txt += '\n\n' + to;
      trivReplacements++;
    }
  }
  triv[lang] = txt;
}

fs.writeFileSync(trivPath, JSON.stringify(triv, null, 2) + '\n');
console.log('Trivia: applied', trivReplacements, 'of 6 patches (3 langs × 2 each)');
