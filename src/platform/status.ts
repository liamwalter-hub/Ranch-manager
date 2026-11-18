import { useEffect, useState } from 'react';

export function useOnline(): boolean {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

export function useInstalled(): boolean {
  const query = '(display-mode: standalone)';
  const [installed, setInstalled] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setInstalled(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return installed;
}

/** Ask Chrome to keep our saved data even when the phone is low on space. */
export function usePersistentStorage(): boolean | null {
  const [persisted, setPersisted] = useState<boolean | null>(null);
  useEffect(() => {
    if (!navigator.storage?.persist) return;
    navigator.storage.persist().then(setPersisted).catch(() => setPersisted(false));
  }, []);
  return persisted;
}

