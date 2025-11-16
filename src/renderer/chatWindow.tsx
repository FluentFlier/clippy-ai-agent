import React from 'react';

interface ChatWindowProps {
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ onClose, onAction }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 0,
        width: 200,
        maxHeight: 280,
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #000 #000 #fff',
        boxShadow: '3px 3px 0 rgba(0,0,0,0.3)',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        fontSize: 11,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Title Bar - Windows 98 Style */}
      <div
        style={{
          background: 'linear-gradient(to right, #000080, #1084d0)',
          color: 'white',
          padding: '2px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: 11
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>📎</span>
          <span>Clippy</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#c0c0c0',
            border: '1px solid',
            borderColor: '#fff #000 #000 #fff',
            width: 16,
            height: 14,
            fontSize: 10,
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1
          }}
        >
          ×
        </button>
      </div>

      {/* Menu Items - Scrollable */}
      <div style={{ padding: 4, overflowY: 'auto', flex: 1 }}>
        <MenuButton onClick={() => { onAction('summarize'); onClose(); }} icon="📄">
          Summarize
        </MenuButton>
        <MenuButton onClick={() => { onAction('draft_email'); onClose(); }} icon="✉️">
          Draft Email
        </MenuButton>
        <MenuButton onClick={() => { onAction('organize'); onClose(); }} icon="📋">
          Organize
        </MenuButton>
        
        <div style={{ height: 2, background: '#808080', margin: '4px 2px', borderTop: '1px solid #fff' }} />
        
        <MenuButton onClick={() => { onAction('templates'); onClose(); }} icon="⚡">
          Templates
        </MenuButton>
        <MenuButton onClick={() => { onAction('history'); onClose(); }} icon="📚">
          History
        </MenuButton>
      </div>
    </div>
  );
};

const MenuButton: React.FC<{ onClick: () => void; icon: string; children: React.ReactNode }> = ({ onClick, icon, children }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '6px 8px',
      marginBottom: 2,
      background: '#c0c0c0',
      border: '2px solid',
      borderColor: '#fff #000 #000 #fff',
      cursor: 'pointer',
      fontSize: 11,
      textAlign: 'left',
      fontFamily: 'inherit',
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = '#000080';
      e.currentTarget.style.color = '#fff';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = '#c0c0c0';
      e.currentTarget.style.color = '#000';
    }}
    onMouseDown={(e) => {
      e.currentTarget.style.borderColor = '#000 #fff #fff #000';
    }}
    onMouseUp={(e) => {
      e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
    }}
  >
    <span style={{ fontSize: 16 }}>{icon}</span>
    <span>{children}</span>
  </button>
);
