import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Card, CardHeader, CardContent, Typography, Chip, Avatar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import SettingsIcon from '@mui/icons-material/Settings';
import { keyframes } from '@mui/system';

// Animation for the alerting node
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
  70% { box-shadow: 0 0 0 15px rgba(255, 82, 82, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
`;

interface CustomNodeData {
  label: string;
  status?: string; // e.g., 'pending', 'running', 'completed', 'failed'
  message?: string;
  isAlerting?: boolean;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  const theme = useTheme();
  
  const getStatusStyling = (status?: string) => {
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

  const { color, icon, avatarBg } = getStatusStyling(data.status);

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`, 
        minWidth: 200,
        animation: data.isAlerting ? `${pulse} 2s infinite` : 'none',
        backgroundColor: theme.palette.background.paper,
        transition: 'box-shadow 0.3s',
        '&:hover': {
          boxShadow: theme.shadows[8],
        }
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: theme.palette.primary.main }} />
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: avatarBg, color: 'white' }}>
            <SettingsIcon />
          </Avatar>
        }
        title={
          <Typography variant="subtitle1" fontWeight="bold">
            {data.label}
          </Typography>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1, textAlign: 'center' }}>
        {data.status && (
          <Chip
            icon={icon}
            label={data.status.toUpperCase()}
            color={color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 'bold' }}
          />
        )}
        {data.message && (
          <Typography variant="caption" display="block" mt={1} color="text.secondary">
            {data.message}
          </Typography>
        )}
      </CardContent>
      <Handle type="source" position={Position.Right} style={{ background: theme.palette.primary.main }} />
    </Card>
  );
};

export default memo(CustomNode);