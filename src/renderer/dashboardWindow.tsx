import React, { useState, useEffect } from 'react';

interface DashboardWindowProps {
  onClose: () => void;
}

interface Analytics {
  documentsOpened: number;
  summariesGenerated: number;
  emailsDrafted: number;
  tasksOrganized: number;
  mostUsedApp: string;
  totalTimeTracked: number;
}

export const DashboardWindow: React.FC<DashboardWindowProps> = ({ onClose }) => {
  const [analytics, setAnalytics] = useState<Analytics>({
    documentsOpened: 0,
    summariesGenerated: 0,
    emailsDrafted: 0,
    tasksOrganized: 0,
    mostUsedApp: 'Unknown',
    totalTimeTracked: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('get-analytics');
      ipcRenderer.once('analytics-data', (event: any, data: any) => {
        // Process analytics data
        const processed = processAnalytics(data);
        setAnalytics(processed);
      });
    }
  };

  const processAnalytics = (data: any[]): Analytics => {
    const summary: Analytics = {
      documentsOpened: 0,
      summariesGenerated: 0,
      emailsDrafted: 0,
      tasksOrganized: 0,
      mostUsedApp: 'Unknown',
      totalTimeTracked: 0
    };

    const appCounts: Record<string, number> = {};

    data.forEach(event => {
      const eventData = JSON.parse(event.data || '{}');
      
      switch (event.event_type) {
        case 'document_opened':
          summary.documentsOpened++;
          if (eventData.app) {
            appCounts[eventData.app] = (appCounts[eventData.app] || 0) + 1;
          }
          break;
        case 'summary_generated':
          summary.summariesGenerated++;
          break;
        case 'email_drafted':
          summary.emailsDrafted++;
          break;
        case 'tasks_organized':
          summary.tasksOrganized++;
          break;
      }
    });

    // Find most used app
    let maxCount = 0;
    Object.entries(appCounts).forEach(([app, count]) => {
      if (count > maxCount) {
        maxCount = count;
        summary.mostUsedApp = app;
      }
    });

    return summary;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 650,
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
          <span>📊</span>
          <span>Productivity Dashboard</span>
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

      {/* Content */}
      <div style={{ padding: 16, background: '#fff', flex: 1, overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: 13 }}>Last 7 Days</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <StatCard
            icon="📄"
            label="Documents Opened"
            value={analytics.documentsOpened}
          />
          <StatCard
            icon="📝"
            label="Summaries Generated"
            value={analytics.summariesGenerated}
          />
          <StatCard
            icon="✉️"
            label="Emails Drafted"
            value={analytics.emailsDrafted}
          />
          <StatCard
            icon="📋"
            label="Tasks Organized"
            value={analytics.tasksOrganized}
          />
        </div>

        <div style={{ marginTop: 16, padding: 12, background: '#f0f0f0', border: '1px solid #ccc' }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Most Used App</div>
          <div style={{ fontSize: 14 }}>{analytics.mostUsedApp}</div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 12,
          borderTop: '1px solid #fff',
          display: 'flex',
          justifyContent: 'flex-end',
          background: '#c0c0c0'
        }}
      >
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
          Close
        </button>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: string; label: string; value: number }> = ({ icon, label, value }) => (
  <div
    style={{
      padding: 12,
      border: '2px solid',
      borderColor: '#fff #808080 #808080 #fff',
      background: '#f9f9f9',
      textAlign: 'center'
    }}
  >
    <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>{value}</div>
    <div style={{ fontSize: 10, color: '#666' }}>{label}</div>
  </div>
);
