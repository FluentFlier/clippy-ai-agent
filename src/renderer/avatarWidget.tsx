import React, { useState, useEffect, useCallback } from 'react';
import { ChatWindow } from './chatWindow';
import { ResultsWindow } from './resultsWindow';
import { SettingsWindow } from './settingsWindow';
import { HistoryWindow } from './historyWindow';
import { TemplatesWindow } from './templatesWindow';
import { ANIMATIONS, Animation, EMPTY_ANIMATION, getRandomIdleAnimation } from './clippy-animations';

const WAIT_TIME = 6000;

export const AvatarWidget: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [resultsTitle, setResultsTitle] = useState('');
  const [resultsContent, setResultsContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animation, setAnimation] = useState<Animation>(EMPTY_ANIMATION);
  const [animationTimeoutId, setAnimationTimeoutId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<'welcome' | 'idle' | 'thinking'>('welcome');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const playAnimation = useCallback((key: string) => {
    if (ANIMATIONS[key]) {
      if (animationTimeoutId) {
        window.clearTimeout(animationTimeoutId);
      }

      setAnimation(ANIMATIONS[key]);
      setAnimationTimeoutId(
        window.setTimeout(() => {
          setAnimation(ANIMATIONS.Default);
        }, ANIMATIONS[key].length + 200)
      );
    }
  }, [animationTimeoutId]);

  const [mouseDownPos, setMouseDownPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseDownPos({ x: e.screenX, y: e.screenY });
    setHasMoved(false);
    setIsDragging(true);
    setDragOffset({
      x: e.screenX,
      y: e.screenY
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.screenX - dragOffset.x;
    const deltaY = e.screenY - dragOffset.y;
    
    // Check if mouse has moved significantly
    const totalMove = Math.abs(e.screenX - mouseDownPos.x) + Math.abs(e.screenY - mouseDownPos.y);
    if (totalMove > 3) {
      setHasMoved(true);
    }
    
    // Only move window if there's actual movement
    if (Math.abs(deltaX) > 0 || Math.abs(deltaY) > 0) {
      // Try multiple methods to move window
      if ((window as any).electron?.moveWindow) {
        (window as any).electron.moveWindow(deltaX, deltaY);
      } else if ((window as any).require) {
        // Use nodeIntegration directly
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('move-window', deltaX, deltaY);
      }
    }
    
    setDragOffset({
      x: e.screenX,
      y: e.screenY
    });
  }, [isDragging, dragOffset, mouseDownPos]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    // Don't reset hasMoved here - let onClick handle it
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleAction = async (action: string) => {
    setShowChat(false);
    
    // Handle special actions
    if (action === 'history') {
      setShowHistory(true);
      return;
    }
    
    if (action === 'templates') {
      setShowTemplates(true);
      return;
    }
    
    setIsLoading(true);
    setShowResults(true);
    
    if (action === 'summarize') {
      setResultsTitle('Document Summary');
      playAnimation('Searching');
      
      setTimeout(() => {
        playAnimation('Processing');
      }, 500);
      
      // Request summary from main process
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('agent-action', action);
        
        // Listen for response
        ipcRenderer.once('agent-response', (event: any, response: any) => {
          setResultsContent(response.result);
          setIsLoading(false);
          playAnimation('Congratulate');
        });
      }
    } else if (action === 'draft_email') {
      setResultsTitle('Email Draft');
      playAnimation('Writing');
      
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('agent-action', action);
        
        ipcRenderer.once('agent-response', (event: any, response: any) => {
          setResultsContent(response.result);
          setIsLoading(false);
          playAnimation('Congratulate');
        });
      }
    } else if (action === 'organize') {
      setResultsTitle('Task Organization');
      playAnimation('Thinking');
      
      if ((window as any).require) {
        const { ipcRenderer } = (window as any).require('electron');
        ipcRenderer.send('agent-action', action);
        
        ipcRenderer.once('agent-response', (event: any, response: any) => {
          setResultsContent(response.result);
          setIsLoading(false);
          playAnimation('Congratulate');
        });
      }
    }
  };

  useEffect(() => {
    const playRandomIdleAnimation = () => {
      if (status !== 'idle') return;

      const randomIdleAnimation = getRandomIdleAnimation();
      setAnimation(randomIdleAnimation);

      setAnimationTimeoutId(
        window.setTimeout(() => {
          setAnimation(ANIMATIONS.Default);
          setAnimationTimeoutId(
            window.setTimeout(playRandomIdleAnimation, WAIT_TIME)
          );
        }, randomIdleAnimation.length)
      );
    };

    if (status === 'welcome' && animation === EMPTY_ANIMATION) {
      setAnimation(ANIMATIONS.Show);
      setTimeout(() => {
        setStatus('idle');
      }, ANIMATIONS.Show.length + 200);
    } else if (status === 'idle') {
      if (!animationTimeoutId) {
        playRandomIdleAnimation();
      }
    }

    return () => {
      if (animationTimeoutId) {
        window.clearTimeout(animationTimeoutId);
      }
    };
  }, [status, animation, animationTimeoutId]);

  // Listen for agent events to trigger animations
  useEffect(() => {
    const handleAgentEvent = (event: any) => {
      if (event.detail?.action === 'show_dialog') {
        playAnimation('Alert');
        setShowChat(true);
      } else if (event.detail?.action === 'thinking') {
        playAnimation('Thinking');
      } else if (event.detail?.action === 'complete') {
        playAnimation('Congratulate');
      }
    };

    window.addEventListener('agent-event', handleAgentEvent);
    return () => window.removeEventListener('agent-event', handleAgentEvent);
  }, [playAnimation]);

  // Listen for open settings from tray
  useEffect(() => {
    if ((window as any).require) {
      const { ipcRenderer } = (window as any).require('electron');
      ipcRenderer.on('open-settings', () => {
        setShowSettings(true);
      });
    }
  }, []);Load saved character
      ipcRenderer.send('get-character');
      ipcRenderer.once('character-data', (event: any, charId: string) => {
        setCurrentCharacter(charId);
      });
    }
  }, []);

  return (
    <div style={{ position: 'relative', width: '400px', height: '400px' }}>
      {/* Clippy Character */}
      <div
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          console.log('Click event fired! hasMoved:', hasMoved);
          if (!hasMoved) {
            console.log('Opening chat...');
            playAnimation('Wave');
            setShowChat(prev => {
              console.log('Setting showChat to true, was:', prev);
              return true;
            });
          }
          // Reset hasMoved after click
          setTimeout(() => setHasMoved(false), 100);
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowSettings(true);
        }}
        style={{
          cursor: isDragging ? 'grabbing' : 'pointer',
          userSelect: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: 124,
          height: 93,
          zIndex: 10000
        }}
      >
        <img
          src={animation.src || ANIMATIONS.Default.src}
          draggable={false}
          alt="Clippy"
          style={{ width: 124, height: 93, pointerEvents: 'none' }}
        />
      </div>
      
      {/* Close/Minimize Button - Windows 98 style */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log('Close button clicked!');
          if ((window as any).require) {
            const { ipcRenderer } = (window as any).require('electron');
            ipcRenderer.send('quit-app');
          }
        }}
        style={{
          position: 'absolute',
          top: -2,
          left: 108,
          width: 16,
          height: 14,
          background: '#c0c0c0',
          border: '1px solid',
          borderColor: '#fff #000 #000 #fff',
          color: '#000',
          fontSize: 10,
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'MS Sans Serif, Arial, sans-serif',
          padding: 0,
          lineHeight: 1,
          zIndex: 10001
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.borderColor = '#000 #fff #fff #000';
          e.currentTarget.style.background = '#a0a0a0';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
          e.currentTarget.style.background = '#c0c0c0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#fff #000 #000 #fff';
          e.currentTarget.style.background = '#c0c0c0';
        }}
        title="Close Clippy"
      >
        ×
      </button>
      {showChat && (
        <ChatWindow
          onClose={() => setShowChat(false)}
          onAction={handleAction}
        />
      )}
      {/* Core modals only - streamlined for hackathon */}
      {showResults && (
        <ResultsWindow
          title={resultsTitle}
          content={resultsContent}
          isLoading={isLoading}
          onClose={() => {
            setShowResults(false);
            setResultsContent('');
          }}
        />
      )}
      {showSettings && (
        <SettingsWindow
          onClose={() => setShowSettings(false)}
        />
      )}
      {showHistory && (
        <HistoryWindow
          onClose={() => setShowHistory(false)}
          onOpen={(entry) => {
            setShowHistory(false);
            setResultsTitle(entry.action);
            setResultsContent(entry.result);
            setShowResults(true);
          }}
        />
      )}
      {showTemplates && (
        <TemplatesWindow
          onClose={() => setShowTemplates(false)}
          onSelect={(templateId) => {
            setShowTemplates(false);
            setIsLoading(true);
            setShowResults(true);
            setResultsTitle('Template Result');
            
            // Execute template
            if ((window as any).require) {
              const { ipcRenderer } = (window as any).require('electron');
              ipcRenderer.send('execute-template', templateId);
              ipcRenderer.once('template-result', (event: any, result: string) => {
                setResultsContent(result);
                setIsLoading(false);
                playAnimation('Congratulate');
              });
            }
          }}
        />
      )}
    </div>
  );
};
