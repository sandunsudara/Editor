import { Box, Button, Grid, Stack } from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import LinkIcon from '@mui/icons-material/Link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import IconButton from '@mui/material/IconButton';
import FormatColorFillOutlined from '@mui/icons-material/FormatColorFillOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import ProfileSection from './component/profileSection';
import { createRef, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import TextSection from './component/textSection';
import ImageSection from './component/imageSection';
import VideoSection from './component/videoSection';
import LinkSection from './component/linkSection';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import ThemeSettingDrawer from '../../component/ThemeSettingDrawer';
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import DragHandleOutlined from '@mui/icons-material/DragHandleOutlined';

const iconStyle = {
  border: '1px solid #E0E0E0',
  width: 56,
  height: 56,
  marginBottom: '8px',
  color: '#828282'
};

const editorOptions = [
  {
    label: 'Person',
    icon: <PersonOutlineIcon fontSize="medium" />,
    value: 'person'
  },
  {
    label: 'Text',
    icon: <TextFieldsIcon fontSize="medium" />,
    value: 'text'
  },
  {
    label: 'Image',
    icon: <ImageIcon fontSize="medium" />,
    value: 'image'
  },
  {
    label: 'Video',
    icon: <OndemandVideoIcon fontSize="medium" />,
    value: 'video'
  },
  {
    label: 'Link',
    icon: <LinkIcon fontSize="medium" />,
    value: 'link'
  },
  {
    label: 'Background Color',
    icon: <FormatColorFillOutlined fontSize="medium" />,
    value: 'background-color'
  }
];

const Template = () => {
  const [components, setComponents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const componentRefs = useRef([]);
  const theme = useTheme();

  // Function to delete a component by index
  const deleteComponent = (idx) => {
    setComponents((prev) => prev.filter((_, i) => i !== idx));
    // Remove the ref as well
    componentRefs.current.splice(idx, 1);
  };

  // Function to handle saving changes
  const handleSave = () => {
    componentRefs.current.forEach((ref, idx) => {
      if (ref && ref.current && typeof ref.current.saveChanges === 'function') {
        ref.current.saveChanges();
      } else {
        console.warn('saveChanges not found for component', idx);
      }
    });
    setIsEditing(false);
  };

  // Function to cancel changes in all components
  const handleCancel = () => {
    componentRefs.current.forEach((ref, idx) => {
      console.log('Calling cancelChanges for component', idx, 'ref:', ref, 'ref.current:', ref?.current);
      if (ref && ref.current && typeof ref.current.cancelChanges === 'function') {
        ref.current.cancelChanges();
      } else {
        console.warn('cancelChanges not found for component', idx);
      }
    });
    setIsEditing(false);
  };

  // Function to add a new component based on the selected option
  const addComponent = (value) => {
    setComponents((prev) => [...prev, { type: value }]);
  };

  // Ensure refs array is always in sync with components array
  if (componentRefs.current.length !== components.length) {
    componentRefs.current = components.map((_, idx) => componentRefs.current[idx] || createRef());
  }

  // Handler for drag and drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newComponents = Array.from(components);
    const [removed] = newComponents.splice(result.source.index, 1);
    newComponents.splice(result.destination.index, 0, removed);
    setComponents(newComponents);
    // Keep refs in sync
    const newRefs = Array.from(componentRefs.current);
    const [removedRef] = newRefs.splice(result.source.index, 1);
    newRefs.splice(result.destination.index, 0, removedRef);
    componentRefs.current = newRefs;
  };

  // Function to render each component based on its type
  const renderComponent = (component, idx) => {
    // Always assign a ref for every component
    if (!componentRefs.current[idx].current) {
      componentRefs.current[idx] = createRef();
    }
    switch (component.type) {
      case 'text':
        return (
          <TextSection ref={componentRefs.current[idx]} key={idx} isEditing={isEditing} deleteComponent={() => deleteComponent(idx)} />
        );
      case 'image':
        return (
          <ImageSection ref={componentRefs.current[idx]} key={idx} isEditing={isEditing} deleteComponent={() => deleteComponent(idx)} />
        );
      case 'video':
        return (
          <VideoSection ref={componentRefs.current[idx]} key={idx} isEditing={isEditing} deleteComponent={() => deleteComponent(idx)} />
        );
      case 'person':
        return (
          <ProfileSection key={idx} isEditing={isEditing} ref={componentRefs.current[idx]} deleteComponent={() => deleteComponent(idx)} />
        );
      case 'link':
        return (
          <LinkSection key={idx} isEditing={isEditing} ref={componentRefs.current[idx]} deleteComponent={() => deleteComponent(idx)} />
        );
      case 'background-color':
        return (
          <Box key={idx} ref={componentRefs.current[idx]} sx={{ padding: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            Background Color Component
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ThemeSettingDrawer setSettingsDrawerOpen={setSettingsDrawerOpen} settingsDrawerOpen={settingsDrawerOpen} />
      <Grid container spacing={2}>
        <Grid item size={{ xs: 12 }} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }} gap={1}>
          {!isEditing ? (
            // Edit Button
            <IconButton
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                backgroundColor: theme.palette.primary.main,
                marginRight: 1,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
              onClick={() => setIsEditing(true)}
            >
              <EditIcon sx={{ color: theme.palette.secondary.light }} fontSize="small" />
            </IconButton>
          ) : (
            <Box sx={{ mr: 1 }}>
              {/* Save Button */}
              <IconButton
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  marginRight: 1,
                  '&:hover': {
                    backgroundColor: theme.palette.success.dark
                  }
                }}
                onClick={handleSave}
              >
                <SaveIcon sx={{ color: theme.palette.secondary.light }} fontSize="medium" />
              </IconButton>

              {/* Cancel Button */}
              <IconButton
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.secondary.dark,
                  '&:hover': {
                    backgroundColor: theme.palette.error.dark
                  }
                }}
                onClick={handleCancel}
              >
                <CloseIcon sx={{ color: theme.palette.secondary.light }} fontSize="medium" />
              </IconButton>
            </Box>
          )}
          <Button variant={'outlined'}>Publish</Button>
        </Grid>
        <Grid item size={{ xs: 1 }} height={'400px'}>
          <Box
            mb={2}
            sx={{
              background: '#fff',
              width: 100,
              borderRadius: '16px',
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0px 0px 0px 1px #F1F1F1'
            }}
          >
            <Stack spacing={2} alignItems="center">
              {editorOptions.map((option) => (
                <IconButton sx={iconStyle} key={option.value} onClick={() => addComponent(option.value)}>
                  {option.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>
          <Box
            sx={{
              background: '#fff',
              width: 100,
              borderRadius: '16px',
              padding: '16px 0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: '0px 0px 0px 1px #F1F1F1'
            }}
          >
            <IconButton sx={iconStyle} onClick={() => setSettingsDrawerOpen(true)}>
              <SettingsOutlined sx={{ color: '#828282' }} fontSize="medium" />
            </IconButton>
          </Box>
        </Grid>
        <Grid item size={{ xs: 11 }}>
          <Box
            sx={{
              background: '#fff',
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: 'calc(100vh - 200px)',
              minHeight: '400px',
              overflow: 'auto',
              p: 2,
              gap: 2
            }}
            id="draggable-scroll-container"
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable-components">
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    sx={{ minHeight: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    {components.map((component, idx) => (
                      <Draggable key={idx} draggableId={`component-${idx}`} index={idx} isDragDisabled={!isEditing}>
                        {(provided, snapshot) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            sx={{
                              ...provided.draggableProps.style,
                              marginBottom: 2,
                              opacity: snapshot.isDragging ? 0.7 : 1,
                              borderRadius: 2,
                              boxShadow: snapshot.isDragging ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                              position: 'relative',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            {/* Drag handle at the top, only in edit mode */}
                            {isEditing && (
                              <Box
                                {...provided.dragHandleProps}
                                sx={{
                                  width: '100%',
                                  height: 28,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',
                                  cursor: 'grab',
                                  background: '#e0e0e0',
                                  borderBottom: '1px solid #ddd',
                                  userSelect: 'none',
                                  fontSize: 18,
                                  color: '#888',
                                  letterSpacing: 2,
                                  borderRadius: '10px 10px 0 0',
                                  position: 'relative',
                                  px: 2
                                }}
                                aria-label="Drag to reorder"
                              >
                                {/* Component name on the left */}
                                <Box sx={{ fontWeight: 600, fontSize: 15, color: '#666', minWidth: 80 }}>
                                  {component.type.charAt(0).toUpperCase() + component.type.slice(1).replace('-', ' ')}
                                </Box>
                                {/* Drag icon centered absolutely */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    left: '50%',
                                    top: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    pointerEvents: 'none'
                                  }}
                                >
                                  <DragHandleOutlined />
                                </Box>
                              </Box>
                            )}
                            {/* Component content below drag handle */}
                            <Box sx={{ paddingTop: 1 }}>{renderComponent(component, idx)}</Box>
                          </Box>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default Template;
