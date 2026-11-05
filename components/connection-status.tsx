'use client';

import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export function ConnectionStatus() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  if (!offline) return null;
  return <div role="status" className="flex items-center justify-center gap-2 border-b border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 print:hidden">
    <WifiOff className="h-4 w-4 shrink-0" aria-hidden="true" />
    <span>You are offline. Changes cannot be saved until you reconnect.</span>
  </div>;
}
