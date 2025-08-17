import TextEditorMenuItemsList from './TextEditorMenuItemsList';

const TextEditorMenuItems = ({ editor }) => {
  return (
    editor && <TextEditorMenuItemsList editor={editor} />
  );
};

export default TextEditorMenuItems;
