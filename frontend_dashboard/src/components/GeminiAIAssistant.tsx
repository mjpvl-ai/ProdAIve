import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Paper, TextField, List, ListItem, Avatar, Chip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SendIcon from '@mui/icons-material/Send';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  chartData?: any[];
  type?: 'chat' | 'plan'; // 'chat' for regular messages, 'plan' for operational steps
}

const GeminiAIAssistant: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'ai', text: 'Hello! How can I assist you with the kiln operations today?' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, newUserMessage]);
    setInput('');
    setIsTyping(true);

    if (newUserMessage.text.toLowerCase().includes('plan operations')) {
      // Simulate a sequence of plan operation messages
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
        delay += 1500; // Increment delay for next step
      });

    } else {
      // Existing AI response simulation
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
    <Paper elevation={0} sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.background.default }}>
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center' }}>
        <SmartToyOutlinedIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>Gemini AI Assistant</Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <List>
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <ListItem sx={{ display: 'flex', flexDirection: 'column', alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start', mb: 2 }}>
                  <Paper 
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                      maxWidth: '85%',
                      bgcolor: message.type === 'plan' ? theme.palette.info.light : (message.sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper),
                      color: message.sender === 'user' ? '#fff' : theme.palette.text.primary,
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Typography variant="body1">{message.text}</Typography>
                  </Paper>
                  {message.chartData && (
                    <Paper sx={{ mt: 1, p: 1.5, width: '85%', borderRadius: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                      <Box sx={{ height: 150 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={message.chartData}>
                            <defs>
                              <linearGradient id="aiChartGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={theme.palette.secondary.main} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={theme.palette.secondary.main} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderColor: theme.palette.divider, borderRadius: theme.shape.borderRadius }} />
                            <Area type="monotone" dataKey="consumption" stroke={theme.palette.secondary.main} strokeWidth={2} fill="url(#aiChartGradient)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  )}
                  <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
                    {message.sender === 'user' ? 'You' : 'Gemini'} - {new Date(message.id).toLocaleTimeString()}
                  </Typography>
                </ListItem>
              </motion.div>
            ))}
            {isTyping && (
              <ListItem sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: theme.palette.primary.main }}>
                    <SmartToyOutlinedIcon sx={{ fontSize: 20, color: '#fff' }} />
                  </Avatar>
                </motion.div>
                <Paper sx={{ p: 1.5, borderRadius: '20px 20px 20px 5px', bgcolor: 'background.paper', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main, margin: 2 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
                    <motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main, margin: 2 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
                    <motion.div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: theme.palette.primary.main, margin: 2 }} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
                  </Box>
                </Paper>
              </ListItem>
            )}
          </AnimatePresence>
          <div ref={scrollRef} />
        </List>
      </Box>

      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          {suggestionChips.map(chip => (
            <Chip key={chip} label={chip} onClick={() => setInput(chip)} variant="outlined" size="small" sx={{ borderRadius: '16px' }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Ask Gemini..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            sx={{ mr: 1, '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
          />
          <IconButton color="primary" onClick={handleSendMessage} sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Paper>
  );
};

export default GeminiAIAssistant;
