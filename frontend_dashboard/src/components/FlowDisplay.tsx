import React from 'react';
import { Box, Typography, Paper, Chip, Avatar, Grid } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { keyframes } from '@mui/system';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SettingsIcon from '@mui/icons-material/Settings'; // This is a generic icon for the nodes
import MenuBookIcon from '@mui/icons-material/MenuBook'; // Icon for the SOP document

// Animation for the alerting node
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(255, 82, 82, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
`;

const flowNodes = [
  { id: '1', label: 'Quarry & Crush', status: 'completed', message: 'Limestone extracted' },
  { id: '2', label: 'Raw Grinding', status: 'completed', message: 'Raw meal prepared' },
  { id: '3', label: 'Blending & Homogenization', status: 'completed', message: 'Raw meal blended' },
  { id: '4', label: 'Preheating', status: 'running', message: 'Cyclone stage 4 active' },
  { id: '5', label: 'Kiln Burning', status: 'failed', message: 'High temp spike!' },
  { id: '6', label: 'Clinker Cooling', status: 'pending' },
  { id: '7', label: 'Cement Grinding', status: 'pending' },
  { id: '8', label: 'Silo Storage', status: 'pending' },
];

const getStatusStyling = (status: string | undefined, theme: any) => {
  switch (status) {
    case 'running':
      return { color: 'info' as const, icon: <InfoOutlinedIcon />, avatarBg: theme.palette.info.main };
    case 'completed':
      return { color: 'success' as const, icon: <CheckCircleOutlineIcon />, avatarBg: theme.palette.success.main };
    case 'failed':
      return { color: 'error' as const, icon: <ErrorOutlineIcon />, avatarBg: theme.palette.error.main };
    case 'pending':
    default:
      return { color: 'default' as const, icon: <HourglassEmptyIcon />, avatarBg: theme.palette.grey[500] };
  }
};

const sopData: { [key: string]: { title: string; content: string; highlight: string } } = {
  '5': { // Corresponds to 'Kiln Burning' node ID
    title: 'SOP-KB-007: Kiln Temperature Anomaly Response',
    highlight: 'In case of a sudden temperature spike exceeding 1480°C, the primary corrective action is to immediately reduce the fuel injection rate by 5-10%.',
    content: `
      1. **Initial Assessment**: Continuously monitor the kiln shell temperature and the burning zone temperature. Any reading above 1480°C for more than 5 minutes is considered a critical event.

      2. **Immediate Corrective Action**: In case of a sudden temperature spike exceeding 1480°C, the primary corrective action is to immediately reduce the fuel injection rate by 5-10%. This is the most effective way to quickly manage the thermal energy input.

      3. **Secondary Measures**: If the temperature does not begin to decrease within 10 minutes of fuel rate reduction, increase the speed of the clinker cooler fans to draw more heat away from the clinker bed.

      4. **Monitoring & Follow-up**: After the temperature has stabilized back into the nominal range (1400-1450°C), gradually return the fuel rate to its original setting over a period of 30 minutes. Document the incident in the shift log.

      5. **Escalation**: If the temperature remains critical after implementing both primary and secondary measures, notify the shift supervisor and prepare for a potential emergency stop.
    `,
  },
};

const SOPViewer: React.FC<{ title: string; content: string; highlight: string }> = ({ title, content, highlight }) => {
  const theme = useTheme();
  const parts = content.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <Paper elevation={4} sx={{ p: 2, height: '100%', overflowY: 'auto', borderLeft: `4px solid ${theme.palette.primary.main}` }}>
      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><MenuBookIcon sx={{ mr: 1 }} /> {title}</Typography>
      <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.9rem', lineHeight: 1.7 }}>{parts.map((part, i) => part.toLowerCase() === highlight.toLowerCase() ? <Box component="mark" key={i} sx={{ bgcolor: alpha(theme.palette.warning.main, 0.4), p: 0.5, borderRadius: 1 }}>{part}</Box> : part)}</Typography>
    </Paper>
  );
};

interface FlowDisplayProps {
  alertingNodeId?: string | null;
}

const FlowDisplay: React.FC<FlowDisplayProps> = ({ alertingNodeId }) => {
  const theme = useTheme();

  return (
    <Grid container spacing={3} sx={{ height: '100%', flexWrap: 'nowrap' }}>
      <Grid item xs="auto" md={alertingNodeId ? 5 : 12}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%', overflowY: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            {flowNodes.map((node, index) => {
              const { color, icon, avatarBg } = getStatusStyling(node.status, theme);
              const isAlerting = node.id === (alertingNodeId === '4' ? '5' : alertingNodeId);

              return (
                <React.Fragment key={node.id}>
                  <Paper
                    elevation={4}
                    sx={{
                      p: 1.5,
                      width: 220,
                      textAlign: 'center',
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      animation: isAlerting ? `${pulse} 2s infinite` : 'none',
                      backgroundColor: theme.palette.background.paper,
                      transition: 'box-shadow 0.3s',
                      '&:hover': { boxShadow: theme.shadows[8] },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: avatarBg, color: 'white', width: 32, height: 32, mr: 1.5 }}>
                        <SettingsIcon fontSize="small" />
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">{node.label}</Typography>
                    </Box>
                    <Chip
                      icon={icon}
                      label={node.status.toUpperCase()}
                      color={color}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 'bold', mb: 1 }}
                    />
                    <Typography variant="caption" display="block" color="text.secondary">
                      {node.message}
                    </Typography>
                  </Paper>

                  {index < flowNodes.length - 1 && (
                    <Box
                      className="flow-connector"
                      sx={{
                        height: 20,
                        width: '2px',
                        background: theme.palette.primary.main,
                        position: 'relative', // Keep for arrow pseudo-element
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -3,
                          left: -3,
                          border: `4px solid transparent`,
                          borderTopColor: theme.palette.primary.main,
                        },
                      }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Box>
        </Box>
      </Grid>
      {alertingNodeId && sopData[alertingNodeId] && (
        <Grid item xs>
          <SOPViewer {...sopData[alertingNodeId]} />
        </Grid>
      )}
    </Grid>
  );
};

export default FlowDisplay;
