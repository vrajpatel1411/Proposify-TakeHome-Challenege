import { Server as SocketServer, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { Server as HttpsServer } from "https";

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
  const io: SocketServer = new SocketServer(httpServer, { cors: {} });
  let currentContent: String =
    "Write your story, ideas, or blog post here. Let your creativity flow!";
  const onConnection = async (socket: Socket) => {
    console.log("Connection started with socket id: " + socket.id);

    socket.emit("contentUpdate", currentContent);
    // Socket connection started
    socket.on("contentUpdate", (content: string) => {
      console.log("Received updated content:", content);
      currentContent = content;
      // Broadcast the updated content to all connected clients
      io.emit("contentUpdate", content);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: " + socket.id);
    });
  };

  io.on("connection", onConnection);

  console.log("Websocket server is running..");
};

export default startSocketServer;
