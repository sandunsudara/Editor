import { useRef, useState, useEffect } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Close, Edit } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const UploadContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  aspectRatio: '4/3',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid #eee'
  // Best practice: let parent/grid item set width, e.g. <Grid item xs={6}>
}));

const UploadArea = styled(Box)(({ theme, isDragActive }) => ({
  width: '100%',
  height: '100%',
  border: `2px dashed ${isDragActive ? theme.palette.grey[600] : theme.palette.grey[400]}`,
  borderRadius: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'pointer',
  padding: '20px',
  textAlign: 'center',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? theme.palette.grey[100] : 'transparent',
  '&:hover': {
    borderColor: theme.palette.grey[600]
  }
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: theme.palette.grey[100],
  borderRadius: '20px',
  overflow: 'hidden'
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  padding: '8px',
  zIndex: 10,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'scale(1.1)'
  }
}));

const ImageUploader = ({ image, onChange }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Create preview URL when image file is available
    if (image instanceof File) {
      console.log(image);
      const url = URL.createObjectURL(image);
      console.log(url);
      setPreviewUrl(url);

      // Clean up the URL when component unmounts or image changes
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [image]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Maximum size is 10MB.');
      return;
    }

    // Pass the file object directly to parent instead of data URL
    if (onChange) onChange(file);
  };

  const removeImage = () => {
    if (onChange) onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <UploadContainer>
      <input type="file" ref={inputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />

      {!image ? (
        <UploadArea
          isDragActive={isDragActive}
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Edit sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
          <Typography color="text.secondary">Maximum Upload Size 10MB, Aspect Ratio 4:3</Typography>
        </UploadArea>
      ) : (
        <ImagePreview>
          <RemoveButton size="small" onClick={removeImage} aria-label="remove image">
            <Close sx={{ color: 'error.main' }} />
          </RemoveButton>
          <Box
            component="img"
            src={previewUrl}
            alt="Preview"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </ImagePreview>
      )}
    </UploadContainer>
  );
};

export default ImageUploader;