import TextEditorMenuItems from './TextEditorMenuItems';
import { Box } from '@mui/material';
import { EditorContent } from '@tiptap/react';
import { styled } from '@mui/material/styles';

const EditorWrapper = styled(Box)(({ theme, active }) => ({
  position: 'relative',
  borderRadius: 15,
  padding: 14,
  background: '#fff',
  border: `1px dashed ${active ? '#e9644a' : '#bdbdbd'}`,
  maxWidth: '100%'
}));

const EditorInner = styled(Box)({
  borderRadius: 12,
  border: '1px dotted #d9d9d9',
  padding: 18,
  minHeight: 72,
  boxSizing: 'border-box',
  '&:focus-within': {
    boxShadow: '0 0 0 3px rgba(255,140,0,0.06)'
  }
});

const EditorContentStyled = styled(EditorContent)({
  outline: 'none',
  fontSize: 15,
  color: '#222',
  lineHeight: 1.4,
  minHeight: 36,
  '& p': { margin: 0 },
  '& p.is-empty:first-of-type::before': {
    content: 'attr(data-placeholder)',
    color: '#cfcfcf',
    fontStyle: 'italic',
    pointerEvents: 'none',
    whiteSpace: 'pre-wrap'
  },
  "& [contenteditable='true']": {
    outline: 'none'
  }
});

const TextEditor = ({ editor, active }) => {
  return (
    <EditorWrapper active={active ? 1 : 0}>
      <TextEditorMenuItems editor={editor} />
      <EditorInner>{editor ? <EditorContentStyled editor={editor} /> : <Box>Loading editor…</Box>}</EditorInner>
    </EditorWrapper>
  );
};

export default TextEditor;
