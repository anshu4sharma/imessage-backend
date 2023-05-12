const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const UserRoute = require("./src/router/Users");
const UpiRoute = require("./src/router/UpiLink");
const Msg = require("./src/model/message");
const RoomMsgs = require("./src/model/roomMessages");
require("./src/db/conn");
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://anshu-chat.vercel.app",
      "https://imessage.pages.dev",
      "https://upipayy.vercel.app",
      "https://upipay.anshusharma.me",
      "https://chat.anshusharma.me",
    ],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;
const limiter4auth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  headers: true, // Return rate limit info in the `RateLimit-*` headers
});

const limiter4links = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  headers: true, // Return rate limit info in the `RateLimit-*` headers
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use("/users", limiter4auth, UserRoute);
app.use("/genlink", limiter4links, UpiRoute);

// Socket.io server for chat app
io.on("connection", (socket) => {
  // Fetch all messages
  Msg.find().then((result) => {
    socket.emit("all_messages", result);
  });

  // Send message
  socket.on("send_msg", async (data) => {
    const newMsg = new Msg(data);
    await newMsg.save();
    socket.broadcast.emit("received_msg", newMsg);
  });

  // Room messaging
  socket.on("send_pvt_msg", async (data) => {
    const newMsg = new RoomMsgs(data);
    await newMsg.save();
    socket.to(data.room).emit("pvt_received_msg", newMsg);
  });

  socket.on("join_room", async (data) => {
    socket.join(data);
    const msg = await RoomMsgs.find({ room: data });
    socket.emit("showRoomMessages", msg);
  });
});

// Start the server
async function startServer() {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();
