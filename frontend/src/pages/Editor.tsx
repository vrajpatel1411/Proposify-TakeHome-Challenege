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
import useAuth from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import BulletList from "@tiptap/extension-bullet-list";

const extensions = [
  Document,
  BulletList,
  ListItem,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  StarterKit,
];

const Editor = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const username = localStorage.getItem("username");
  const [socket, setSocket] = useState<ReturnType<typeof io>>();
  const [isDisconnected, setIsDisconnected] = useState(false);

  const editor = useEditor({
    extensions,
    content: "",
    onUpdate: ({ editor }) => {
      const updatedContent = editor.getHTML();

      if (socket) {
        socket.emit("contentUpdate", updatedContent);
      }
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      console.log("hello");
    }

    const newSocket = io("http://localhost:3005", {
      auth: {
        token: token,
      },
    });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to WebSocket server!");
      setIsDisconnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server!");
      setIsDisconnected(true);
    });

    newSocket.on("contentUpdate", (updatedContent) => {
      console.log(editor);
      if (editor) {
        const currentContent = editor.getHTML();
        console.log("Inside content update websocket");
        if (updatedContent !== currentContent) {
          const selection = editor.state.selection;
          editor.commands.setContent(updatedContent);

          editor.commands.setTextSelection(selection.anchor);
        }
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-[90%] h-screen my-auto mx-auto p-4">
      <div className="flex justify-between items-center mb-4 p-2 border-b">
        <h1 className="text-xl font-bold">Collaborative Editor</h1>
        <div className="flex items-center space-x-4">
          {username && <span className="font-medium">Hello, {username}!</span>}
          <button
            onClick={() => logout()}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Logout
          </button>
        </div>
      </div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      {isDisconnected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold text-red-600">Connection Lost</h2>
            <p className="text-gray-700">
              WebSocket disconnected. Trying to reconnect...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
