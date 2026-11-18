import { useRegisterSW } from 'virtual:pwa-register/react';

/** Shows a banner when a new version of the game has been downloaded. */
export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW();

  if (needRefresh) {
    return (
      <button className="banner" onClick={() => updateServiceWorker(true)}>
        New version available – tap to reload
      </button>
    );
  }
  if (offlineReady) {
    return (
      <button className="banner banner--quiet" onClick={() => setOfflineReady(false)}>
        Ready to play offline ✓
      </button>
    );
  }
  return null;
}
