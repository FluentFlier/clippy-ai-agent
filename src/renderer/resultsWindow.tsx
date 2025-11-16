import React from 'react';

interface ResultsWindowProps {
  title: string;
  content: string;
  onClose: () => void;
  isLoading?: boolean;
}

export const ResultsWindow: React.FC<ResultsWindowProps> = ({ title, content, onClose, isLoading }) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  React.useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    alert('Copied to clipboard!');
  };

  const getBestVoice = (): SpeechSynthesisVoice | null => {
    if (voices.length === 0) return null;

    // Try to find high-quality voices in order of preference
    const preferences = [
      // macOS voices (best quality)
      'Samantha',
      'Alex',
      'Victoria',
      'Karen',
      // Windows voices
      'Microsoft David',
      'Microsoft Zira',
      'Microsoft Mark',
      // Google voices
      'Google US English',
      'Google UK English Female',
      // Fallback to any English voice
      'en-US',
      'en-GB'
    ];

    for (const pref of preferences) {
      const voice = voices.find(v => 
        v.name.includes(pref) || v.lang.includes(pref)
      );
      if (voice) return voice;
    }

    // Return first English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(content);
        
        // Use best available voice
        const bestVoice = getBestVoice();
        if (bestVoice) {
          utterance.voice = bestVoice;
        }
        
        // Optimize settings for clarity
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.0;
        utterance.volume = 0.9;
        
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      alert('Speech synthesis not supported in this browser');
    }
  };

  // Auto-speak if voice is enabled
  React.useEffect(() => {
    if (!isLoading && content) {
      // Check if voice is enabled in settings
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('get-settings');
        ipcRenderer.once('settings-data', (event: any, settings: any) => {
          if (settings.voiceEnabled) {
            setTimeout(() => handleSpeak(), 500);
          }
        });
      }
    }
  }, [isLoading, content]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '120px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 700,
        maxWidth: '95vw',
        maxHeight: 'calc(100vh - 140px)',
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#fff #000 #000 #fff',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.5)',
        fontFamily: 'MS Sans Serif, Arial, sans-serif',
        fontSize: 11,
        zIndex: 5001,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Title Bar - Windows 98 Style */}
      <div
        style={{
          background: 'linear-gradient(to right, #000080, #1084d0)',
          color: 'white',
          padding: '3px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 'bold',
          fontSize: 11
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingLeft: 2 }}>
          <span>📎</span>
          <span>{title}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: '#c0c0c0',
            border: '1px solid',
            borderColor: '#fff #000 #000 #fff',
            width: 16,
            height: 14,
            fontSize: 11,
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: 0,
            lineHeight: 1,
            fontFamily: 'inherit'
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.borderColor = '#000 #fff #fff #000';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
          }}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          padding: 12,
          margin: 4,
          overflowY: 'auto',
          flex: 1,
          fontSize: 11,
          lineHeight: 1.5,
          background: '#fff',
          color: '#000',
          border: '1px solid #808080'
        }}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#666' }}>
            <div 
              style={{ 
                fontSize: 48, 
                marginBottom: 16,
                animation: 'spin 2s linear infinite'
              }}
            >
              ⏳
            </div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>Processing your request...</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 8 }}>This may take a moment</div>
            <style>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : (
          <div style={{ 
            whiteSpace: 'pre-wrap', 
            fontFamily: 'system-ui, -apple-system, sans-serif',
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            maxWidth: '100%'
          }}>
            {content}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && (
        <div style={{ padding: 8, borderTop: '1px solid #808080', background: '#c0c0c0' }}>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <button
              onClick={handleSpeak}
              style={{
                padding: '5px 12px',
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#fff #000 #000 #fff',
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'inherit'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.borderColor = '#000 #fff #fff #000';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
              }}
            >
              {isSpeaking ? '■ Stop' : '▶ Speak'}
            </button>
            <button
              onClick={handleCopy}
              style={{
                padding: '5px 12px',
                background: '#c0c0c0',
                border: '2px solid',
                borderColor: '#fff #000 #000 #fff',
                cursor: 'pointer',
                fontSize: 11,
                fontFamily: 'inherit'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.borderColor = '#000 #fff #fff #000';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
              }}
            >
              Copy
            </button>
            <button
              onClick={onClose}
              style={{
                padding: '5px 16px',
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
      )}
    </div>
  );
};
