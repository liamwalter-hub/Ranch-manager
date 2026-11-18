import { createStore, del, get, set } from 'idb-keyval';
import { SAVE_VERSION, type GameState } from '../engine/types';

/**
 * Saves live in IndexedDB on the device. We keep the current save plus the
 * last three earlier versions, in case one is ever corrupted.
 */
const store = createStore('ranch-manager', 'saves');
const CURRENT = 'slot1';
const BACKUPS = ['slot1-backup1', 'slot1-backup2', 'slot1-backup3'];
const BACKUP_EVERY_MS = 10 * 60_000; // rotate backups at most every 10 minutes

let lastBackupMs = 0;

export function isValidSave(x: unknown): x is GameState {
  const s = x as GameState;
  return !!s && typeof s === 'object' && typeof s.version === 'number' && !!s.clock && typeof s.clock.gameMinutes === 'number' && Array.isArray(s.log);
}

/** Upgrades older saves to the current format. Add a step here whenever the save format changes. */
export function migrate(save: GameState): GameState {
  if (save.version > SAVE_VERSION) throw new Error('This save comes from a newer version of the game.');
  // (No migrations yet: version 1 is the first format.)
  return save;
}

export async function saveGame(state: GameState): Promise<void> {
  const now = Date.now();
  if (now - lastBackupMs > BACKUP_EVERY_MS) {
    const previous = await get(CURRENT, store);
    if (previous) {
      for (let i = BACKUPS.length - 1; i > 0; i--) {
        const older = await get(BACKUPS[i - 1], store);
        if (older) await set(BACKUPS[i], older, store);
      }
      await set(BACKUPS[0], previous, store);
    }
    lastBackupMs = now;
  }
  await set(CURRENT, state, store);
}

/** Loads the current save, falling back to the newest good backup. */
export async function loadGame(): Promise<{ state: GameState; fromBackup: boolean } | null> {
  for (const [i, key] of [CURRENT, ...BACKUPS].entries()) {
    try {
      const raw = await get(key, store);
      if (isValidSave(raw)) return { state: migrate(raw), fromBackup: i > 0 };
    } catch {
      // try the next one
    }
  }
  return null;
}

export async function deleteAllSaves(): Promise<void> {
  for (const key of [CURRENT, ...BACKUPS]) await del(key, store);
}

export function exportSave(state: GameState): void {
  const blob = new Blob([JSON.stringify(state)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ranch-manager-save-${new Date().toISOString().slice(0, 16).replace(':', '')}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readSaveFile(file: File): Promise<GameState> {
  const data = JSON.parse(await file.text());
  if (!isValidSave(data)) throw new Error('That file is not a Ranch Manager save.');
  return migrate(data);
}
