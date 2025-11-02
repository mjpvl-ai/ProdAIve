import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Chip, Grid, IconButton, Divider, CircularProgress, Alert } from '@mui/material';
import { CheckCircleOutline, History, LightbulbOutlined, Check, Close } from '@mui/icons-material';

const AIAgentActions: React.FC = () => {
  const [actionLog, setActionLog] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [actionsResponse, recommendationsResponse] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agent/actions`),
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agent/recommendations`),
      ]);
      const actionsData = await actionsResponse.json();
      const recommendationsData = await recommendationsResponse.json();
      setActionLog(actionsData);
      setRecommendations(recommendationsData);
    } catch (err) {
      setError('Failed to fetch data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agent/recommendations/${id}/approve`, { method: 'POST' });
      fetchData(); // Refresh data after action
    } catch (err) {
      console.error('Failed to approve recommendation', err);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/agent/recommendations/${id}/reject`, { method: 'POST' });
      fetchData(); // Refresh data after action
    } catch (err) {
      console.error('Failed to reject recommendation', err);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

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