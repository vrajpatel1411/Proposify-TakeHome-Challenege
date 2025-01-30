import { Editor } from "@tiptap/react";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import HighlightIcon from "@mui/icons-material/Highlight";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
interface MenuBarProps {
  editor: Editor;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className="button-style">
          <FormatBoldIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "is-active button-style"
              : "button-style"
          }>
          <FormatItalicIcon />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "is-active button-style"
              : "button-style"
          }>
          <StrikethroughSIcon />
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "is-active button-style"
              : "button-style"
          }>
          H1
        </button>

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive("left") ? "is-active button-style" : "button-style"
          }>
          <FormatAlignLeftIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive("center")
              ? "is-active button-style"
              : "button-style"
          }>
          <FormatAlignCenterIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive("right") ? "is-active button-style" : "button-style"
          }>
          <FormatAlignRightIcon />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive("justify")
              ? "is-active button-style"
              : "button-style"
          }>
          <FormatAlignJustifyIcon />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={
            editor.isActive("highlight")
              ? "is-active button-style"
              : "button-style"
          }>
          <HighlightIcon />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "is-active button-style"
              : "button-style"
          }>
          <FormatListBulletedIcon />
        </button>

        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "is-active button-style"
              : "button-style"
          }>
          <FormatListNumberedIcon />
        </button>
      </div>
    </div>
  );
};
export default MenuBar;
