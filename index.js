const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const UserRoute = require("./src/router/Users");
const Msg = require("./src/model/message");
const jwt = require("jsonwebtoken");
const RoomMsgs = require("./src/model/roomMessages");
require("./src/db/conn");
dotenv.config();
const app = express();
const server = http.createServer(app);
const JWT_SECRET = process.env.JWT_SECRET;

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use("/users", UserRoute);

let onlineUser = new Map();
// Socket.io server for chat app
io.on("connection", (socket) => {
  // onlineUser.set
  socket.on("jwtToken", (data) => {
    try {
      // console.log(data);
      let { id, ...rest } = jwt.verify(data, JWT_SECRET);
      onlineUser.set(id, socket.id);
      console.log(onlineUser);
      // console.log(rest);
    } catch (error) {
      console.log(error);
    }
  });

  try {
    // Fetch all messages
    Msg.find().then((result) => {
      socket.emit("old_messages", result);
    });
  } catch (error) {
    console.log(error);
  }

  // Send message to everyone in brodcast
  socket.on("send_msg", async (data) => {
    try {
      const newMsg = new Msg(data);
      await newMsg.save();
      socket.broadcast.emit("received_msg", newMsg);
    } catch (error) {
      console.log(error);
    }
  });

  // Room messaging
  socket.on("send_pvt_msg", async (data) => {
    try {
      const newMsg = new RoomMsgs(data);
      await newMsg.save();
      socket.to(data.room).emit("pvt_received_msg", newMsg);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("join_room", async (data) => {
    try {
      socket.join(data);
      const msg = await RoomMsgs.find({ room: data });
      socket.emit("showRoomMessages", msg);
    } catch (error) {
      console.log(error);
    }
  });

  // Send message to specific user
  socket.on("send_personal_msg", async (data) => {
    try {
      const { id, msg, Usrname, receiverId } = data;
      if (receiverId===id) {
        console.log("sender and reciver are same");
        return
      }
      let socketIdTosend = onlineUser.get(receiverId);
      const newMsg = new Msg(data);
      await newMsg.save();
      io.to(socketIdTosend).emit("received_personal_msg", newMsg);
    } catch (error) {
      console.log(error);
    }
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
