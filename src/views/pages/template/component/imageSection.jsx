import Box from '@mui/material/Box';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import ImageUploader from '../../../component/ImageUploader';
import Grid from '@mui/material/Grid';
import { MenuItem, Select, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const defaultComponent = {
  mainTileAlign: 'left',
  mainTile: 'Image Title',
  images: [null, null, null],
  noOfImage: 3
};

const ensureImagesArray = (arr, len) => Array.from({ length: len }, (_, i) => (arr && arr[i] ? arr[i] : null));

const ImageSection = forwardRef(({ isEditing, deleteComponent }, ref) => {
  const theme = useTheme();
  const [component, setComponent] = useState(defaultComponent);
  const [tempComponent, setTempComponent] = useState({
    ...defaultComponent,
    images: ensureImagesArray(defaultComponent.images, defaultComponent.noOfImage)
  });
  const [previewUrls, setPreviewUrls] = useState([]);

  useImperativeHandle(ref, () => ({
    saveChanges: () => {
      // Save the actual file objects for database storage
      console.log('Saving changes for ImageSection:', tempComponent);
      setComponent((prev) => ({ ...prev, ...tempComponent, images: [...tempComponent.images] }));
    },
    cancelChanges: () => {
      setTempComponent(component);
    }
  }));

  const changeValue = (key, value) => {
    setTempComponent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    setComponent(defaultComponent);
    setTempComponent({
      ...defaultComponent,
      images: ensureImagesArray(defaultComponent.images, defaultComponent.noOfImage)
    });
  }, []);

  useEffect(() => {
    setTempComponent((prev) => ({
      ...prev,
      images: ensureImagesArray(prev.images, prev.noOfImage || 3)
    }));
  }, [tempComponent.noOfImage]);

  // Generate preview URLs for the files
  useEffect(() => {
    // Cleanup old preview URLs
    previewUrls.forEach((url) => {
      if (url) URL.revokeObjectURL(url);
    });

    // Create new preview URLs
    const newPreviewUrls = tempComponent.images.map((file) => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return null;
    });

    setPreviewUrls(newPreviewUrls);

    // Cleanup when component unmounts
    return () => {
      newPreviewUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [tempComponent.images]);

  const handleImageChange = (idx, file) => {
    setTempComponent((prev) => {
      const newImages = [...prev.images];
      console.log(file);
      newImages[idx] = file;
      return { ...prev, images: newImages };
    });
  };

  // Helper function to generate preview URLs for display in view mode
  const getComponentPreviewUrls = () => {
    return component.images.map((file) => {
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return null;
    });
  };

  return (
    <Box
      sx={{
        position: 'relative',
        border: isEditing ? '1px dashed #aaa' : 'none',
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        pt: 5,
        mb: 2
      }}
    >
      {isEditing && (
        <IconButton
          size="small"
          color="error"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
          onClick={deleteComponent}
          aria-label="Delete section"
        >
          <CloseIcon />
        </IconButton>
      )}
      {isEditing ? (
        <>
          <TextField
            variant="outlined"
            placeholder="Add Profile Name..."
            size="small"
            fullWidth
            value={tempComponent.mainTile}
            onChange={(e) => changeValue('mainTile', e.target.value)}
            sx={{
              '& input': {
                textAlign: tempComponent.mainTileAlign
              }
            }}
          />
          <Grid container spacing={2}>
            {tempComponent.images.map((image, idx) => (
              <Grid item size={12 / Math.max(1, Math.min(tempComponent.noOfImage || 3, 12))} key={idx}>
                <ImageUploader image={image} onChange={(file) => handleImageChange(idx, file)} />
              </Grid>
            ))}
          </Grid>
          <Typography variant="h3" gutterBottom>
            Image Section Settings
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <Box sx={{ mb: 3 }} display="flex" flexDirection="column" alignItems="flex-start">
                <Typography variant="body1" fontWeight="medium">
                  Main Tile Align
                </Typography>
                <Select
                  sx={{ width: 300, height: 40 }}
                  variant="outlined"
                  value={tempComponent.mainTileAlign}
                  onChange={(e) => changeValue('mainTileAlign', e.target.value)}
                >
                  <MenuItem value="left">Left</MenuItem>
                  <MenuItem value="center">Center</MenuItem>
                  <MenuItem value="right">Right</MenuItem>
                </Select>
              </Box>
            </Grid>
            <Grid item xs={3}>
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
        </>
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" align={component.mainTileAlign || 'left'} gutterBottom sx={{ fontWeight: 600 }}>
            {component.mainTile || 'Image Section'}
          </Typography>
          <Grid container spacing={2}>
            {Array.isArray(tempComponent.images) && tempComponent.images.filter((file) => file).length > 0 ? (
              (() => {
                const viewPreviewUrls = getComponentPreviewUrls();
                return component.images
                  .map(
                    (file, idx) =>
                      file && (
                        <Grid item size={12 / Math.max(1, Math.min(component.images.filter((f) => f).length, 12))} key={idx}>
                          <Box
                            component="img"
                            src={viewPreviewUrls[idx]}
                            alt="Preview"
                            sx={{
                              aspectRatio: '4/3',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              backgroundColor: theme.palette.grey[100],
                              borderRadius: '20px',
                              overflow: 'hidden'
                            }}
                          />
                        </Grid>
                      )
                  )
                  .filter(Boolean);
              })()
            ) : (
              <Grid item xs={12}>
                <Typography color="text.secondary" align="center">
                  No images to display
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box>
  );
});

export default ImageSection;