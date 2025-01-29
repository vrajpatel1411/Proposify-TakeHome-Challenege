// src/pages/Editor.tsx
import { useEditor, EditorContent } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";

import TextStyle from "@tiptap/extension-text-style";
import ListItem from "@tiptap/extension-list-item";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "../Components/MenuBar";
import { useEffect, useState } from "react";
import Document from "@tiptap/extension-document";
import { io } from "socket.io-client";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

const extensions = [
  Document,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit,
];

const Editor = () => {
  const [socket, setSocket] = useState<ReturnType<typeof io>>();
  const editor = useEditor({
    extensions,
    content: "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();
      // Emit content updates to the server
      if (socket) {
        socket.emit("contentUpdate", updatedContent);
      }
    },
  });

  useEffect(() => {
    const newSocket = io("http://localhost:3005"); // Connect to WebSocket server
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server!");
    });

    // Handle content updates received from the server
    newSocket.on("contentUpdate", (updatedContent) => {
      if (editor) {
        const currentContent = editor.getHTML();

        if (updatedContent !== currentContent) {
          const selection = editor.state.selection;
          editor.commands.setContent(updatedContent);

          editor.commands.setTextSelection(selection.anchor);
        }
      }
    });

    return () => {
      newSocket.disconnect(); // Disconnect socket on cleanup
    };
  }, [editor]);

  if (!editor) {
    return null; // Render nothing until the editor is initialized
  }

  return (
    <div className="max-w-[90%] h-screen my-auto mx-auto p-4">
      <MenuBar editor={editor} /> {/* Pass the editor instance to MenuBar */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
