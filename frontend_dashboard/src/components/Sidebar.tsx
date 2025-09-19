import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar';

// --- Icon Imports ---
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined'; // Import the new icon
import { SvgIcon } from '@mui/material';

const drawerWidth = 260; // Increased width for a more spacious feel

// A simple, elegant SVG logo for ProdAIve
const ProdAiveLogo = () => (
  <SvgIcon sx={{ fontSize: 32, color: '#FFFFFF' }}>
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5-10-5-10 5z" />
  </SvgIcon>
);

interface SidebarProps {
  open: boolean;
  currentView: string;
  onSelectView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, currentView, onSelectView }) => {
  const navItems = [
    { text: 'Overview', icon: <DashboardOutlinedIcon /> },
    { text: 'Energy Cockpit', icon: <ElectricBoltOutlinedIcon /> },
    { text: 'Kiln Health', icon: <LocalFireDepartmentOutlinedIcon /> },
    { text: 'Predictive Quality', icon: <TrendingUpOutlinedIcon /> },
    { text: 'Realtime Flow', icon: <TimelineOutlinedIcon /> }, // New item for Realtime Flow
    { text: 'AI Assistant', icon: <SmartToyOutlinedIcon /> },
    { text: 'Settings', icon: <SettingsOutlinedIcon /> },
  ];

  return (
    <Drawer
      variant="persistent"
      open={open}
      sx={{
        width: open ? drawerWidth : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: 'none', // Remove the default border
          backgroundColor: '#000031', // Darker blue for more contrast
          color: '#FFFFFF',
        },
      }}
    >
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <ProdAiveLogo />
        <Typography variant="h5" noWrap component="div" sx={{ ml: 2, fontWeight: 700 }}>
          ProdAIve
        </Typography>
      </Toolbar>
      <Box sx={{ overflow: 'auto', p: 1 }}>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.text}
              selected={item.text === currentView}
              onClick={() => onSelectView(item.text)}
              sx={{ 
                m: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: 'rgba(0, 172, 193, 0.2)',
                  borderLeft: `3px solid ${ '#00acc1'}`,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 172, 193, 0.3)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      {/* Refined User Profile Section */}
      <Box sx={{ mt: 'auto', p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="John Doe" src="/static/images/avatar/1.jpg" sx={{ width: 40, height: 40 }} />
          <Box sx={{ ml: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>John Doe</Typography>
            <Typography variant="body2" sx={{ color: '#B0B0B0' }}>Administrator</Typography>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;