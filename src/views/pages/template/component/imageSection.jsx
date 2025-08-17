import Box from '@mui/material/Box';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import ImageUploader from '../../../component/ImageUploader';
import Grid from '@mui/material/Grid';
import { MenuItem, Select, Typography } from '@mui/material';

const defaultComponent = {
  mainTileAlign: 'left',
  mainTile: 'Image Title',
  images: [],
  noOfImage:3
};

const ImageSection = forwardRef(({ isEditing, ref }) => {
  const theme = useTheme();
  const [component, setComponent] = useState({ mainTile: '' });
  const [tempComponent, setTempComponent] = useState({ mainTile: '' });

  useImperativeHandle(ref, () => ({
    saveChanges: () => {
      // Logic to save changes for the image section
      console.log('Saving changes for ImageSection');
    },
    cancelChanges: () => {
      // Logic to cancel changes for the image section
      console.log('Cancelling changes for ImageSection');
    }
  }));

  const changeValue = (key, value) => {
    let newValue = { ...tempComponent };
    newValue[key] = value;
    setTempComponent(newValue);
  };

  useEffect(() => {
    setComponent(defaultComponent);
    setTempComponent(defaultComponent);
  }, []);

  return isEditing ? (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: theme.palette.grey.A400,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}
    >
      <TextField
        variant="outlined"
        placeholder="Add Profile Name..."
        size="small"
        fullWidth
        value={tempComponent.mainTile}
        onChange={(e) => changeValue('mainTile', e.target.value)}
        InputProps={{
          sx: {
            '& input': {
              textAlign: tempComponent.mainTileAlign
            }
          }
        }}
      />
      <Grid container spacing={2}>
        {(Array.from({ length: tempComponent.noOfImage || 3 })).map((_, idx) => (
          <Grid item size={12 / Math.max(1, Math.min(tempComponent.noOfImage || 3, 12))} key={idx}>
            <ImageUploader />
          </Grid>
        ))}
      </Grid>
      <Typography variant="h3" gutterBottom>
        Image Section Settings
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item size={3}>
          <Box sx={{ mb: 3 }} display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body1" fontWeight="medium">
              Main Tile Align
            </Typography>
            <Select sx={{ width: 300 , height:40 }} variant="outlined" value={tempComponent.mainTileAlign} onChange={(e) => changeValue('mainTileAlign', e.target.value)}>
              <MenuItem value="left">Left</MenuItem>
              <MenuItem value="center">Center</MenuItem>
              <MenuItem value="right">Right</MenuItem>
            </Select>
          </Box>
        </Grid>
        <Grid item size={3}>
          <Box sx={{ mb: 3 }} display="flex" flexDirection="column" alignItems="flex-start">
            <Typography variant="body1" fontWeight="medium">
              Number of Images
            </Typography>
            <TextField
              type="number"
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              value={tempComponent.noOfImage || 3}
              onChange={(e) => changeValue('noOfImage', parseInt(e.target.value, 10) || 0)}
              inputProps={{
                min: 3,
                max: 10,
                step: 1
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <TextField>not editing</TextField>
  );
});

export default ImageSection;
