import { UpdateBanner } from './UpdateBanner';
import { useInstalled, useNow, useOnline, usePersistentStorage } from '../platform/status';

function blockFor(hour: number): string {
  if (hour >= 6 && hour < 12) return 'Morning';
  if (hour >= 12 && hour < 18) return 'Midday';
  return 'Evening';
}

export function App() {
  const now = useNow();
  const online = useOnline();
  const installed = useInstalled();
  const persisted = usePersistentStorage();

  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="app">
      <UpdateBanner />
      <header className="topbar">
        <div className="topbar__title">Thistle Creek Ranch</div>
        <div className="topbar__sub">Harlan Crossing, Montana</div>
      </header>

      <main className="content">
        <section className="card">
          <h2 className="card__title">Ranch office</h2>
          <div className="clock">
            <span className="clock__time">{time}</span>
            <span className="clock__block">{blockFor(now.getHours())}</span>
          </div>
          <p className="muted">
            Building work in progress. The game clock, saves and the first decisions arrive in the next steps.
          </p>
        </section>

        <section className="card">
          <h2 className="card__title">Setup check</h2>
          <table className="table">
            <tbody>
              <tr><th>Connection</th><td className={online ? 'ok' : 'warn'}>{online ? 'Online' : 'Offline'}</td></tr>
              <tr><th>Installed</th><td className={installed ? 'ok' : 'warn'}>{installed ? 'Yes, running as an app' : 'No, running in the browser'}</td></tr>
              <tr><th>Saved data kept</th><td className={persisted ? 'ok' : 'warn'}>{persisted === null ? 'Checking…' : persisted ? 'Yes' : 'Not guaranteed yet'}</td></tr>
              <tr><th>Version</th><td>{new Date(__BUILD_TIME__).toLocaleString('en-GB')}</td></tr>
            </tbody>
          </table>
          {!installed && (
            <p className="muted">To install: tap Chrome's ⋮ menu, then <b>Add to Home screen</b> or <b>Install app</b>.</p>
          )}
        </section>
      </main>
    </div>
  );
}
