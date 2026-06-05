import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import PageHeader from '../components/PageHeader';

const UI = {
  nl: {
    title: 'Leaderboard', sanne: 'Sanne', trivia: 'Trivia',
    easy: 'Makkelijk', medium: 'Normaal', hard: 'Moeilijk',
    empty: 'Nog geen scores. Speel een ronde en plaats je score!',
    points: 'punten', grade: 'cijfer', accuracy: 'goed', you: 'jij',
    loading: 'Laden…', back: 'Terug',
    intro: 'Hier staan de beste scores. Speel mee en kom op de ranglijst!',
  },
  en: {
    title: 'Leaderboard', sanne: 'Sanne', trivia: 'Trivia',
    easy: 'Easy', medium: 'Normal', hard: 'Hard',
    empty: 'No scores yet. Play a round and add your score!',
    points: 'points', grade: 'score', accuracy: 'correct', you: 'you',
    loading: 'Loading…', back: 'Back',
    intro: 'These are the top scores. Play and get on the ranking!',
  },
  es: {
    title: 'Clasificación', sanne: 'Sanne', trivia: 'Trivia',
    easy: 'Fácil', medium: 'Normal', hard: 'Difícil',
    empty: 'Aún no hay puntuaciones. ¡Juega una ronda y añade la tuya!',
    points: 'puntos', grade: 'nota', accuracy: 'correctas', you: 'tú',
    loading: 'Cargando…', back: 'Atrás',
    intro: 'Estas son las mejores puntuaciones. ¡Juega y entra en la clasificación!',
  },
};

const SANNE_DIFFS = ['easy', 'medium', 'hard'];

export default function Leaderboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();
  const ui = UI[lang] || UI.nl;
  const st = location.state || {};

  const [game, setGame] = useState(st.game === 'trivia' ? 'trivia' : 'sollicitatie');
  const [difficulty, setDifficulty] = useState(st.difficulty && SANNE_DIFFS.includes(st.difficulty) ? st.difficulty : 'easy');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlightId = st.highlightId || null;

  const effDiff = game === 'trivia' ? 'medium' : difficulty;
  const reqSeq = useRef(0);

  const load = useCallback(async () => {
    const myId = ++reqSeq.current; // ignore responses from superseded requests
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?game=${game}&difficulty=${effDiff}&limit=20`);
      const data = await res.json();
      if (myId !== reqSeq.current) return;
      setEntries(Array.isArray(data.entries) ? data.entries : []);
    } catch (e) { if (myId === reqSeq.current) setEntries([]); }
    if (myId === reqSeq.current) setLoading(false);
  }, [game, effDiff]);

  useEffect(() => { load(); }, [load]);

  const medal = (i) => (i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`);
  const diffLabel = (d) => (d === 'easy' ? ui.easy : d === 'hard' ? ui.hard : ui.medium);

  const audioText = `${ui.title}. ${ui.intro}`;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16 max-w-2xl mx-auto">
        <PageHeader title={`🏆 ${ui.title}`} onBack={() => navigate(-1)} audioText={audioText} />

        <div className="px-4 sm:px-0">
          {/* Game tabs */}
          <div className="flex gap-2 mb-3">
            {[['sollicitatie', ui.sanne], ['trivia', ui.trivia]].map(([g, label]) => (
              <button key={g} onClick={() => setGame(g)}
                className={`flex-1 rounded-xl py-2.5 text-sm font-bold border-2 transition-colors ${game === g ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Difficulty sub-tabs (Sanne only) */}
          {game === 'sollicitatie' && (
            <div className="flex gap-2 mb-4">
              {SANNE_DIFFS.map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold border-2 transition-colors ${difficulty === d ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-white text-gray-500 border-gray-200'}`}>
                  {diffLabel(d)}
                </button>
              ))}
            </div>
          )}

          {loading && <p className="text-sm text-gray-400 text-center py-10">{ui.loading}</p>}
          {!loading && entries.length === 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
              <p className="text-sm text-gray-500">{ui.empty}</p>
            </div>
          )}

          {!loading && entries.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {entries.map((e, i) => {
                const mine = highlightId && e.id === highlightId;
                const metric = game === 'trivia'
                  ? `${Number(e.total_points) || 0}/50 · ${Number(e.accuracy_pct) || 0}% ${ui.accuracy}`
                  : `${ui.grade} ${(Number(e.grade) || 0).toFixed(1).replace('.', ',')}`;
                return (
                  <div key={e.id || i} className={`flex items-center gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${mine ? 'bg-blue-50' : ''}`}>
                    <span className="w-8 text-center text-base font-bold text-gray-500 shrink-0">{medal(i)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {e.candidate_name || '—'} {mine && <span className="text-[10px] font-bold text-blue-600">({ui.you})</span>}
                      </p>
                      <p className="text-xs text-gray-400">{metric}{game === 'sollicitatie' ? ` · ${diffLabel(e.difficulty)}` : ''}</p>
                    </div>
                    <span className="text-lg font-extrabold text-blue-700 shrink-0">{(Number(e.leaderboard_points) || 0).toFixed(1).replace('.', ',')}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
