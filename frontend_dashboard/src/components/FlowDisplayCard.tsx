import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

interface FlowDisplayCardProps {
  onViewDetails: () => void;
  alertingNodeId: string | null;
}

const FlowDisplayCard: React.FC<FlowDisplayCardProps> = ({ onViewDetails, alertingNodeId }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Realtime Process Flow
          </Typography>
          <Button size="small" onClick={onViewDetails}>
            View Details
          </Button>
        </Box>
        <Box sx={{ mt: 2, textAlign: 'center', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', bgcolor: 'grey.100', borderRadius: 1 }}>
          <AccountTreeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Live view of the production process.
          </Typography>
          {alertingNodeId ? (
            <Chip label="Alert Active!" color="error" />
          ) : (
            <Chip label="All Systems Nominal" color="success" />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default FlowDisplayCard;