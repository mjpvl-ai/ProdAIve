import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, IconButton, TextField, List, ListItem, Avatar, Chip, Button } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
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
  alert: Alert | null;
  onSelectView: (view: string) => void;
}

interface Alert {
  message: string;
}

type AssistantMode = 'chat' | 'voice';
type ConversationState = 'idle' | 'listening' | 'speaking' | 'alerting';

const GeminiAIAssistant: React.FC<GeminiAIAssistantProps> = ({ onTriggerAlert, position, onPositionChange, isFullScreen, onToggleFullScreen, alert, onSelectView }) => {
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

  const pulseAnimation = keyframes`
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 ${alpha(theme.palette.error.main, 0.7)};
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 20px ${alpha(theme.palette.error.main, 0)};
    }
    100% { transform: scale(0.95); }
  `;
  useEffect(() => {
    if (mode === 'chat' && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, mode]);

  useEffect(() => {
    if (alert) {
      setMode('voice');
      setConversationState('alerting');
      setActiveAlert(alert);
    }
  }, [alert]);

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

  const suggestionChips: { text: string; view: string; query: string }[] = [
    { text: 'Summarize energy usage', view: 'Energy Cockpit', query: 'Summarize energy usage' },
    { text: 'Any temperature anomalies?', view: 'Kiln Health', query: 'Any temperature anomalies?' },
    { text: 'Predict clinker quality', view: 'Predictive Quality', query: 'Predict clinker quality' },
    { text: 'Show plan operations', view: 'AI Agent Actions', query: 'Show plan operations' },
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
        <></>
      )}
      <Box
        sx={{
          p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center',
          cursor: 'default',
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
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 2, position: 'relative', textAlign: 'center' }}>
            <AnimatePresence>
              {conversationState === 'alerting' ? (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 150,
                      height: 150,
                      position: 'relative',
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: `3px solid ${theme.palette.error.light}`,
                      animation: `${pulseAnimation} 2s infinite`,
                      mb: 2,
                    }}>
                      <WarningAmberIcon sx={{ fontSize: 70, color: 'white' }} />
                    </Box>
                    <Typography variant="h6" color="text.primary" sx={{ mb: 2, maxWidth: '90%' }}>
                      {getStatusText()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
                      <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={handleApprove} sx={{ borderRadius: '20px', px: 3, py: 1 }}>Approve</Button>
                      <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={handleDeny} sx={{ borderRadius: '20px', px: 3, py: 1 }}>Deny</Button>
                    </Box>
                  </Box>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.5, ease: 'easeInOut' }}>
                  <Box
                    sx={{
                      width: 200,
                      height: 200,
                      position: 'relative',
                      animation: conversationState !== 'idle' ? `${rotate} 15s linear infinite` : 'none',
                      '&::before': {
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
                      },
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          <Box sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper', textAlign: 'center' }}>
            {conversationState !== 'alerting' && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ position: 'absolute', bottom: 120 }}>
                  {getStatusText()}
                </Typography>
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
              {suggestionChips.map(chip => (
                <Chip
                  key={chip.text}
                  label={chip.text}
                  onClick={() => { setInput(chip.query); onSelectView(chip.view); }}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: '16px' }} />
              ))}
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
