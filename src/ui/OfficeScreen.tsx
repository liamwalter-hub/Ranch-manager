import { useRef, useState } from 'react';
import type { GameState } from '../engine/types';
import { game } from '../platform/controller';
import { useInstalled, useOnline, usePersistentStorage } from '../platform/status';
import { exportSave, readSaveFile } from '../platform/storage';

export function OfficeScreen({ state }: { state: GameState }) {
  const online = useOnline();
  const installed = useInstalled();
  const persisted = usePersistentStorage();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  const onImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const s = await readSaveFile(file);
      if (confirm('Replace your current game with this save?')) {
        game.loadState(s);
        setMessage('Save loaded.');
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not read that file.');
    }
  };

  return (
    <>
      <section className="card">
        <h2 className="card__title">Save game</h2>
        <p className="muted">Your game saves automatically on this phone. Export a copy to keep a backup, because clearing Chrome's site data deletes saves.</p>
        <div className="btn-row">
          <button className="btn" onClick={() => exportSave(state)}>Export save</button>
          <button className="btn" onClick={() => fileRef.current?.click()}>Import save</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={e => onImport(e.target.files?.[0])} />
        </div>
        {message && <p className="muted">{message}</p>}
      </section>

      <section className="card">
        <h2 className="card__title">New game</h2>
        <p className="muted">Start again from 1 March. Your current game will be deleted.</p>
        <button className="btn btn--danger" onClick={() => { if (confirm('Delete this game and start again?')) game.newGame(); }}>Start a new game</button>
      </section>

      <section className="card">
        <h2 className="card__title">Setup check</h2>
        <table className="table">
          <tbody>
            <tr><th>Connection</th><td className={online ? 'ok' : 'warn'}>{online ? 'Online' : 'Offline'}</td></tr>
            <tr><th>Installed</th><td className={installed ? 'ok' : 'warn'}>{installed ? 'Yes' : 'No, running in the browser'}</td></tr>
            <tr><th>Saved data kept</th><td className={persisted ? 'ok' : 'warn'}>{persisted === null ? 'Checking…' : persisted ? 'Yes' : 'Not guaranteed yet'}</td></tr>
            <tr><th>Version</th><td>{new Date(__BUILD_TIME__).toLocaleString('en-GB')}</td></tr>
          </tbody>
        </table>
      </section>
    </>
  );
}
