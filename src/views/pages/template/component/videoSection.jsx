import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { MenuItem, Select, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DragIndicator from '@mui/icons-material/DragIndicator';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import VideoPlaceHolder from '../../../component/VideoPlaceHolder';
import CloseIcon from '@mui/icons-material/Close';

const defaultComponent = {
  mainTileAlign: 'left',
  mainTile: 'Video Title',
  url: []
};

const VideoSection = forwardRef(({ isEditing, deleteComponent }, ref) => {
  const theme = useTheme();

  const [component, setComponent] = useState(defaultComponent);
  const [tempComponent, setTempComponent] = useState(defaultComponent);
  const [urlInput, setUrlInput] = useState('');

  useImperativeHandle(ref, () => ({
    saveChanges: () => {
      console.log('Saving changes for VideoSection:', tempComponent);
      setComponent(tempComponent); // Save edits
    },
    cancelChanges: () => {
      console.log('Changes cancelled');
    },
    getContent: () => {
      const componentContent = {
        type: 'video',
        settings: {
          mainTileAlign: tempComponent.mainTileAlign
        },
        props: {
          mainTile: tempComponent.mainTile,
          url: tempComponent.url
        }
      };
      return componentContent;
    }
  }));

  const changeValue = (key, value) => {
    setTempComponent((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Add handler for drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tempComponent.url);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    changeValue('url', items);
  };

  // Add handler for add
  const handleAddUrl = () => {
    if (urlInput.trim() === '') return;
    changeValue('url', [...tempComponent.url, urlInput.trim()]);
    setUrlInput('');
  };

  // Add handler for delete
  const handleDeleteUrl = (index) => {
    const items = tempComponent.url.filter((_, i) => i !== index);
    changeValue('url', items);
  };

  useEffect(() => {
    setComponent(defaultComponent);
    setTempComponent(defaultComponent);
  }, []);

  const urlCount = tempComponent?.url?.length || 0;

  // Guard: if tempComponent or component is undefined, don't render
  if (!tempComponent || !component) return null;

  // Preview UI (show after save or when not editing)
  if (!isEditing) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, textAlign: component?.mainTileAlign || 'left' }}>
          {component?.mainTile}
        </Typography>
        <Grid container spacing={2}>
          {component?.url?.length > 0 ? (
            component.url.map((url, i) => (
              <Grid item size={12 / Math.max(1, Math.min(component.url.length, 4))} key={i}>
                <VideoPlaceHolder url={url} />
              </Grid>
            ))
          ) : (
            <Grid item size={12}>
              <Typography color="text.secondary">No videos to preview</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: theme.palette.grey.A400,
        borderRadius: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        p: 2,
        pt: 5,
        position: 'relative'
      }}
    >
      <IconButton
        size="small"
        color="error"
        sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}
        onClick={deleteComponent}
        aria-label="Delete section"
      >
        <CloseIcon />
      </IconButton>
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
        {tempComponent?.url.map((url, i) => (
          <Grid item size={12 / Math.max(1, Math.min(urlCount, 4))} key={i}>
            <VideoPlaceHolder url={url} />
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2}>
        <Grid item size={6}>
          <Grid container>
            <Grid item size={6}>
              <Box sx={{ mb: 3 }} display="flex" flexDirection="column" alignItems="flex-start">
                <Typography variant="body1" fontWeight="medium">
                  Video Title Align
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
            <Grid item size={12} gap={2} display="flex" flexDirection="row" justifyContent="space-between" alignItems="end">
              <Box display="flex" flexDirection="column" alignItems="flex-start" width={'70%'}>
                <Typography variant="body1" fontWeight="medium">
                  Add Video URL
                </Typography>
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  inputProps={{
                    min: 3,
                    max: 10,
                    step: 1
                  }}
                  disabled={urlCount >= 4}
                />
              </Box>
              <Button variant="outlined" sx={{ height: 40, width: '30%' }} onClick={handleAddUrl} disabled={urlCount >= 4}>
                Add
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item size={6} sx={{ border: '1px solid #ddd', borderRadius: '12px', padding: 2 }}>
          <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={2}>
            <Typography variant="body1" fontWeight="medium">
              Video List
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {/* show number of url acount only add 4 urls, show as 3/4*/}
              {urlCount}/4
            </Typography>
          </Box>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tempComponent.url.length === 0 ? (
                    <Typography color="text.secondary" sx={{ mt: 5 }} textAlign={'center'}>
                      No URL found
                    </Typography>
                  ) : (
                    tempComponent.url.map((item, index) => (
                      <Draggable key={item + index} draggableId={item + index} index={index}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              border: '1px solid #ddd',
                              borderRadius: '12px',
                              padding: '8px 12px',
                              mb: 1,
                              backgroundColor: '#fafafa'
                            }}
                          >
                            <span {...provided.dragHandleProps}>
                              <DragIndicator sx={{ cursor: 'grab', mr: 2, color: theme.palette.primary.main }} />
                            </span>
                            <Box
                              sx={{
                                flex: 1,
                                border: '1px solid #ccc',
                                borderRadius: '12px',
                                padding: '8px 14px',
                                backgroundColor: 'white',
                                mx: 2
                              }}
                            >
                              <Typography variant="body1">{item || 'No URL found'}</Typography>
                            </Box>
                            <IconButton size="small" color="error" onClick={() => handleDeleteUrl(index)}>
                              <DeleteOutline />
                            </IconButton>
                          </Box>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>
      </Grid>
    </Box>
  );
});

export default VideoSection;
