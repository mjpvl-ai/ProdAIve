import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow'; // Changed from react-flow-renderer to reactflow
import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomNode from './CustomNode'; // Import the custom node
import type { Connection, Edge, Node } from 'reactflow'; // Import types from reactflow // Changed from react-flow-renderer to reactflow

// Define initial nodes and edges for demonstration
const initialNodes: Node[] = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start Process', status: 'completed', message: 'Initialized' }, type: 'custom' },
  { id: '2', position: { x: 250, y: 0 }, data: { label: 'Step A', status: 'running', message: 'Processing data' }, type: 'custom' },
  { id: '3', position: { x: 250, y: 100 }, data: { label: 'Step B', status: 'pending', message: 'Waiting for input' }, type: 'custom' },
  { id: '4', position: { x: 500, y: 50 }, data: { label: 'End Process', status: 'failed', message: 'Error occurred' }, type: 'custom' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

// Define custom node types
const nodeTypes = { custom: CustomNode };

const FlowDisplay: React.FC = () => {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  

  return (
    <Box sx={{ p: 3, height: 'calc(100vh - 64px)', width: '100%' }}> {/* Adjust height as needed */}
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        Realtime Plan Operation Flow
      </Typography>
      <Paper elevation={2} sx={{ height: '100%', borderRadius: 2, overflow: 'hidden' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes} // Pass custom node types here
        >
          <MiniMap />
          <Controls />
          <Background color={theme.palette.divider} gap={16} />
        </ReactFlow>
      </Paper>
    </Box>
  );
};

export default FlowDisplay;
