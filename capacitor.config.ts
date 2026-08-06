import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.phoenix.finance',
  appName: 'Phoenix Finance',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
