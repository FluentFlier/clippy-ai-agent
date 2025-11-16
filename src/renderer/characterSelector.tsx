import React from 'react';

interface Character {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

const CHARACTERS: Character[] = [
  { id: 'clippy', name: 'Clippy', emoji: '📎', description: 'The classic assistant' },
  { id: 'merlin', name: 'Merlin', emoji: '🧙', description: 'Wise wizard for research' },
  { id: 'rover', name: 'Rover', emoji: '🐕', description: 'Friendly helper dog' },
  { id: 'f1', name: 'F1', emoji: '🤖', description: 'Tech-savvy robot' }
];

interface CharacterSelectorProps {
  currentCharacter: string;
  onSelect: (characterId: string) => void;
  onClose: () => void;
}

export const CharacterSelector: React.FC<CharacterSelectorProps> = ({ 
  currentCharacter, 
  onSelect, 
  onClose 
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 550,
        maxWidth: '95vw',
        maxHeight: 'calc(100vh - 140px)',
        background: '#c0c0c0',
        border: '2px solid #fff',
        borderRightColor: '#000',
        borderBottomColor: '#000',
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
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
          background: 'linear-gradient(180deg, #0078d4 0%, #005a9e 100%)',
          color: 'white',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: 13
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🎭</span>
          <span>Choose Your Assistant</span>
        </div>
        <button
          onClick={onClose}
          title="Close"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'white',
            width: 24,
            height: 24,
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0,
            borderRadius: 4,
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ×
        </button>
      </div>

      {/* Character Grid */}
      <div style={{ padding: 12, background: '#c0c0c0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {CHARACTERS.map(char => (
            <button
              key={char.id}
              onClick={() => {
                onSelect(char.id);
                onClose();
              }}
              style={{
                padding: 16,
                border: currentCharacter === char.id ? '3px solid #000080' : '2px solid',
                borderColor: currentCharacter === char.id ? '#000080' : '#fff #808080 #808080 #fff',
                background: currentCharacter === char.id ? '#fff' : '#c0c0c0',
                cursor: 'pointer',
                textAlign: 'center',
                fontFamily: 'inherit'
              }}
              onMouseDown={(e) => {
                if (currentCharacter !== char.id) {
                  e.currentTarget.style.borderColor = '#808080 #fff #fff #808080';
                }
              }}
              onMouseUp={(e) => {
                if (currentCharacter !== char.id) {
                  e.currentTarget.style.borderColor = '#fff #808080 #808080 #fff';
                }
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>
                {char.emoji}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: 4, fontSize: 11 }}>
                {char.name}
              </div>
              <div style={{ fontSize: 10, color: '#000' }}>
                {char.description}
              </div>
              {currentCharacter === char.id && (
                <div style={{ 
                  marginTop: 8, 
                  fontSize: 10, 
                  color: '#000080', 
                  fontWeight: 'bold'
                }}>
                  ● ACTIVE
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: 8, borderTop: '1px solid #808080', background: '#c0c0c0' }}>
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '6px',
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: '#fff #000 #000 #fff',
            cursor: 'pointer',
            fontSize: 11,
            fontFamily: 'inherit',
            fontWeight: 'bold'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.borderColor = '#000 #fff #fff #000';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
