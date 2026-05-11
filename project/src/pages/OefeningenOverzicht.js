import { useNavigate } from 'react-router-dom';

const OEFENINGEN = [
  { id: 1, title: 'Je CV maken',            meta: '1 opdrachten',  icon: '📄', bg: '#dbeafe', status: 'done'   },
  { id: 2, title: 'Sollicitatiebrief',       meta: '1 opdrachten',  icon: '📋', bg: '#fef9c3', status: 'done'   },
  { id: 3, title: 'Kleding & gedrag',        meta: '1 opdrachten',  icon: '👔', bg: '#ede9fe', status: 'active' },
  { id: 4, title: 'Vacatures zoeken',        meta: '0 opdrachten',  icon: '🔍', bg: '#d1fae5', status: 'wip'    },
  { id: 5, title: 'Het sollicitatiegesprek', meta: '0 opdrachten',  icon: '🗣️', bg: '#ffeaea', status: 'wip'    },
  { id: 6, title: 'Op tijd komen',          meta: '1 opdrachten',  icon: '⏰', bg: '#f3f4f6', status: 'wip'    },
];

export default function OefeningenOverzicht() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <div className="page-header">
          <button className="back-btn" onClick={() => navigate('/')}>‹</button>
          <h1 className="page-title">Oefeningen (Tekst en Audio)</h1>
        </div>

        <div className="overview-list">
          {OEFENINGEN.map((oef) => (
            <button
              key={oef.id}
              className={`ov-item${oef.status === 'wip' ? ' wip' : ''}`}
              disabled={oef.status === 'wip'}
            >
              <div className="ov-icon" style={{ background: oef.bg }}>{oef.icon}</div>
              <div className="ov-body">
                <p className={`ov-title${oef.status === 'wip' ? ' muted' : ''}`}>{oef.title}</p>
                <p className="ov-meta">{oef.meta}</p>
              </div>
              {oef.status === 'done'   && <span className="ov-dot dot-green" />}
              {oef.status === 'wip'    && <span className="ov-dot dot-gray"  />}
              {oef.status === 'active' && <span className="ov-chevron">›</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
