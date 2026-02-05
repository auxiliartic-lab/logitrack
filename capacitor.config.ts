import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quimicoscauca.logitrack',
  appName: 'LogiTrack Pro',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
