import React, { useState } from 'react';
import { Box, Typography, Paper, FormControlLabel, Switch, RadioGroup, Radio, FormControl, FormLabel, TextField, Button } from '@mui/material';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Settings: React.FC = () => {
  
  const [darkMode, setDarkMode] = useState(false); // This would ideally come from a global state/context
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDarkMode(event.target.checked);
    // In a real app, you'd update the theme context here
    console.log('Dark mode toggled:', event.target.checked);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLanguage(event.target.value);
    console.log('Language changed to:', event.target.value);
  };

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotificationsEnabled(event.target.checked);
    console.log('Notifications toggled:', event.target.checked);
  };

  const handleProfileSave = () => {
    console.log('Profile saved:', { userName, userEmail });
    // In a real app, you'd send this data to a backend service
  };

  return (
    <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>Settings</Typography>
      
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>
        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Appearance</Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleDarkModeChange} name="darkMode" />}
            label="Dark Mode"
          />
        </Paper>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Language</Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Language</FormLabel>
            <RadioGroup row aria-label="language" name="language" value={language} onChange={handleLanguageChange}>
              <FormControlLabel value="en" control={<Radio />} label="English" />
              <FormControlLabel value="es" control={<Radio />} label="Spanish" />
              <FormControlLabel value="fr" control={<Radio />} label="French" />
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          <FormControlLabel
            control={<Switch checked={notificationsEnabled} onChange={handleNotificationsChange} name="notifications" />}
            label="Enable Notifications"
          />
        </Paper>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>User Profile</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
            <TextField
              label="Name"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              fullWidth
            />
            <Button variant="contained" onClick={handleProfileSave} sx={{ mt: 2 }}>Save Profile</Button>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default Settings;