import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, FormControlLabel, Switch, RadioGroup, Radio, FormControl, FormLabel, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`);
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError('Failed to fetch settings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateSetting = async (newSettings: any) => {
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      setSettings(newSettings);
    } catch (err) {
      console.error('Failed to update settings', err);
    }
  };

  const handleDarkModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSetting({ ...settings, darkMode: event.target.checked });
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSetting({ ...settings, language: event.target.value });
  };

  const handleNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSetting({ ...settings, notificationsEnabled: event.target.checked });
  };

  const handleProfileSave = () => {
    updateSetting(settings);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 4 }}>Settings</Typography>
      
      <Box sx={{ maxWidth: 960, mx: 'auto' }}>
        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Appearance</Typography>
          <FormControlLabel
            control={<Switch checked={settings?.darkMode} onChange={handleDarkModeChange} name="darkMode" />}
            label="Dark Mode"
          />
        </Paper>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Language</Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Language</FormLabel>
            <RadioGroup row aria-label="language" name="language" value={settings?.language} onChange={handleLanguageChange}>
              <FormControlLabel value="en" control={<Radio />} label="English" />
              <FormControlLabel value="es" control={<Radio />} label="Spanish" />
              <FormControlLabel value="fr" control={<Radio />} label="French" />
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>Notifications</Typography>
          <FormControlLabel
            control={<Switch checked={settings?.notificationsEnabled} onChange={handleNotificationsChange} name="notifications" />}
            label="Enable Notifications"
          />
        </Paper>

        <Paper component={motion.div} variants={cardVariants} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom>User Profile</Typography>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
            <TextField
              label="Name"
              variant="outlined"
              value={settings?.userName}
              onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              variant="outlined"
              value={settings?.userEmail}
              onChange={(e) => setSettings({ ...settings, userEmail: e.target.value })}
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