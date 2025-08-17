import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { MenuItem, Select, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DragIndicator from '@mui/icons-material/DragIndicator';
import DeleteOutline from '@mui/icons-material/DeleteOutline';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import LinkView from '../../../component/LinkView';
import CloseIcon from '@mui/icons-material/Close';

const defaultComponent = {
  links: []
};

const LinkSection = forwardRef(({ isEditing, deleteComponent }, ref) => {
  const theme = useTheme();
  const [component, setComponent] = useState();
  const [tempComponent, setTempComponent] = useState();
  const [urlInput, setUrlInput] = useState('');
  const [urlType, setUrlType] = useState();

  useImperativeHandle(ref, () => ({
    saveChanges: () => {
      setComponent(tempComponent); // Save edits to component state
    },
    cancelChanges: () => {
      setTempComponent(component); // Revert edits
    }
  }));

  const handleAddLink = () => {
    if (!urlInput || !urlType) return;
    setTempComponent((prev) => ({
      ...prev,
      links: [...(prev?.links || []), { url: urlInput, type: urlType }]
    }));
    setUrlInput('');
  };

  const handleDeleteLink = (index) => {
    setTempComponent((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tempComponent.links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTempComponent((prev) => ({ ...prev, links: items }));
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
        p: 2,
        position: 'relative'
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
      <Grid container spacing={2}>
        <Grid item size={12}>
          <Box
            sx={{
              border: '2px dashed rgba(0, 0, 0, 0.23)',
              borderRadius: 2,
              p: 2
            }}
          >
            {tempComponent?.links.map((value, index) => (
              <LinkView type={value?.type} key={index} link={value.url} />
            ))}
          </Box>
        </Grid>
        <Grid item size={6}>
          <Box display={'flex'} alignItems="end" justifyContent={'space-between'} gap={2}>
            <Box display="flex" flexDirection="column" alignItems="flex-start" width="50%">
              <Typography variant="body1" fontWeight="medium">
                Add Link
              </Typography>
              <TextField variant="outlined" size="small" fullWidth value={urlInput} onChange={(e) => setUrlInput(e.target.value)} />
            </Box>
            <Select
              variant="outlined"
              value={urlType}
              onChange={(e) => setUrlType(e.target.value)}
              fullWidth
              sx={{ height: 40, width: '30%' }}
            >
              <MenuItem value="instagram">Instagram</MenuItem>
              <MenuItem value="facebook">FaceBook</MenuItem>
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="linkedin">LinkedIn</MenuItem>
              <MenuItem value="youtube">YouTube</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </Select>
            <Button variant="outlined" sx={{ height: 40, width: '20%' }} onClick={handleAddLink}>
              Add
            </Button>
          </Box>
        </Grid>
        <Grid item size={6}>
          <Box display={'flex'} alignItems={'center'}>
            <Typography variant="body1" fontWeight="medium">
              {`Link List (${tempComponent?.links?.length || 0})`}
            </Typography>
          </Box>
          <Box sx={{ border: '1px solid #ddd', borderRadius: '5px', padding: 2 }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="links-droppable">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {!tempComponent?.links || tempComponent.links.length === 0 ? (
                      <Typography color="text.secondary" sx={{ mt: 2 }} textAlign={'center'}>
                        Pleas add links
                      </Typography>
                    ) : (
                      tempComponent.links.map((item, index) => (
                        <Draggable key={item.url + index} draggableId={item.url + index} index={index}>
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
                                <Typography variant="body2">
                                  {item.url || 'No URL found'} ({item.type})
                                </Typography>
                              </Box>
                              <IconButton size="small" color="error" onClick={() => handleDeleteLink(index)}>
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
          </Box>
        </Grid>
      </Grid>
    </Box>
  ) : (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {component?.links?.length ? (
          component.links.map((value, index) => <LinkView type={value?.type} key={index} link={value.url} />)
        ) : (
          <Typography color="text.secondary">No links to preview</Typography>
        )}
      </Box>
    </Box>
  );
});

export default LinkSection;
