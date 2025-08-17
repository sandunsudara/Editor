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
      console.log('Calling saveChanges for component', idx, 'ref:', ref, 'ref.current:', ref?.current);
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

  // Function to render each component based on its type
  const renderComponent = (component, idx) => {
    // Always assign a ref for every component
    if (!componentRefs.current[idx].current) {
      componentRefs.current[idx] = createRef();
    } else {
      console.log('ref found', componentRefs.current[idx]);
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
        >
          {components.map((component, idx) => renderComponent(component, idx))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default Template;
