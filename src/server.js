import { createServer } from "https";
import { readFileSync } from "fs";
import { Server } from "socket.io";

// Load your certificates
const server = createServer({
  cert: readFileSync("../cert.pem"),
  key: readFileSync("../key.pem"),
});

// Create a Socket.io server
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Listen for 'event-g' from this client
  socket.on("drag", (obj) => {
    socket.broadcast.emit("recive-drag", obj);
    console.log(obj);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(8080, () => {
  console.log("Socket.io server is running on wss://localhost:8080");
});
