import React from 'react';

interface DialogBubbleProps {
  message: string;
  onClose: () => void;
  onAccept?: () => void;
}

export const DialogBubble: React.FC<DialogBubbleProps> = ({ message, onClose, onAccept }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 100,
        left: 0,
        background: '#fffef0',
        border: '2px solid #000',
        borderRadius: 8,
        padding: 12,
        minWidth: 200,
        maxWidth: 300,
        boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
        fontFamily: 'Arial, sans-serif',
        fontSize: 12,
        zIndex: 1000
      }}
    >
      <p style={{ margin: '0 0 10px 0', lineHeight: 1.4 }}>{message}</p>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            onAccept?.();
            onClose();
          }}
          style={{
            padding: '4px 12px',
            background: '#fff',
            border: '1px solid #000',
            borderRadius: 0,
            cursor: 'pointer',
            fontSize: 11,
            fontWeight: 'bold'
          }}
        >
          Yes
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '4px 12px',
            background: '#fff',
            border: '1px solid #000',
            borderRadius: 0,
            cursor: 'pointer',
            fontSize: 11
          }}
        >
          No
        </button>
      </div>
    </div>
  );
};
