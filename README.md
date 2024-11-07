# Real-time 3D Object Interaction using Socket.IO and Three.js

This project enables real-time 3D object manipulation and hand tracking in VR using **Socket.IO** for client-server communication, **Three.js** for rendering 3D environments, and **WebXR** for VR experiences. Users can interact with objects in a collaborative VR environment where object positions and rotations are synchronized across multiple clients.

## Key Features

- **Real-Time Synchronization**: Instantly broadcast and receive drag events for 3D objects in a virtual environment, allowing multiple users to interact with the same 3D scene simultaneously.
- **Secure WebSocket Connections**: Uses HTTPS and WebSocket Secure (WSS) for secure, encrypted communication.
- **VR Hand Tracking**: Integrates WebXR hand tracking, enabling VR controllers and hand gestures to manipulate objects.
- **3D UI with Interactive GUI**: Includes an interactive GUI using `lil-gui` to manage model settings, reset transformations, and highlight parts.
- **Dynamic Group Management**: Allows groups of objects to move together, with interactive GUI overlays that update position and orientation in real-time.

## Setup

### Server-Side (Socket.IO)

The server code is configured for secure HTTPS connections, requiring SSL certificates.

1. **Create HTTPS Server**:
   ```javascript
   import { createServer } from "https";
   import { readFileSync } from "fs";
   import { Server } from "socket.io";

   const server = createServer({
     cert: readFileSync("../cert.pem"),
     key: readFileSync("../key.pem"),
   });
   const io = new Server(server);
   ```
