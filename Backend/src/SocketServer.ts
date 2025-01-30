import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";
import InMemoryContentDatabase from "./Model/Context";
var jwt = require("jsonwebtoken");

const JWT_SECRET = "Sample JWT Secret"; // Same secret as in index.ts

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
  const io: SocketServer = new SocketServer(httpServer, { cors: {} });

  const db = new InMemoryContentDatabase();
  const defaultContent =
    "Write your story, ideas, or blog post here. Let your creativity flow!";

  const initialContent = db.saveContent("1", defaultContent);

  const onConnection = (socket: Socket) => {
    console.log("Connection started with socket id: " + socket.id);

    const token = socket.handshake.auth.token as string;

    if (!token) {
      socket.emit("error", "Authentication required");
      socket.disconnect();
      return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        console.log("Invalid or expired token");
        socket.emit("error", "Invalid or expired token");
        socket.disconnect();
        return;
      }

      // Send the current content to the newly connected client
      socket.emit("contentUpdate", initialContent.content);

      // Listen for content updates from this client
      socket.on("contentUpdate", (content: string) => {
        const updatedContent = db.updateContent("1", content);

        if (updatedContent) {
          io.emit("contentUpdate", updatedContent.content);
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected: " + socket.id);
      });
    });
  };

  io.on("connection", onConnection);

  console.log("WebSocket server is running..");
};

export default startSocketServer;
