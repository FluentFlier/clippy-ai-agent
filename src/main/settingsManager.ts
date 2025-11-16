import Store from 'electron-store';

interface Settings {
  monitoringEnabled: boolean;
  documentThreshold: number;
  timeWindow: number;
  monitoredApps: string[];
  hotkey: string;
  autoStart: boolean;
  currentCharacter: string;
  theme: 'light' | 'dark' | 'retro';
  voiceEnabled: boolean;
  openaiApiKey?: string;
  anthropicApiKey?: string;
}

const defaultSettings: Settings = {
  monitoringEnabled: true,
  documentThreshold: 5,
  timeWindow: 10,
  monitoredApps: ['Word', 'Excel', 'PowerPoint', 'Notepad', 'Code', 'Chrome', 'Firefox'],
  hotkey: 'CommandOrControl+Shift+C',
  autoStart: false,
  currentCharacter: 'clippy',
  theme: 'retro',
  voiceEnabled: false
};

export class SettingsManager {
  private store: Store<Settings>;

  constructor() {
    this.store = new Store<Settings>({
      defaults: defaultSettings
    });
  }

  getSettings(): Settings {
    return this.store.store;
  }

  getSetting<K extends keyof Settings>(key: K): Settings[K] {
    return this.store.get(key);
  }

  setSetting<K extends keyof Settings>(key: K, value: Settings[K]): void {
    this.store.set(key, value);
  }

  setSettings(settings: Partial<Settings>): void {
    Object.entries(settings).forEach(([key, value]) => {
      this.store.set(key as keyof Settings, value);
    });
  }

  resetSettings(): void {
    this.store.clear();
  }
}
