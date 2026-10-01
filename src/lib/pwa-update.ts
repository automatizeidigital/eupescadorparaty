export function setupPwaUpdate(onUpdateAvailable: () => void) {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  const register = () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                onUpdateAvailable();
              }
            });
          }
        });
      })
      .catch((error) => {
        // Falha no registro não deve quebrar a aplicação (ex.: SW ausente em dev).
        console.warn('Service Worker não registrado:', error?.message ?? error);
      });
  };

  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}
