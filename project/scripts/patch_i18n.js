// One-off patch for the i18n files: adds `stop` to common, and three new
// home.menu entries (Sollicitatie, Trivia, Leaderboard) for the new cards.
//
// Idempotent — running it twice is a no-op.

const fs = require('fs');
const path = require('path');

const i18nDir = path.join(__dirname, '..', 'src', 'i18n');

// Texts for the 3 new menu cards by language.
const NEW_MENU = {
  nl: [
    { label: 'Sollicitatiegesprek', sub: 'Oefen met Sanne  ·  Spraak' },
    { label: 'Triviaspel',          sub: 'Quiz met Pim  ·  Spraak'   },
    { label: 'Leaderboard',         sub: 'Bekijk de topscores'        },
  ],
  en: [
    { label: 'Job interview', sub: 'Practice with Sanne  ·  Voice' },
    { label: 'Trivia',        sub: 'Quiz with Pim  ·  Voice'       },
    { label: 'Leaderboard',   sub: 'View the top scores'           },
  ],
  es: [
    { label: 'Entrevista de trabajo', sub: 'Practica con Sanne  ·  Voz' },
    { label: 'Trivia',                sub: 'Concurso con Pim  ·  Voz'   },
    { label: 'Tabla de líderes',      sub: 'Ver las mejores puntuaciones' },
  ],
  tr: [
    { label: 'İş görüşmesi', sub: 'Sanne ile alıştırma  ·  Sesli' },
    { label: 'Bilgi yarışması', sub: 'Pim ile yarışma  ·  Sesli'   },
    { label: 'Skor tablosu',  sub: 'En iyi skorları gör'            },
  ],
  ar: [
    { label: 'مقابلة عمل',     sub: 'تدرّب مع سانه  ·  صوت'  },
    { label: 'مسابقة معلومات', sub: 'لعبة مع بيم  ·  صوت'    },
    { label: 'لوحة المتصدرين', sub: 'شاهد أعلى النتائج'      },
  ],
  pl: [
    { label: 'Rozmowa kwalifikacyjna', sub: 'Ćwicz z Sanne  ·  Głos' },
    { label: 'Quiz wiedzy',            sub: 'Quiz z Pimem  ·  Głos'  },
    { label: 'Tabela wyników',         sub: 'Zobacz najlepsze wyniki' },
  ],
  uk: [
    { label: 'Співбесіда',     sub: 'Тренуйся з Сане  ·  Голос' },
    { label: 'Вікторина',      sub: 'Гра з Пімом  ·  Голос'    },
    { label: 'Таблиця лідерів', sub: 'Найкращі результати'      },
  ],
};

// "Stop" word per language for the AudioBtn label.
const STOP = {
  nl: '⏹ Stop',
  en: '⏹ Stop',
  es: '⏹ Parar',
  tr: '⏹ Dur',
  ar: '⏹ إيقاف',
  pl: '⏹ Stop',
  uk: '⏹ Стоп',
};

let patched = 0;

for (const lang of Object.keys(NEW_MENU)) {
  const file = path.join(i18nDir, `${lang}.js`);
  if (!fs.existsSync(file)) {
    console.warn('skip — file missing:', file);
    continue;
  }
  let src = fs.readFileSync(file, 'utf8');
  let changed = false;

  // 1. Add common.stop if missing.
  if (!/\bstop:\s*['"]/.test(src)) {
    src = src.replace(
      /(common:\s*\{\s*\n\s*listen:\s*[^\n]+\n)/,
      (m) => m + `    stop:     ${JSON.stringify(STOP[lang])},\n`
    );
    changed = true;
  }

  // 2. Extend home.menu with the 3 new entries (Sanne / Trivia / Leaderboard).
  // Find the closing bracket of the menu array.
  const menuOpen = src.indexOf('menu: [');
  if (menuOpen !== -1) {
    const arrEnd = src.indexOf(']', menuOpen);
    const arrContent = src.slice(menuOpen + 'menu: ['.length, arrEnd);
    const alreadyHasSanne = arrContent.includes('/sollicitatie') ||
      NEW_MENU[lang].some((e) => arrContent.includes(JSON.stringify(e.label).slice(1, -1)));
    if (!alreadyHasSanne) {
      const before = src.slice(0, arrEnd);
      const after = src.slice(arrEnd);
      // Trim trailing whitespace + ensure the existing last entry has a trailing comma.
      const trimmed = before.replace(/[\s,]*$/, ',');
      const indent = '      ';
      const newEntries = NEW_MENU[lang]
        .map((e) => `${indent}{ label: ${JSON.stringify(e.label)}, sub: ${JSON.stringify(e.sub)} },`)
        .join('\n');
      src = trimmed + '\n' + newEntries + '\n    ' + after;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, src);
    patched++;
    console.log('patched', lang);
  } else {
    console.log('already up to date', lang);
  }
}

console.log(`\nDone. patched ${patched} of ${Object.keys(NEW_MENU).length} i18n files.`);
