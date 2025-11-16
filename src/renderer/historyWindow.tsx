import React, { useState, useEffect } from 'react';

interface HistoryEntry {
  id: number;
  action: string;
  prompt: string;
  result: string;
  timestamp: number;
}

interface HistoryWindowProps {
  onClose: () => void;
  onOpen: (entry: HistoryEntry) => void;
}

export const HistoryWindow: React.FC<HistoryWindowProps> = ({ onClose, onOpen }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchHistory(searchQuery);
    } else {
      setFilteredHistory(history);
    }
  }, [searchQuery, history]);

  const loadHistory = () => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('get-history');
      ipcRenderer.once('history-data', (event: any, data: HistoryEntry[]) => {
        setHistory(data);
        setFilteredHistory(data);
      });
    }
  };

  const searchHistory = (query: string) => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('search-history', query);
      ipcRenderer.once('history-search-results', (event: any, data: HistoryEntry[]) => {
        setFilteredHistory(data);
      });
    }
  };

  const deleteEntry = (id: number) => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.send('delete-history', id);
      setHistory(prev => prev.filter(e => e.id !== id));
    }
  };

  const clearAll = () => {
    if (confirm('Clear all history?')) {
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('clear-history');
        setHistory([]);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'summarize': return '📄';
      case 'draft_email': return '✉️';
      case 'organize': return '📋';
      default: return '📎';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 750,
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
          <span>📚</span>
          <span>History</span>
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

      {/* Search Bar */}
      <div style={{ padding: 8, borderBottom: '1px solid #808080' }}>
        <input
          type="text"
          placeholder="Search history..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '4px 6px',
            border: '1px solid #808080',
            fontFamily: 'inherit',
            fontSize: 11
          }}
        />
      </div>

      {/* History List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          background: '#fff',
          padding: 8
        }}
      >
        {filteredHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
            No history found
          </div>
        ) : (
          filteredHistory.map(entry => (
            <div
              key={entry.id}
              style={{
                marginBottom: 8,
                padding: 8,
                border: '1px solid #ccc',
                background: '#f9f9f9',
                cursor: 'pointer'
              }}
              onClick={() => onOpen(entry)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: 'bold' }}>
                  {getActionIcon(entry.action)} {entry.action}
                </div>
                <div style={{ fontSize: 10, color: '#666' }}>
                  {formatDate(entry.timestamp)}
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#666', marginBottom: 4 }}>
                {entry.result.substring(0, 100)}...
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteEntry(entry.id);
                }}
                style={{
                  padding: '2px 8px',
                  fontSize: 10,
                  background: '#c0c0c0',
                  border: '1px solid #808080',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: 8,
          borderTop: '1px solid #fff',
          display: 'flex',
          gap: 8,
          justifyContent: 'space-between',
          background: '#c0c0c0'
        }}
      >
        <button
          onClick={clearAll}
          style={{
            padding: '6px 12px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #000 #000 #fff',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'inherit'
          }}
        >
          Clear All
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '6px 12px',
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
