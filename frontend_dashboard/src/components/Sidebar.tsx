import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Box, Tooltip } from '@mui/material';
import type { DrawerProps } from '@mui/material/Drawer';
import {
  Dashboard as DashboardIcon,
  Thermostat as ThermostatIcon,
  Bolt as BoltIcon,
  OnlinePrediction as OnlinePredictionIcon,
  AccountTree as AccountTreeIcon,
  SmartToy as SmartToyIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 60;

const menuItems = [
  { text: 'Overview', icon: <DashboardIcon />, view: 'Overview' },
  { text: 'Kiln Health', icon: <ThermostatIcon />, view: 'Kiln Health' },
  { text: 'Energy Cockpit', icon: <BoltIcon />, view: 'Energy Cockpit' },
  { text: 'Predictive Quality', icon: <OnlinePredictionIcon />, view: 'Predictive Quality' },
  { text: 'AI Agent Actions', icon: <SmartToyIcon />, view: 'AI Agent Actions' },
];

interface SidebarProps {
  open: boolean;
  variant?: DrawerProps['variant'];
  currentView: string;
  onSelectView: (view: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, variant, currentView, onSelectView, onClose }) => {
  return (
    <Drawer
      variant={variant}
      open={open}
      onClose={onClose}
      sx={{
        width: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          borderRight: 'none',
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        },
      }}
    >
      <Box sx={{ height: '64px' }} /> {/* Spacer for the header */}
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <Tooltip title={!open ? item.text : ''} placement="right">
              <ListItemButton
                selected={currentView === item.view}
                onClick={() => onSelectView(item.view)}
                sx={{ justifyContent: open ? 'initial' : 'center' }}
              >
                <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    transition: (theme) => theme.transitions.create('opacity', { duration: theme.transitions.duration.enteringScreen }),
                  }} />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => onSelectView('Settings')} sx={{ justifyContent: open ? 'initial' : 'center' }}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}><SettingsIcon /></ListItemIcon>
            <ListItemText 
              primary="Settings" 
              sx={{ 
                opacity: open ? 1 : 0,
                transition: (theme) => theme.transitions.create('opacity', { duration: theme.transitions.duration.enteringScreen }),
              }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;