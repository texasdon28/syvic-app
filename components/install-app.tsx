'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from './ui/button';

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  useEffect(() => {
    const capture = (event: Event) => {
      if (window.matchMedia('(display-mode: standalone)').matches) return;
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const installed = () => setPrompt(null);
    window.addEventListener('beforeinstallprompt', capture);
    window.addEventListener('appinstalled', installed);
    return () => {
      window.removeEventListener('beforeinstallprompt', capture);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);
  if (!prompt) return null;
  return <Button type="button" variant="outline" className="w-full justify-start" onClick={async () => {
    try { await prompt.prompt(); await prompt.userChoice; } finally { setPrompt(null); }
  }}><Download className="mr-2 h-4 w-4" aria-hidden="true" />Install SYVIC</Button>;
}
