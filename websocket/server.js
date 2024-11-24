const WebSocket = require("ws");

// Create a WebSocket server on port 8080
const server = new WebSocket.Server({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

server.on("connection", (socket) => {
  console.log("A new client connected!");

  // Send a welcome message to the client
  socket.send("Welcome to the WebSocket server!");

  // Listen for messages from the client
  socket.on("message", (message) => {
    console.log(`Received: ${message}`);
    // Echo the message back to the client
    socket.send(`You said: ${message}`);
  });

  // Handle client disconnection
  socket.on("close", () => {
    console.log("A client disconnected.");
  });
});
