import React, { useState, useEffect } from 'react';

interface Settings {
  monitoringEnabled: boolean;
  documentThreshold: number;
  timeWindow: number;
  monitoredApps: string[];
  hotkey: string;
  autoStart: boolean;
  theme: 'light' | 'dark' | 'retro';
  voiceEnabled: boolean;
}

interface SettingsWindowProps {
  onClose: () => void;
}

export const SettingsWindow: React.FC<SettingsWindowProps> = ({ onClose }) => {
  const [settings, setSettings] = useState<Settings>({
    monitoringEnabled: true,
    documentThreshold: 5,
    timeWindow: 10,
    monitoredApps: ['Word', 'Excel', 'PowerPoint', 'Notepad', 'Code', 'Chrome', 'Firefox'],
    hotkey: 'CommandOrControl+Shift+C',
    autoStart: false,
    theme: 'retro',
    voiceEnabled: false
  });

  const [activeTab, setActiveTab] = useState<'general' | 'monitoring' | 'apps'>('general');

  useEffect(() => {
    // Load settings from main process
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('get-settings');
      ipcRenderer.once('settings-data', (event: any, data: Settings) => {
        if (data) setSettings(data);
      });
    }
  }, []);

  const handleSave = () => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('save-settings', settings);
    }
    onClose();
  };

  const handleAppToggle = (app: string) => {
    setSettings(prev => ({
      ...prev,
      monitoredApps: prev.monitoredApps.includes(app)
        ? prev.monitoredApps.filter(a => a !== app)
        : [...prev.monitoredApps, app]
    }));
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600,
        maxWidth: '95vw',
        maxHeight: 'calc(100vh - 140px)',
        background: '#c0c0c0',
        border: '2px solid #fff',
        borderRightColor: '#000',
        borderBottomColor: '#000',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.3)',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        fontSize: 11,
        zIndex: 5001,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Title Bar */}
      <div
        style={{
          background: 'linear-gradient(to right, #000080, #1084d0)',
          color: 'white',
          padding: '3px 6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>⚙️</span>
          <span>Clippy Settings</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#c0c0c0',
            border: '1px solid #fff',
            borderRightColor: '#000',
            borderBottomColor: '#000',
            width: 16,
            height: 16,
            fontSize: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ×
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #808080', background: '#c0c0c0' }}>
        {(['general', 'monitoring', 'apps'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 16px',
              background: activeTab === tab ? '#fff' : '#c0c0c0',
              border: '2px solid',
              borderColor: activeTab === tab ? '#fff #000 #fff #fff' : '#fff #808080 #808080 #fff',
              borderBottom: activeTab === tab ? 'none' : '2px solid #808080',
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: 'inherit',
              marginBottom: activeTab === tab ? -2 : 0
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 16, background: '#fff', flex: 1, overflowY: 'auto' }}>
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.autoStart}
                  onChange={(e) => setSettings({ ...settings, autoStart: e.target.checked })}
                />
                <span>Launch Clippy at startup</span>
              </label>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
                Toggle Hotkey
              </label>
              <input
                type="text"
                value={settings.hotkey}
                onChange={(e) => setSettings({ ...settings, hotkey: e.target.value })}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  border: '1px solid #808080',
                  fontFamily: 'inherit',
                  fontSize: 11
                }}
                placeholder="e.g., CommandOrControl+Shift+C"
              />
              <div style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                Press this key combination to show/hide Clippy
              </div>
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.monitoringEnabled}
                  onChange={(e) => setSettings({ ...settings, monitoringEnabled: e.target.checked })}
                />
                <span>Enable activity monitoring</span>
              </label>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4, marginLeft: 24 }}>
                Monitor your work and offer proactive assistance
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
                Document Threshold
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  min="3"
                  max="10"
                  value={settings.documentThreshold}
                  onChange={(e) => setSettings({ ...settings, documentThreshold: parseInt(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: 30, textAlign: 'right' }}>{settings.documentThreshold}</span>
              </div>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                Trigger alert after opening this many documents
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
                Time Window (minutes)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={settings.timeWindow}
                  onChange={(e) => setSettings({ ...settings, timeWindow: parseInt(e.target.value) })}
                  style={{ flex: 1 }}
                />
                <span style={{ minWidth: 30, textAlign: 'right' }}>{settings.timeWindow}</span>
              </div>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4 }}>
                Documents must be opened within this time period
              </div>
            </div>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={(e) => setSettings({ ...settings, voiceEnabled: e.target.checked })}
                />
                <span>Enable voice responses</span>
              </label>
              <div style={{ fontSize: 10, color: '#666', marginTop: 4, marginLeft: 24 }}>
                Clippy will speak responses out loud
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>
                Theme
              </label>
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '4px 6px',
                  border: '1px solid #808080',
                  fontFamily: 'inherit',
                  fontSize: 11
                }}
              >
                <option value="retro">Retro (Windows 98)</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>
        )}



        {activeTab === 'apps' && (
          <div>
            <div style={{ marginBottom: 12, fontWeight: 'bold' }}>
              Monitor these applications:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Word', 'Excel', 'PowerPoint', 'Notepad', 'Code', 'Chrome', 'Firefox', 'Safari', 'Slack', 'Teams'].map(app => (
                <label key={app} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={settings.monitoredApps.includes(app)}
                    onChange={() => handleAppToggle(app)}
                  />
                  <span>{app}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 12,
          borderTop: '1px solid #fff',
          display: 'flex',
          gap: 8,
          justifyContent: 'flex-end',
          background: '#c0c0c0'
        }}
      >
        <button
          onClick={handleSave}
          style={{
            padding: '6px 20px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #000 #000 #fff',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'inherit',
            fontWeight: 'bold'
          }}
        >
          Save
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '6px 20px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #000 #000 #fff',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'inherit'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
