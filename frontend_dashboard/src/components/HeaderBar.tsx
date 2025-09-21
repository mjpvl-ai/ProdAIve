import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, InputBase, Box, Badge, Avatar, Menu, MenuItem, Divider, Button } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// --- Icon Imports ---
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined'; 

// --- Styled Components for a more refined look ---
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.drawer + 1,
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

interface HeaderBarProps {
  onAIAssistantToggle: () => void;
  onAIAssistantFullscreenToggle: () => void; // This is illustrative; not used directly here but good practice
  aiAssistantOpen: boolean;
  currentView: string;
  onSelectView: (view: string) => void;
  menuItems: { text: string; view: string; icon: React.ReactNode }[];
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  onAIAssistantToggle,
  aiAssistantOpen,
  currentView,
  onSelectView,
  menuItems
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    console.log('Search Term:', event.target.value);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h5" // Slightly larger for prominence
          noWrap
          component="div"
          sx={{ fontWeight: 700, color: 'primary.main', mr: 4 }} // Use primary color and bold
        >
          ProdAIve
        </Typography>

        {/* Integrated Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              onClick={() => onSelectView(item.view)}
              variant={currentView === item.view ? 'contained' : 'text'}
              color={currentView === item.view ? 'primary' : 'inherit'}
              startIcon={item.icon}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton
          color="inherit"
          sx={{ mr: 1 }}
          onClick={handleNotificationsMenuOpen}
        >
          <Badge badgeContent={4} color="error">
            <NotificationsOutlinedIcon />
          </Badge>
        </IconButton>

        <IconButton
          color={aiAssistantOpen ? 'secondary' : 'inherit'}
          aria-label="toggle conversational assistant"
          onClick={onAIAssistantToggle}
          sx={{ mr: 1 }}
        >
          <SmartToyOutlinedIcon />
        </IconButton>

        <IconButton
          edge="end"
          onClick={handleProfileMenuOpen}
          color="inherit"
          sx={{ p: 0 }}
        >
          <Avatar alt="John Doe" src="/static/images/avatar/1.jpg" sx={{ width: 36, height: 36 }} />
        </IconButton>

        {/* --- Menus --- */}
        <Menu
          anchorEl={notificationsAnchorEl}
          open={Boolean(notificationsAnchorEl)}
          onClose={handleNotificationsMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, px: 2 }}>Notifications</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleNotificationsMenuClose}>Notification 1</MenuItem>
          <MenuItem onClick={handleNotificationsMenuClose}>Notification 2</MenuItem>
          <MenuItem onClick={handleNotificationsMenuClose}>Notification 3</MenuItem>
        </Menu>

        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem>
            <Box sx={{ my: 1, px: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>John Doe</Typography>
              <Typography variant="body2" color="text.secondary">Administrator</Typography>
            </Box>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
          <MenuItem onClick={handleProfileMenuClose}>My account</MenuItem>
          <Divider />
          <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default HeaderBar;