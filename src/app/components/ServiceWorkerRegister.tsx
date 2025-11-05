"use client";

import { useEffect, useState } from "react";

export default function ServiceWorkerRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('Service Worker registered:', reg.scope))
          .catch(err => console.error('SW registration failed:', err));
      });
    }

    // Handle install prompt
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult: any) => {
      console.log("User choice:", choiceResult.outcome);
      setDeferredPrompt(null);
    });
  };

  return (
    <>
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 fixed bottom-4 right-4 z-50 sm:relative sm:bottom-auto sm:right-auto w-full max-w-md mx-auto"
        >
          Install App
        </button>
      )}
    </>
  );
}
