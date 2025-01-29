import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

var jwt = require("jsonwebtoken");

const JWT_SECRET = "your-jwt-secret"; // Same secret as in index.ts

// In-Memory Database Simulation
interface Content {
  id: string;
  content: string;
}

class InMemoryDatabase {
  private contentStore: { [key: string]: Content } = {};

  saveContent(id: string, content: string): Content {
    const newContent: Content = { id, content };
    this.contentStore[id] = newContent;
    return newContent;
  }

  getContent(id: string): Content | undefined {
    return this.contentStore[id];
  }

  updateContent(id: string, content: string): Content | undefined {
    const existingContent = this.contentStore[id];
    if (existingContent) {
      existingContent.content = content;
      return existingContent;
    }
    return undefined;
  }

  getAllContent(): Content[] {
    return Object.values(this.contentStore);
  }
}

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
  const io: SocketServer = new SocketServer(httpServer, { cors: {} });

  const db = new InMemoryDatabase();
  const defaultContent =
    "Write your story, ideas, or blog post here. Let your creativity flow!";

  const initialContent = db.saveContent("1", defaultContent);

  const onConnection = (socket: Socket) => {
    console.log("Connection started with socket id: " + socket.id);

    // Get the token from the client (assuming it's sent in the query string or headers)
    const token = socket.handshake.query.token as string;
    if (!token) {
      socket.emit("error", "Authentication required");
      socket.disconnect();
      return;
    }

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) {
        socket.emit("error", "Invalid or expired token");
        socket.disconnect();
        return;
      }

      console.log("Authenticated user:", user.username);

      // Send the current content to the newly connected client
      socket.emit("contentUpdate", initialContent.content);

      // Listen for content updates from this client
      socket.on("contentUpdate", (content: string) => {
        console.log("Received updated content:", content);

        const updatedContent = db.updateContent("1", content);

        if (updatedContent) {
          console.log("Broadcasting updated content to all clients");
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
