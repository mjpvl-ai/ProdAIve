import React, { memo } from 'react';
import { Handle, Position } from 'reactflow'; // Changed from react-flow-renderer

import { Paper, Box, Typography, Chip } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface CustomNodeData {
  label: string;
  status?: string; // e.g., 'pending', 'running', 'completed', 'failed'
  message?: string;
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

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        backgroundColor: getBackgroundColor(data.status),
        minWidth: 150,
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
