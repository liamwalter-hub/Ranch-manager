import { useEffect, useState } from 'react';
import { game, useGame } from '../platform/controller';
import { UpdateBanner } from './UpdateBanner';
import { HomeScreen } from './HomeScreen';
import { OfficeScreen } from './OfficeScreen';
import { DebugScreen } from './DebugScreen';
import { AwaySheet } from './AwaySheet';
import { TopBar } from './TopBar';

type Tab = 'home' | 'inbox' | 'staff' | 'ranch' | 'office' | 'debug';

const TABS: { id: Tab; label: string; icon: string; ready: boolean }[] = [
  { id: 'home', label: 'Home', icon: '⌂', ready: true },
  { id: 'inbox', label: 'Inbox', icon: '✉', ready: false },
  { id: 'staff', label: 'Staff', icon: '☺', ready: false },
  { id: 'ranch', label: 'Ranch', icon: '▦', ready: false },
  { id: 'office', label: 'Office', icon: '☰', ready: true },
];

function readDebugFlag(): boolean {
  if (new URLSearchParams(location.search).has('debug')) return true;
  try { return localStorage.getItem('rm-debug') === '1'; } catch { return false; }
}

export function App() {
  const snap = useGame();
  const [tab, setTab] = useState<Tab>('home');
  const [debug, setDebug] = useState(readDebugFlag);

  useEffect(() => {
    game.start();
    return () => game.stop();
  }, []);

  const toggleDebug = () => {
    const next = !debug;
    setDebug(next);
    try { localStorage.setItem('rm-debug', next ? '1' : '0'); } catch { /* ignore */ }
    if (!next && tab === 'debug') setTab('home');
  };

  if (snap.status === 'loading') return <div className="app"><div className="content muted">Opening the ranch office…</div></div>;
  if (snap.status === 'error' || !snap.state) {
    return <div className="app"><div className="content"><div className="card"><b>Something went wrong loading the game.</b><pre className="pre">{snap.error}</pre></div></div></div>;
  }

  const tabs = debug ? [...TABS, { id: 'debug' as Tab, label: 'Debug', icon: '⚙', ready: true }] : TABS;

  return (
    <div className="app">
      <UpdateBanner />
      <TopBar state={snap.state} displayMinutes={snap.displayMinutes} onSecretTap={toggleDebug} />
      <main className="content">
        {snap.restoredFromBackup && <div className="card warn-card">Your latest save couldn't be read, so a recent backup was loaded.</div>}
        {tab === 'home' && <HomeScreen snap={snap} />}
        {tab === 'office' && <OfficeScreen state={snap.state} />}
        {tab === 'debug' && <DebugScreen snap={snap} />}
      </main>
      <nav className="tabbar">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tabbar__btn ${tab === t.id ? 'is-active' : ''}`}
            disabled={!t.ready}
            onClick={() => setTab(t.id)}
          >
            <span className="tabbar__icon" aria-hidden>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
      {snap.away && <AwaySheet away={snap.away} />}
    </div>
  );
}
