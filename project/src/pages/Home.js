import { useNavigate } from 'react-router-dom';

const PROGRESS  = 40;
const COMPLETED = 2;
const TOTAL     = 11;

const MENU = [
  { label: 'Lessen',       sub: 'Lees en luister  ·  Tekst & Audio', icon: '📖', cls: 'icon-red',    to: '/lessen'     },
  { label: 'Video lessen', sub: 'Kijk en luister  ·  Video',          icon: '▶️', cls: 'icon-blue',   to: '/video'      },
  { label: 'Oefeningen',   sub: 'Probeer het zelf',                   icon: '🧩', cls: 'icon-purple', to: '/oefeningen' },
  { label: 'Hulp nodig?',  sub: 'Stel je vraag',                      icon: '💬', cls: 'icon-teal',   to: '/hulp'       },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <div className="page-wrap">
        <div className="home-topbar">
          <h1 className="home-title">Welkom terug! 👋</h1>
          <button className="lang-btn">🇳🇱 NL</button>
        </div>
        <p className="home-subtitle">Klaar om verder te leren?</p>

        <div className="menu-list">
          {MENU.map((item) => (
            <button key={item.label} className="menu-card" onClick={() => navigate(item.to)}>
              <div className={`card-icon ${item.cls}`}>{item.icon}</div>
              <div className="card-text">
                <p className="card-title">{item.label}</p>
                <p className="card-sub">{item.sub}</p>
              </div>
              <span className="card-chevron">›</span>
            </button>
          ))}
        </div>

        <div className="progress-card">
          <p className="prog-label">Je voortgang</p>
          <p className="prog-pct">{PROGRESS}% voltooid</p>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${PROGRESS}%` }} />
          </div>
          <p className="prog-sub">{COMPLETED} van {TOTAL} lessen afgerond</p>
        </div>

        <button className="ga-verder-btn" onClick={() => navigate('/lessen')}>
          Ga verder
        </button>
      </div>
    </div>
  );
}
