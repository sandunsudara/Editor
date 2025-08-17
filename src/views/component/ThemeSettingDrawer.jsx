import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import useConfig from '../../hooks/useConfig';

const ThemeSettingDrawer = ({settingsDrawerOpen  ,setSettingsDrawerOpen}) => {
  const theme = useTheme();
  const { borderRadius, fontFamily } = useConfig();

  const headerLevels = [
    { label: 'H1', style: theme.typography.h1 },
    { label: 'H2', style: theme.typography.h2 },
    { label: 'H3', style: theme.typography.h3 }
  ];

  return (
    <Drawer anchor="right" open={settingsDrawerOpen} onClose={() => setSettingsDrawerOpen(false)}>
      <Box sx={{ width: 350, p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={() => setSettingsDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Settings content goes here */}
        <Typography color="text.secondary" mb={2}>Settings drawer content...</Typography>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>Header Styles</Typography>
          {headerLevels.map(({ label, style }) => (
            <Box key={label} mb={1}>
              <Typography variant="body2" fontWeight={600}>{label}</Typography>
              <Typography variant="caption">
                Font Size: {style.fontSize} | Font Family: {fontFamily} | Color: {style.color || theme.palette.text.primary}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>Border Radius</Typography>
          <Typography variant="caption">{borderRadius}px</Typography>
        </Box>
      </Box>
    </Drawer>
  )
}

export default ThemeSettingDrawer;