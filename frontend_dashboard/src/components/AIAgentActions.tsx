import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Grid, IconButton, Divider } from '@mui/material';
import { CheckCircleOutline, History, LightbulbOutlined, Check, Close } from '@mui/icons-material';

const AIAgentActions: React.FC = () => {

  // Mock Data for AI Agent Actions and Recommendations
  const actionLog = [
    { id: 1, timestamp: '2025-09-19 11:00 AM', action: 'Adjusted fuel rate', parameter: 'Fuel Rate', value: '+2%', status: 'Executed' },
    { id: 2, timestamp: '2025-09-19 10:30 AM', action: 'Increased kiln speed', parameter: 'Kiln Speed', value: '+0.1 RPM', status: 'Executed' },
    { id: 3, timestamp: '2025-09-19 09:00 AM', action: 'Reduced raw material feed', parameter: 'Feed Rate', value: '-5%', status: 'Executed' },
  ];

  const recommendations = [
    { id: 1, timestamp: '2025-09-19 11:30 AM', recommendation: 'Increase primary air flow by 3% to optimize combustion.', status: 'Pending', confidence: 0.95 },
    { id: 2, timestamp: '2025-09-19 10:00 AM', recommendation: 'Reduce clinker cooler fan speed to conserve energy.', status: 'Pending', confidence: 0.88 },
  ];

  const handleApprove = (id: number) => {
    console.log(`Approved recommendation ${id}`);
    // In a real application, this would trigger an API call
  };

  const handleReject = (id: number) => {
    console.log(`Rejected recommendation ${id}`);
    // In a real application, this would trigger an API call
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>AI Agent Actions & Recommendations</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} lg={6} component="div">
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <History sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                Action Log
              </Typography>
            </Box>
            <List>
              {actionLog.map((log, index) => (
                <React.Fragment key={log.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          <Chip icon={<CheckCircleOutline />} label={log.status} color="success" size="small" sx={{ mr: 1.5, fontWeight: 500 }} />
                          {log.action} ({log.parameter}: {log.value})
                        </Typography>
                      }
                      secondary={log.timestamp}
                    />
                  </ListItem>
                  {index < actionLog.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6} component="div">
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LightbulbOutlined sx={{ mr: 1.5, color: 'secondary.main' }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                Recommendation Queue
              </Typography>
            </Box>
            <List>
              {recommendations.map((rec, index) => (
                <React.Fragment key={rec.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <IconButton color="success" onClick={() => handleApprove(rec.id)} sx={{ mr: 0.5 }}>
                          <Check />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleReject(rec.id)}>
                          <Close />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body1">
                          <Chip label={rec.status} color="warning" size="small" sx={{ mr: 1.5, fontWeight: 500 }} />
                          {rec.recommendation}
                        </Typography>
                      }
                      secondary={`Confidence: ${(rec.confidence * 100).toFixed(0)}% - ${rec.timestamp}`}
                    />
                  </ListItem>
                  {index < recommendations.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIAgentActions;