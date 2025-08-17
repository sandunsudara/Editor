import { Box, Button, Grid, MenuItem, Select, Typography } from '@mui/material';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

const defaultComponent = {
  bannerRadius: 10,
  bannerHeight: 200,
  logoImageJustifyContent: 'flex-start',
  logoImageAlignItems: 'center',
  logoImageSize: 50,
  logoImageRadius: 25,
  mainTile: 'Main Title',
  subTitle: 'Sub Title'
};

const ValueLabelChip = ({ value }) => {
  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '15px',
        py: 0.5,
        px: 2,
        minWidth: '60px',
        textAlign: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      {value}
    </Box>
  );
};

const ProfileSection = forwardRef(({ isEditing, deleteComponent }, ref) => {
  const [component, setComponent] = useState(defaultComponent);
  const [tempComponent, setTempComponent] = useState(defaultComponent);
  // Store both File and URL for banner and logo images
  const [bannerImage, setBannerImage] = useState(null); // { file, url }
  const [logoImage, setLogoImage] = useState(null); // { file, url }

  // Expose functions to parent
  useImperativeHandle(ref, () => ({
    saveChanges: () => {
      // Save tempComponent and image files
      setComponent(tempComponent);
    },
    cancelChanges: () => {
      setTempComponent(component);
    },
    getContent: () => {
      const componentContent = {
        type: 'profile',
        settings: {
          bannerRadius: tempComponent.bannerRadius,
          bannerHeight: tempComponent.bannerHeight,
          logoImageJustifyContent: tempComponent.logoImageJustifyContent,
          logoImageAlignItems: tempComponent.logoImageAlignItems,
          logoImageSize: tempComponent.logoImageSize,
          logoImageRadius: tempComponent.logoImageRadius
        },
        props: {
          mainTile: tempComponent.mainTile,
          subTitle: tempComponent.subTitle,
          bannerImage: bannerImage ? bannerImage.file : null,
          logoImage: logoImage ? logoImage.file : null
        }
      };
      console.log(componentContent);
      return componentContent;
    }
  }));

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerImage({ file, url: URL.createObjectURL(file) });
    }
  };
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoImage({ file, url: URL.createObjectURL(file) });
    }
  };

  const changeValue = (filed, value) => {
    let newValue = { ...tempComponent };
    newValue[filed] = value;
    setTempComponent(newValue);
  };

  useEffect(() => {
    setComponent(defaultComponent);
    setTempComponent(defaultComponent);
  }, []);

  // Guard: if tempComponent or component is null, don't render
  if (!tempComponent || !component) return null;

  if (isEditing) {
    return (
      <Box
        sx={{
          position: 'relative',
          border: '1px dashed #aaa',
          borderRadius: 2,
          p: 2,
          mb: 2,
          pt: 5,
          display: 'flex',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <IconButton
          size="small"
          color="error"
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 2 }}
          onClick={deleteComponent}
          aria-label="Delete section"
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            width: '100%',
            height: tempComponent.bannerHeight,
            borderRadius: tempComponent.bannerRadius,
            background: bannerImage ? `url(${bannerImage.url}) center/cover no-repeat` : '#f5f5f5',
            display: 'flex',
            justifyContent: tempComponent.logoImageJustifyContent,
            alignItems: tempComponent.logoImageAlignItems,
            padding: 2,
            position: 'relative',
            minHeight: 120
          }}
        >
          {!bannerImage && (
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2
              }}
            >
              <Typography color="text.secondary" mb={1}>
                Please add image
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              position: 'relative',
              zIndex: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: tempComponent.logoImageSize,
              height: tempComponent.logoImageSize
            }}
          >
            {logoImage ? (
              <Box
                component="img"
                src={logoImage.url}
                sx={{
                  width: tempComponent.logoImageSize,
                  height: tempComponent.logoImageSize,
                  borderRadius: `${tempComponent.logoImageRadius}%`,
                  objectFit: 'cover',
                  background: '#fff'
                }}
              />
            ) : (
              <Box
                sx={{
                  width: tempComponent.logoImageSize,
                  height: tempComponent.logoImageSize,
                  borderRadius: `${tempComponent.logoImageRadius}%`,
                  background: '#fff',
                  border: '1px dashed #aaa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary',
                  fontSize: 12
                }}
              >
                Please add image
              </Box>
            )}
          </Box>
        </Box>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 6 }} gap={2} display={'flex'} flexDirection={'column'}>
            <TextField
              variant="outlined"
              placeholder="Add Profile Name..."
              fullWidth
              size="small"
              value={tempComponent.mainTile}
              onChange={(e) => changeValue('mainTile', e.target.value)}
            />
            <TextField
              variant="outlined"
              placeholder="Add Field..."
              fullWidth
              size="small"
              value={tempComponent.subTitle}
              onChange={(e) => changeValue('subTitle', e.target.value)}
            />
          </Grid>
          <Grid item size={{ xs: 6 }} display={'flex'} flexDirection={'column'} gap={2}>
            {/* Banner Image File Box */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box flex={1} sx={{ border: '1px solid #ccc', borderRadius: 1, px: 2, py: 1, bgcolor: '#fafafa', fontSize: 14 }}>
                {bannerImage ? bannerImage.file.name : 'No banner image selected'}
              </Box>
              {bannerImage ? (
                <Button variant="outlined" color="error" size="small" onClick={() => setBannerImage(null)} sx={{ width: '120px' }}>
                  Remove Image
                </Button>
              ) : (
                <Button variant="contained" component="label" size="small" sx={{ width: '120px' }}>
                  Add Image
                  <input type="file" accept="image/*" hidden onChange={handleBannerChange} />
                </Button>
              )}
            </Box>
            {/* Logo Image File Box */}
            <Box display="flex" alignItems="center" gap={2}>
              <Box flex={1} sx={{ border: '1px solid #ccc', borderRadius: 1, px: 2, py: 1, bgcolor: '#fafafa', fontSize: 14 }}>
                {logoImage ? logoImage.file.name : 'No profile image selected'}
              </Box>
              {logoImage ? (
                <Button variant="outlined" color="error" size="small" sx={{ width: '120px' }} onClick={() => setLogoImage(null)}>
                  Remove Image
                </Button>
              ) : (
                <Button variant="contained" component="label" size="small" sx={{ width: '120px' }}>
                  Add Image
                  <input type="file" accept="image/*" hidden onChange={handleLogoChange} />
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Banner Image */}
          <Grid item size={{ xs: 6 }} display={'flex'} flexDirection={'column'}>
            <Typography variant="h3" gutterBottom>
              Banner Settings
            </Typography>

            {/* Height Slider */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                Height (px)
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Slider
                  min={100}
                  max={400}
                  value={tempComponent.bannerHeight}
                  onChange={(_, v) => changeValue('bannerHeight', v)}
                  valueLabelDisplay="auto"
                  sx={{ flex: 1 }}
                />
                <ValueLabelChip value={tempComponent.bannerHeight} />
              </Box>
            </Box>

            {/* Border Radius Slider */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" fontWeight="medium" gutterBottom>
                Border Radius (px)
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Slider
                  min={0}
                  max={50}
                  value={tempComponent.bannerRadius}
                  onChange={(_, v) => changeValue('bannerRadius', v)}
                  valueLabelDisplay="auto"
                  sx={{ flex: 1 }}
                />
                <ValueLabelChip value={tempComponent.bannerRadius} />
              </Box>
            </Box>
          </Grid>

          {/* Logo Image */}
          <Grid item size={{ xs: 6 }}>
            <Typography variant="h3" gutterBottom>
              Logo Settings
            </Typography>
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item size={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Size (px)
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Slider
                      min={40}
                      max={100}
                      value={tempComponent.logoImageSize}
                      onChange={(_, v) => changeValue('logoImageSize', v)}
                      valueLabelDisplay="auto"
                      sx={{ flex: 1 }}
                    />
                    <ValueLabelChip value={tempComponent.logoImageSize} />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Justify Content
                  </Typography>
                  <Select
                    variant="outlined"
                    value={tempComponent.logoImageJustifyContent}
                    onChange={(e) => changeValue('logoImageJustifyContent', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="flex-start">Left</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="flex-end">Right</MenuItem>
                  </Select>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item size={6}>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Border Radius (%)
                  </Typography>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Slider
                      min={0}
                      max={50}
                      value={tempComponent.logoImageRadius}
                      onChange={(_, v) => changeValue('logoImageRadius', v)}
                      valueLabelDisplay="auto"
                      sx={{ flex: 1 }}
                    />
                    <ValueLabelChip value={`${tempComponent.logoImageRadius}%`} />
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    Align Items
                  </Typography>
                  <Select
                    variant="outlined"
                    value={tempComponent.logoImageAlignItems}
                    onChange={(e) => changeValue('logoImageAlignItems', e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="flex-start">Top</MenuItem>
                    <MenuItem value="center">Center</MenuItem>
                    <MenuItem value="flex-end">Bottom</MenuItem>
                  </Select>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    );
  }

  // Preview mode
  return (
    <Box
      sx={{
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: component?.bannerHeight || defaultComponent.bannerHeight,
          borderRadius: component?.bannerRadius || defaultComponent.bannerRadius,
          background: bannerImage ? `url(${bannerImage.url}) center/cover no-repeat` : '#f5f5f5',
          display: 'flex',
          justifyContent: component?.logoImageJustifyContent || defaultComponent.logoImageJustifyContent,
          alignItems: component?.logoImageAlignItems || defaultComponent.logoImageAlignItems,
          padding: 2,
          position: 'relative',
          minHeight: 120
        }}
      >
        {!bannerImage && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2
            }}
          >
            <Typography color="text.secondary">Please add image</Typography>
          </Box>
        )}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: component?.logoImageSize || defaultComponent.logoImageSize,
            height: component?.logoImageSize || defaultComponent.logoImageSize
          }}
        >
          {logoImage ? (
            <Box
              component="img"
              src={logoImage.url}
              sx={{
                width: component?.logoImageSize || defaultComponent.logoImageSize,
                height: component?.logoImageSize || defaultComponent.logoImageSize,
                borderRadius: `${component?.logoImageRadius || defaultComponent.logoImageRadius}%`,
                objectFit: 'cover',
                background: '#fff'
              }}
            />
          ) : (
            <Box
              sx={{
                width: component?.logoImageSize || defaultComponent.logoImageSize,
                height: component?.logoImageSize || defaultComponent.logoImageSize,
                borderRadius: `${component?.logoImageRadius || defaultComponent.logoImageRadius}%`,
                background: '#fff',
                border: '1px dashed #aaa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'text.secondary',
                fontSize: 12
              }}
            >
              Please add image
            </Box>
          )}
        </Box>
      </Box>
      <Typography variant="h5" fontWeight="bold" mt={2}>
        {component?.mainTile || defaultComponent.mainTile}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {component?.subTitle || defaultComponent.subTitle}
      </Typography>
    </Box>
  );
});

export default ProfileSection;
