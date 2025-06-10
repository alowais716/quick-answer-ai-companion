
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.daa8037cd4164c5380daf5ae2a4f45c1',
  appName: 'quick-answer-ai-companion',
  webDir: 'dist',
  server: {
    url: 'https://daa8037c-d416-4c53-80da-f5ae2a4f45c1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  bundledWebRuntime: false
};

export default config;
