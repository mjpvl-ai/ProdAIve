import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import { ArrowUpward, ArrowDownward, Remove } from '@mui/icons-material';

interface EnergyCockpitCardProps {
  title: string;
  value: string | number;
  unit: string;
  status?: 'up' | 'down' | 'stable';
  description?: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const EnergyCockpitCard: React.FC<EnergyCockpitCardProps> = ({ title, value, unit, status, description }) => {
  const theme = useTheme();

  const getStatusInfo = () => {
    if (status === 'down') {
      return { color: theme.palette.success.main, icon: <ArrowDownward fontSize="small" sx={{ mr: 0.5 }} /> };
    }
    if (status === 'up') {
      return { color: theme.palette.error.main, icon: <ArrowUpward fontSize="small" sx={{ mr: 0.5 }} /> };
    }
    return { color: theme.palette.text.secondary, icon: <Remove fontSize="small" sx={{ mr: 0.5 }} /> };
  };

  const statusInfo = getStatusInfo();

  return (
    <Card component={motion.div} variants={cardVariants} sx={{ height: '100%', borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main, mt: 1 }}>
          {value}
          <Typography variant="h6" component="span" sx={{ ml: 0.5, color: 'text.secondary', fontWeight: 400 }}>
            {unit}
          </Typography>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', color: statusInfo.color, mt: 1 }}>
          {statusInfo.icon}
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {status ? `Trend: ${status}` : ''}
          </Typography>
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default EnergyCockpitCard;