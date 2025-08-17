import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import {
  BiAlignJustify,
  BiAlignLeft,
  BiAlignMiddle,
  BiAlignRight,
  BiBold,
  BiChevronDown,
  BiFont,
  BiItalic,
  BiListOl,
  BiListUl,
  BiPalette,
  BiText,
  BiUnderline
} from 'react-icons/bi';

// add more font families and colors as needed
const fontFamilies = [
  { name: 'Default', value: 'inherit' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Times', value: 'Times New Roman, serif' }
];
const colorOptions = [
  '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'
];

const TextEditorMenuItemsList = ({ editor }) => {
  const [anchorEl, setAnchorEl] = useState({});

  const handleMenuOpen = (menu) => (event) => {
    setAnchorEl({ ...anchorEl, [menu]: event.currentTarget });
  };
  const handleMenuClose = (menu) => () => {
    setAnchorEl({ ...anchorEl, [menu]: null });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {/* Bold */}
      <IconButton
        size="small"
        color={editor.isActive('bold') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <BiBold />
      </IconButton>
      {/* Italic */}
      <IconButton
        size="small"
        color={editor.isActive('italic') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <BiItalic />
      </IconButton>
      {/* Underline */}
      <IconButton
        size="small"
        color={editor.isActive('underline') ? 'primary' : 'default'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <BiUnderline />
      </IconButton>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      {/* Heading Dropdown */}
      <IconButton size="small" onClick={handleMenuOpen('heading')} title="Text Style">
        <BiText />
        <BiChevronDown />
      </IconButton>
      <Menu anchorEl={anchorEl.heading} open={Boolean(anchorEl.heading)} onClose={handleMenuClose('heading')}>
        <MenuItem
          onClick={() => {
            editor.chain().focus().setParagraph().run();
            handleMenuClose('heading')();
          }}
        >
          Normal Text
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            handleMenuClose('heading')();
          }}
          sx={{ fontSize: '1.5em' }}
        >
          Heading 1
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            handleMenuClose('heading')();
          }}
          sx={{ fontSize: '1.3em' }}
        >
          Heading 2
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            handleMenuClose('heading')();
          }}
          sx={{ fontSize: '1.1em' }}
        >
          Heading 3
        </MenuItem>
      </Menu>
      {/* Font Family Dropdown */}
      <IconButton size="small" onClick={handleMenuOpen('fontFamily')} title="Font Family">
        <BiFont />
        <BiChevronDown />
      </IconButton>
      <Menu anchorEl={anchorEl.fontFamily} open={Boolean(anchorEl.fontFamily)} onClose={handleMenuClose('fontFamily')}>
        {fontFamilies.map((font) => (
          <MenuItem
            key={font.value}
            onClick={() => {
              editor.chain().focus().setFontFamily(font.value).run();
              handleMenuClose('fontFamily')();
            }}
          >
            <span style={{ fontFamily: font.value }}>{font.name}</span>
          </MenuItem>
        ))}
      </Menu>
      {/* Font Color Dropdown */}
      <IconButton size="small" onClick={handleMenuOpen('fontColor')} title="Font Color">
        <BiPalette />
        <BiChevronDown />
      </IconButton>
      <Menu anchorEl={anchorEl.fontColor} open={Boolean(anchorEl.fontColor)} onClose={handleMenuClose('fontColor')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 8 }}>
          {colorOptions.map((color) => (
            <div
              key={color}
              onClick={() => {
                editor.chain().focus().setColor(color).run();
                handleMenuClose('fontColor')();
              }}
              style={{ width: 24, height: 24, backgroundColor: color, borderRadius: '50%', border: '1px solid #ccc', cursor: 'pointer' }}
            />
          ))}
        </div>
      </Menu>
      <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
      {/* Text Alignment Dropdown */}
      <IconButton size="small" onClick={handleMenuOpen('textAlign')} title="Text Alignment">
        <BiAlignLeft />
        <BiChevronDown />
      </IconButton>
      <Menu anchorEl={anchorEl.textAlign} open={Boolean(anchorEl.textAlign)} onClose={handleMenuClose('textAlign')}>
        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign('left').run();
            handleMenuClose('textAlign')();
          }}
        >
          <BiAlignLeft />&nbsp;Left
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign('center').run();
            handleMenuClose('textAlign')();
          }}
        >
          <BiAlignMiddle />&nbsp;Center
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign('right').run();
            handleMenuClose('textAlign')();
          }}
        >
          <BiAlignRight />&nbsp;Right
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().setTextAlign('justify').run();
            handleMenuClose('textAlign')();
          }}
        >
          <BiAlignJustify />&nbsp;Justify
        </MenuItem>
      </Menu>
      {/* Lists Dropdown */}
      <IconButton size="small" onClick={handleMenuOpen('lists')} title="Lists">
        <BiListUl />
        <BiChevronDown />
      </IconButton>
      <Menu anchorEl={anchorEl.lists} open={Boolean(anchorEl.lists)} onClose={handleMenuClose('lists')}>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleBulletList().run();
            handleMenuClose('lists')();
          }}
        >
          <BiListUl />&nbsp;Bullet List
        </MenuItem>
        <MenuItem
          onClick={() => {
            editor.chain().focus().toggleOrderedList().run();
            handleMenuClose('lists')();
          }}
        >
          <BiListOl />&nbsp;Numbered List
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TextEditorMenuItemsList;
