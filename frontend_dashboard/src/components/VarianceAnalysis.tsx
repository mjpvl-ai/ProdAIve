import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const VarianceAnalysis: React.FC = () => {
  const [varianceData, setVarianceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/variance_analysis`)
      .then(response => response.json())
      .then(data => {
        setVarianceData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching variance analysis data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Variance Analysis</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Metric Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Timestamp</TableCell>
              <TableCell>Is Anomaly</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {varianceData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.metric_name}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{new Date(row.timestamp).toLocaleString()}</TableCell>
                <TableCell>{row.is_anomaly ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default VarianceAnalysis;
