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
const initialNodes: Node<any>[] = [
  { id: '1', type: 'custom', position: { x: 50, y: 200 }, data: { label: 'Quarry & Crush', status: 'completed', message: 'Limestone extracted' } },
  { id: '2', type: 'custom', position: { x: 300, y: 200 }, data: { label: 'Raw Grinding', status: 'completed', message: 'Raw meal prepared' } },
  { id: '3', type: 'custom', position: { x: 550, y: 100 }, data: { label: 'Preheating', status: 'running', message: 'Cyclone stage 4 active' } },
  { id: '4', type: 'custom', position: { x: 550, y: 300 }, data: { label: 'Kiln Burning', status: 'failed', message: 'High temp spike!' } },
  { id: '5', type: 'custom', position: { x: 800, y: 300 }, data: { label: 'Clinker Cooling', status: 'pending' } },
  { id: '6', type: 'custom', position: { x: 1050, y: 300 }, data: { label: 'Cement Grinding', status: 'pending' } },
  { id: '7', type: 'custom', position: { x: 1300, y: 300 }, data: { label: 'Silo Storage', status: 'pending' } },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, type: 'smoothstep' },
  { id: 'e2-3', source: '2', target: '3', animated: true, type: 'smoothstep' },
  { id: 'e3-4', source: '3', target: '4', animated: true, type: 'smoothstep' },
  { id: 'e4-5', source: '4', target: '5', animated: true, type: 'smoothstep' },
  { id: 'e5-6', source: '5', target: '6', animated: true, type: 'smoothstep' },
  { id: 'e6-7', source: '6', target: '7', animated: true, type: 'smoothstep' },
];

// Define custom node types
const nodeTypes = { custom: CustomNode };

interface FlowDisplayProps {
  alertingNodeId?: string | null;
}

const FlowDisplay: React.FC<FlowDisplayProps> = ({ alertingNodeId }) => {
  const theme = useTheme();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          isAlerting: node.id === alertingNodeId,
        },
      }))
    );
  }, [alertingNodeId, setNodes]);

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background id="1" color={theme.palette.divider} gap={16} />
      </ReactFlow>
    </Box>
  );
};

export default FlowDisplay;
