import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ReactPlayer from 'react-player';
import { useState } from 'react';

const VideoPlaceHolder = ({ url }) => {
  const theme = useTheme();
  const [error, setError] = useState(false);

  return url ? (
    <Box
      sx={{
        width: '100%',
        minHeight: 220, // Ensure visible height
        height: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <ReactPlayer
        src={url}
        width="100%"
        height="100%"
        controls
        onError={() => setError(true)}
        onReady={() => setError(false)}
        config={{
          youtube: {
            playerVars: { origin: window.location.origin }
          }
        }}
      />
      {error && <Box sx={{ color: 'red', mt: 1, fontSize: 14 }}>Failed to load video. Please check the URL or try a different one.</Box>}
    </Box>
  ) : (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: 220,
        border: `2px dashed ${theme.palette.grey[400]}`,
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '20px',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        backgroundColor: 'transparent',
        '&:hover': {
          borderColor: theme.palette.grey[600]
        }
      }}
    >
      Drop or paste a video URL here
    </Box>
  );
};

export default VideoPlaceHolder;
