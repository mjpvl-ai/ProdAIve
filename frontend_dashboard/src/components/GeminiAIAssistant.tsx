import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, TextField, List, ListItem, Avatar, Chip, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { keyframes } from '@mui/system';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  chartData?: any[];
  type?: 'chat' | 'plan';
}

interface Position {
  width: number;
  height: number;
  top: number;
  left: number;
}

interface GeminiAIAssistantProps {
  onTriggerAlert: (nodeId: string) => void;
  position: Position;
  onPositionChange: (position: Position) => void;
  isFullScreen: boolean;
  onToggleFullScreen: () => void;
}

interface Alert {
  message: string;
}

type AssistantMode = 'chat' | 'voice';
type ConversationState = 'idle' | 'listening' | 'speaking' | 'alerting';

const GeminiAIAssistant: React.FC<GeminiAIAssistantProps> = ({ onTriggerAlert, position, onPositionChange, isFullScreen, onToggleFullScreen }) => {
  const theme = useTheme();
  const [mode, setMode] = useState<AssistantMode>('voice');
  const [conversationState, setConversationState] = useState<ConversationState>('idle');

  // State for Chat Mode
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Hello! How can I assist you with the kiln operations today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null);

  const dragInfo = useRef<{ type: string; startX: number; startY: number; startWidth: number; startHeight: number; startTop: number; startLeft: number } | null>(null);
  const MIN_WIDTH = 300;
  const MIN_HEIGHT = 400;

  // --- Animation Keyframes for the Blob ---
  const morph = keyframes`
    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  `;

  const rotate = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  `;

  useEffect(() => {
    if (mode === 'chat' && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mode]);

  // --- Dragging and Resizing Logic ---
  const handleMouseDown = (e: React.MouseEvent, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    dragInfo.current = {
      type,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: position.width,
      startHeight: position.height,
      startTop: position.top,
      startLeft: position.left,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragInfo.current) return;

    const dx = e.clientX - dragInfo.current.startX;
    const dy = e.clientY - dragInfo.current.startY;

    let newPos = { ...position };

    if (dragInfo.current.type === 'drag') {
      newPos.top = dragInfo.current.startTop + dy;
      newPos.left = dragInfo.current.startLeft + dx;
    } else {
      // Resizing logic
      if (dragInfo.current.type.includes('right')) {
        newPos.width = Math.max(MIN_WIDTH, dragInfo.current.startWidth + dx);
      }
      if (dragInfo.current.type.includes('left')) {
        const newWidth = Math.max(MIN_WIDTH, dragInfo.current.startWidth - dx);
        if (newWidth > MIN_WIDTH) {
          newPos.width = newWidth;
          newPos.left = dragInfo.current.startLeft + dx;
        }
      }
      if (dragInfo.current.type.includes('bottom')) {
        newPos.height = Math.max(MIN_HEIGHT, dragInfo.current.startHeight + dy);
      }
      if (dragInfo.current.type.includes('top')) {
        const newHeight = Math.max(MIN_HEIGHT, dragInfo.current.startHeight - dy);
        if (newHeight > MIN_HEIGHT) {
          newPos.height = newHeight;
          newPos.top = dragInfo.current.startTop + dy;
        }
      }
    }

    // Boundary checks
    newPos.top = Math.max(0, newPos.top);
    newPos.left = Math.max(0, newPos.left);
    if (newPos.left + newPos.width > window.innerWidth) {
      newPos.left = window.innerWidth - newPos.width;
    }
    if (newPos.top + newPos.height > window.innerHeight) {
      newPos.top = window.innerHeight - newPos.height;
    }

    onPositionChange(newPos);
  };

  const handleMouseUp = () => {
    dragInfo.current = null;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  // Cleanup event listeners on component unmount
  useEffect(() => {
    const mouseUpHandler = () => handleMouseUp();
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', mouseUpHandler);
    };
  }, []);

  // --- Alert Simulation with Recorded Voice ---
  useEffect(() => {
    // Preload the alert audio file.
    // IMPORTANT: Place your recorded 'alert-voice.mp3' file in the `public/assets/` directory.
    const alertAudio = new Audio('/assets/alert-voice.mp3');
    alertAudio.preload = 'auto';

    const alertTimeout = setTimeout(() => {
      // This will now call the parent component to handle the alert logic
      // We are targeting node '4' which is the 'failed' node in FlowDisplay
      onTriggerAlert('4');
      
      alertAudio.play().catch(error => console.error("Error playing audio:", error));

    }, 10000); // Trigger alert after 10 seconds
    return () => {
      clearTimeout(alertTimeout);
      alertAudio.pause();
      alertAudio.currentTime = 0;
    };
  }, [onTriggerAlert]);

  const handleModeToggle = () => {
    setMode(current => (current === 'chat' ? 'voice' : 'chat'));
  };

  const handleApprove = () => {
    console.log('Recommendation approved.');
    setActiveAlert({ message: 'Action approved and executed.' });
    setConversationState('speaking'); // Give feedback
    setTimeout(() => {
      setConversationState('idle');
      setActiveAlert(null);
    }, 3000);
  };

  const handleDeny = () => {
    console.log('Recommendation denied.');
    setActiveAlert({ message: 'Action denied.' });
    setConversationState('speaking');
    setTimeout(() => {
      setConversationState('idle');
      setActiveAlert(null);
    }, 3000);
  };


  // --- Voice Mode Logic ---

  const handleMicClick = () => {
    if (conversationState === 'idle' || conversationState === 'alerting') {
      setConversationState('listening');
      setActiveAlert(null); // Clear alert when user interacts
      // Simulate listening then speaking
      setTimeout(() => {
        setConversationState('speaking');
        setTimeout(() => setConversationState('idle'), 4000); // Back to idle
      }, 3000);
    } else {
      setActiveAlert(null);
      setConversationState('idle');
    }
  };

  const getStatusText = () => {
    switch (conversationState) {
      case 'listening': return 'Listening...';
      case 'speaking': return 'Speaking...';
      case 'alerting': return activeAlert?.message || 'Alert!';
      case 'idle':
      default:
        return 'Click the mic to start';
    }
  };

  // --- Chat Mode Logic ---

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    if (newUserMessage.text.toLowerCase().includes('plan operations')) {
      const planSteps = [
        'Analyzing current kiln data...',
        'Identifying optimal temperature adjustments...',
        'Calculating fuel efficiency improvements...',
        'Generating new operational parameters...',
        'Plan operations complete. Applying changes.',
      ];

      let delay = 1000;
      planSteps.forEach((step, index) => {
        setTimeout(() => {
          const planMessage: Message = { id: Date.now() + index, sender: 'ai', text: step, type: 'plan' };
          setMessages(prev => [...prev, planMessage]);
          if (index === planSteps.length - 1) {
            setIsTyping(false);
          }
        }, delay);
        delay += 1500;
      });

    } else {
      setTimeout(() => {
        let aiResponseText = `I am sorry, I cannot process the request: "${newUserMessage.text}".`;
        let chartData = undefined;

        if (newUserMessage.text.toLowerCase().includes('energy')) {
          aiResponseText = 'Here is a summary of today\'s energy consumption. It looks stable.';
          chartData = Array.from({ length: 8 }, (_, i) => ({
            time: `${String(i * 3).padStart(2, '0')}:00`,
            consumption: 100 + Math.sin(i) * 20 + Math.random() * 10,
          }));
        } else if (newUserMessage.text.toLowerCase().includes('temperature')) {
          aiResponseText = 'The recent temperature spike was due to a temporary fuel pressure fluctuation. The system has already adjusted, and temperatures are now stable.';
        } else if (newUserMessage.text.toLowerCase().includes('quality')) {
          aiResponseText = 'The predicted quality score for the next batch is 94.5%, which is well within the optimal range.';
        }

        const aiResponse: Message = { id: Date.now() + 1, sender: 'ai', text: aiResponseText, chartData };
        setIsTyping(false);
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  const suggestionChips = [
    'Summarize energy usage',
    'Any temperature anomalies?',
    'Predict clinker quality',
    'Show plan operations',
  ];

  return (
    <Paper
      elevation={isFullScreen ? 0 : 8}
      sx={{
        height: '100%',
        position: 'relative', // Needed for the resizer handle
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.palette.background.default,
        borderRadius: isFullScreen ? 0 : 2,
        overflow: 'hidden',
      }}>
      {!isFullScreen && (
        <>
          {/* Resizer Handles */}
          {['top', 'bottom', 'left', 'right', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(dir => {
            const cursorMap: { [key: string]: string } = { top: 'ns-resize', bottom: 'ns-resize', left: 'ew-resize', right: 'ew-resize', topLeft: 'nwse-resize', topRight: 'nesw-resize', bottomLeft: 'nesw-resize', bottomRight: 'nwse-resize' };
            return (
              <Box
                key={dir}
                onMouseDown={(e) => handleMouseDown(e, dir)}
                sx={{
                  position: 'absolute',
                  top: dir.includes('top') ? '-4px' : 'auto',
                  bottom: dir.includes('bottom') ? '-4px' : 'auto',
                  left: dir.includes('left') ? '-4px' : 'auto',
                  right: dir.includes('right') ? '-4px' : 'auto',
                  width: dir.includes('top') || dir.includes('bottom') ? '100%' : '8px',
                  height: dir.includes('left') || dir.includes('right') ? '100%' : '8px',
                  cursor: cursorMap[dir],
                  zIndex: 10,
                }}
              />
            );
          })}
        </>
      )}
      <Box
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
        sx={{
          p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center',
          cursor: isFullScreen ? 'default' : 'move',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
          <SmartToyOutlinedIcon sx={{ mr: 1.5, color: theme.palette.primary.main, flexShrink: 0 }} />
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>
            Conversational Assistant
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onMouseDown={e => e.stopPropagation()} onClick={handleModeToggle} title={mode === 'chat' ? 'Switch to Voice Mode' : 'Switch to Chat Mode'}>
          {mode === 'chat' ? <MicIcon /> : <ChatIcon />}
        </IconButton>
        <IconButton onMouseDown={e => e.stopPropagation()} onClick={onToggleFullScreen} title={isFullScreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
          {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
        </IconButton>
      </Box>

      {mode === 'voice' ? (
        <>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2, position: 'relative' }}>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    position: 'relative',
                    animation: conversationState !== 'idle' ? `${rotate} 15s linear infinite` : 'none',
                    '&::before': conversationState !== 'alerting' ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: `radial-gradient(circle, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`, // Original blob
                      opacity: 0.8,
                      animation: `${morph} 8s ease-in-out infinite`,
                      transition: 'transform 0.5s ease',
                      transform: conversationState !== 'idle' ? 'scale(1.1)' : 'scale(1)',
                    } : null,
                  }}
                />
                {conversationState === 'alerting' && (
                  <Box sx={{
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${theme.palette.error.dark} 0%, ${theme.palette.error.light} 100%)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: `0 0 20px ${theme.palette.error.main}`,
                  }}>
                    <WarningAmberIcon sx={{ fontSize: 100, color: 'white' }} />
                  </Box>
                )}
              </motion.div>
            </AnimatePresence>
          </Box>
          <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', textAlign: 'center' }}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, height: '24px' }}>
              {getStatusText()}
            </Typography>
            {conversationState === 'alerting' ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={handleApprove} sx={{ borderRadius: '20px', px: 3, py: 1 }}>Approve</Button>
                <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={handleDeny} sx={{ borderRadius: '20px', px: 3, py: 1 }}>Deny</Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <IconButton
                  color={conversationState === 'idle' ? 'primary' : 'error'}
                  onClick={handleMicClick}
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: conversationState === 'idle' ? 'primary.main' : 'error.main',
                    color: '#fff',
                    '&:hover': {
                      bgcolor: conversationState === 'idle' ? 'primary.dark' : 'error.dark',
                    },
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <MicIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <>
          <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
            <List>
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div key={message.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                      <Paper elevation={1} sx={{ p: 1.5, borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px', maxWidth: '85%', bgcolor: message.type === 'plan' ? theme.palette.info.light : (message.sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper), color: message.sender === 'user' ? '#fff' : theme.palette.text.primary }}>
                        <Typography variant="body1">{message.text}</Typography>
                      </Paper>
                      {message.chartData && (
                        <Paper sx={{ mt: 1, p: 1.5, width: '85%', borderRadius: '20px' }}>
                          <Box sx={{ height: 150 }}>
                            <ResponsiveContainer width="100%" height="100%"><AreaChart data={message.chartData}><defs><linearGradient id="aiChartGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/><stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/></linearGradient></defs><Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: theme.shape.borderRadius }} /><Area type="monotone" dataKey="consumption" stroke={theme.palette.secondary.main} strokeWidth={2} fill="url(#aiChartGradient)" /></AreaChart></ResponsiveContainer>
                          </Box>
                        </Paper>
                      )}
                      <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>{message.sender === 'user' ? 'You' : 'Gemini'} - {new Date(message.id).toLocaleTimeString()}</Typography>
                    </ListItem>
                  </motion.div>
                ))}
                {isTyping && (
                  <ListItem sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: theme.palette.primary.main }}><SmartToyOutlinedIcon sx={{ fontSize: 20, color: '#fff' }} /></Avatar></motion.div>
                    <Paper sx={{ p: 1.5, borderRadius: '20px 20px 20px 5px', bgcolor: 'background.paper' }}><Box sx={{ display: 'flex', alignItems: 'center' }}><motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main, margin: 2 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity }} /><motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main, margin: 2 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} /><motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main, margin: 2 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} /></Box></Paper>
                  </ListItem>
                )}
              </AnimatePresence>
              <div ref={scrollRef} />
            </List>
          </Box>
          <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1.5, overflowX: 'auto', pb: 1 }}>
              {suggestionChips.map(chip => (<Chip key={chip} label={chip} onClick={() => setInput(chip)} variant="outlined" size="small" sx={{ borderRadius: '16px' }} />))}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField fullWidth variant="outlined" size="small" placeholder="Ask Gemini..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: '20px' } }} />
              <IconButton color="primary" onClick={handleSendMessage} sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}><SendIcon /></IconButton>
            </Box>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default GeminiAIAssistant;
