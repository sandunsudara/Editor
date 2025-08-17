import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import TextEditor from '../../../component/TextEditor';
import { Box } from '@mui/material';

/*
  Enhanced TextSection component with formatting toolbar
  - Bold, italic, underline buttons
  - Heading (H1, H2, H3) dropdown
  - Font family dropdown
  - Text alignment dropdown (left, center, right, justify)
  - Lists dropdown (bullet, numbered)
  - Font color picker
*/

const TextSection = forwardRef(({ isEditing }, ref) => {
  const [component, setComponent] = useState({ content: '' });
  const [tempComponent, setTempComponent] = useState({ content: '' });
  const [focused, setFocused] = useState(false);
  const [hasContent, setHasContent] = useState(false);

  // State for dropdown menus
  const [openDropdown, setOpenDropdown] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Add text here...',
        showOnlyWhenEditable: false
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify']
      }),
      TextStyle,
      Color,
      FontFamily
    ],
    content: tempComponent.content || '',
    editorProps: {
      attributes: {
        class: 'editor-content',
        'data-placeholder': 'Add text here...'
      }
    }
  });

  // Keep editor content in sync when tempComponent changes (e.g., cancelChanges)
  useEffect(() => {
    if (!editor) return;
    // update only if different to avoid resetting cursor unnecessarily
    const currentHTML = editor.getHTML();
    const desired = tempComponent.content || '';
    if (currentHTML !== desired) {
      editor.commands.setContent(desired);
    }
  }, [editor, tempComponent.content]);

  // Track focus and content to toggle orange border
  useEffect(() => {
    if (!editor) return;

    const updateHasContent = () => {
      const text = editor.getText().trim();
      setHasContent(text.length > 0);
    };

    // initial check
    updateHasContent();

    const onUpdate = () => updateHasContent();
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

    editor.on('update', onUpdate);
    editor.on('focus', onFocus);
    editor.on('blur', onBlur);

    return () => {
      editor.off('update', onUpdate);
      editor.off('focus', onFocus);
      editor.off('blur', onBlur);
    };
  }, [editor]);

  // expose imperative methods to parent via ref
  useImperativeHandle(
    ref,
    () => ({
      saveChanges: () => {
        if (editor) {
          const html = editor.getHTML();
          console.log(html);
          const updated = { ...component, content: html };
          setComponent(updated);
          setTempComponent(updated);
        }
      },
      cancelChanges: () => {
        setTempComponent(component);
        if (editor) {
          editor.commands.setContent(component.content || '');
        }
      }
    }),
    [editor, component]
  );

  // cleanup editor on unmount
  useEffect(() => {
    return () => {
      if (editor) editor.destroy();
    };
  }, [editor]);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!openDropdown) return;

    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const active = focused || hasContent;
  // Dropdown toggle handler

  return isEditing ? (
    <TextEditor editor={editor} active={active} />
  ) : (
    <Box p={2} dangerouslySetInnerHTML={{ __html: component.content || '' }} />
  );
});

export default TextSection;
