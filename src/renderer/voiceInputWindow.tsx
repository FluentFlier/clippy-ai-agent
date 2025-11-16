import React, { useState, useEffect } from 'react';

interface VoiceInputWindowProps {
  onClose: () => void;
  onResult: (text: string) => void;
}

export const VoiceInputWindow: React.FC<VoiceInputWindowProps> = ({ onClose, onResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptPart + ' ';
          } else {
            interim += transcriptPart;
          }
        }

        if (final) {
          setTranscript(prev => prev + final);
        }
        setInterimTranscript(interim);
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (recognition) {
      setTranscript('');
      setInterimTranscript('');
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = () => {
    if (transcript.trim()) {
      onResult(transcript.trim());
      onClose();
    }
  };

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
        background: 'linear-gradient(135deg, #fff 0%, #f8f8f8 100%)',
        border: '2px solid #0078d4',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        fontFamily: 'Arial, sans-serif',
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
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: 14
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🎤</span>
          <span>Voice Input</span>
        </div>
        <button
          onClick={onClose}
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
            lineHeight: 1,
            borderRadius: 4,
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
        >
          ×
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {/* Microphone Button */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <button
            onClick={isListening ? stopListening : startListening}
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              border: `4px solid ${isListening ? '#ff4444' : '#0078d4'}`,
              background: isListening 
                ? 'linear-gradient(135deg, #ff6b6b 0%, #ff4444 100%)' 
                : 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)',
              color: 'white',
              fontSize: 48,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: isListening 
                ? '0 0 30px rgba(255,68,68,0.5), 0 4px 12px rgba(0,0,0,0.2)' 
                : '0 4px 12px rgba(0,120,212,0.3)',
              animation: isListening ? 'pulse 1.5s infinite' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isListening ? '🔴' : '🎤'}
          </button>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); }
              50% { transform: scale(1.05); }
            }
          `}</style>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 600, 
            color: isListening ? '#ff4444' : '#666',
            marginBottom: 8
          }}>
            {isListening ? '🔴 Listening...' : 'Click microphone to start'}
          </div>
          <div style={{ fontSize: 11, color: '#999' }}>
            {isListening ? 'Speak clearly into your microphone' : 'Press and speak your command'}
          </div>
        </div>

        {/* Transcript Display */}
        <div
          style={{
            minHeight: 100,
            maxHeight: 200,
            overflowY: 'auto',
            padding: 16,
            background: '#f8f8f8',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.6,
            color: '#333',
            marginBottom: 16
          }}
        >
          {transcript || interimTranscript ? (
            <>
              <span>{transcript}</span>
              <span style={{ color: '#999', fontStyle: 'italic' }}>{interimTranscript}</span>
            </>
          ) : (
            <div style={{ color: '#999', textAlign: 'center', paddingTop: 20 }}>
              Your speech will appear here...
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setTranscript('');
              setInterimTranscript('');
            }}
            disabled={!transcript}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(180deg, #fff 0%, #f5f5f5 100%)',
              color: '#666',
              border: '1px solid #d0d0d0',
              borderRadius: 6,
              cursor: transcript ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 500,
              opacity: transcript ? 1 : 0.5,
              transition: 'all 0.15s ease'
            }}
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={!transcript.trim()}
            style={{
              padding: '10px 24px',
              background: transcript.trim() 
                ? 'linear-gradient(180deg, #0078d4 0%, #005a9e 100%)' 
                : 'linear-gradient(180deg, #ccc 0%, #aaa 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              cursor: transcript.trim() ? 'pointer' : 'not-allowed',
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.15s ease',
              boxShadow: transcript.trim() ? '0 2px 8px rgba(0,120,212,0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (transcript.trim()) {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,120,212,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = transcript.trim() ? '0 2px 8px rgba(0,120,212,0.3)' : 'none';
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
