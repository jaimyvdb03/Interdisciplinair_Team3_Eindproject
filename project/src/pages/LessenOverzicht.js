import { useNavigate } from 'react-router-dom';

const LESSEN = [
  { id: 1, title: 'Je CV maken',            meta: '2 min',         icon: '📄', bg: '#dbeafe', status: 'done'   },
  { id: 2, title: 'Sollicitatiebrief',       meta: '1 opdrachten',  icon: '📋', bg: '#fef9c3', status: 'active' },
  { id: 3, title: 'Kleding & gedrag',        meta: '0 van (WIP)',   icon: '👔', bg: '#ede9fe', status: 'wip'    },
  { id: 4, title: 'Vacatures zoeken',        meta: '0 van (WIP)',   icon: '🔍', bg: '#d1fae5', status: 'wip'    },
  { id: 5, title: 'Het sollicitatiegesprek', meta: '0 van (WIP)',   icon: '🗣️', bg: '#ffeaea', status: 'wip'    },
  { id: 6, title: 'Op tijd komen',          meta: '0 van (WIP)',   icon: '⏰', bg: '#f3f4f6', status: 'wip'    },
];

export default function LessenOverzicht() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>‹</button>
          <h1 className="page-title">Lessen (Tekst en Audio)</h1>
        </div>

        <div className="overview-list">
          {LESSEN.map((les) => (
            <button
              key={les.id}
              className={`ov-item${les.status === 'wip' ? ' wip' : ''}`}
              disabled={les.status === 'wip'}
            >
              <div className="ov-icon" style={{ background: les.bg }}>{les.icon}</div>
              <div className="ov-body">
                <p className={`ov-title${les.status === 'wip' ? ' muted' : ''}`}>{les.title}</p>
                <p className="ov-meta">{les.meta}</p>
              </div>
              {les.status === 'done'   && <span className="ov-dot dot-green" />}
              {les.status === 'wip'    && <span className="ov-dot dot-gray"  />}
              {les.status === 'active' && <span className="ov-chevron">›</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
