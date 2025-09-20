import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';

import { Paper, Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'running':
        return 'info';
      case 'completed':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
      default:
        return 'default';
    }
  };

  const getBackgroundColor = (status?: string) => {
    switch (status) {
      case 'running':
        return theme.palette.info.light; // Light blue
      case 'completed':
        return theme.palette.success.light; // Light green
      case 'failed':
        return theme.palette.error.light; // Light red
      case 'pending':
      default:
        return theme.palette.background.paper;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'running':
        return <InfoOutlinedIcon sx={{ fontSize: 16 }} />;
      case 'completed':
        return <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />;
      case 'failed':
        return <ErrorOutlineIcon sx={{ fontSize: 16 }} />;
      case 'pending':
        return <HourglassEmptyIcon sx={{ fontSize: 16 }} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: getBackgroundColor(data.status),
        minWidth: 150,
        animation: data.isAlerting ? `${pulse} 2s infinite` : 'none',
        textAlign: 'center',
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {data.label}
        </Typography>
        {data.status && (
          <Chip
            icon={getStatusIcon(data.status)}
            label={data.status.toUpperCase()}
            color={getStatusColor(data.status)}
            size="small"
            sx={{ mt: 1, fontWeight: 'bold' }}
          />
        )}
        {data.message && (
          <Typography variant="caption" display="block" mt={0.5}>
            {data.message}
          </Typography>
        )}
      </Box>
      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
};

export default memo(CustomNode);
