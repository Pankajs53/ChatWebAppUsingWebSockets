import express from "express";
import { dbConnect } from "./utils/features.js";
import cookieParser from "cookie-parser";
import {
  createUser,
  createMessages,
  createSingleChats,
  createGroupChats,
  createMessagesInChat,
} from "./seeders/user.js";
import { v4 as uuid } from "uuid";
import cors from 'cors'
import {cloudinaryConnect} from "./lib/helper.js"


// socket io
import { Server } from "socket.io";
import { createServer } from "http";

// import {http}

//
export const adminSecretKey = process.env.ADMIN_SECRET_KEY || "123456";

// All Routes
import userRoute from "./routes/user.js";
import chatRoute from "./routes/chat.js";
import adminRoute from "./routes/admin.js";

// Data from env file
import "dotenv/config";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { Message } from "./models/message.js";
const port = parseInt(process.env.PORT) || 3000;
// const uri = process.env.DB_URL;

const app = express();
// Create HTTP server using Express app
const server = createServer(app);
// Pass HTTP server instance to Socket.IO
const io = new Server(server, {});

// connection with databse
dbConnect();
// connection with cloudinary 
cloudinaryConnect();


// used to create fake data -> run only once otherwise multiple user will be created
// createUser(10);
// createMessages(10);
// createGroupChats(10);
// createSingleChats(10);
// createMessagesInChat("65eed4a2ad5d7399cc053264",50);

// middelware to access req body data before routes
app.use(express.json());
// cookie-parser-otherwise while accessing it will show undefined
app.use(cookieParser());
app.use(cors({
  origin:["http://localhost:5173"],
  credentials:true,
}));

// routes handling
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);

app.get("/", (req, res) => {
  res.send("<h1>Hello ji</h1>");
});


// map to store userId and socket it with it
const userSocketIds = new Map();


io.on("connection", (socket) => {

  const user = {
    _id:"asabsha",
    name:"Namgo"
  }

  userSocketIds.set(user._id.toString(),socket.id);
  console.log(`User connected with socket is ${socket.id}`);
  socket.on(NEW_MESSAGE, async ({ chatId, members, messages }) => {
    const messageForRealTime = {
      content: messages,
      _id: uuid(),
      sender: {
        _id:user._id,
        name:user.name
      },
      chat:chatId,
      createdAt:new Date().toISOString(),
    };
    console.log("New Message", messageForRealTime);
    const messageForDB = {
      content:messages,
      sender:user._id,
      chat:chatId,
    }

    const membersSocket = getSockets(members,userSocketIds);
    io.to(membersSocket).emit(NEW_MESSAGE,{
      chatId,
      message:messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT,{chatId});

    try{
      await Message.create(messageForDB);
    }catch(error){
      console.log("Error in saving message in DB during socket work",error.message)
    }
  });


  socket.on("disconnect", () => {
    console.log(`User Disconnected with socket id: ${socket.id}`);
    userSocketIds.delete(user._id.toString());
  });
});

// app.listen(port, () => {
//   console.log(`App is listing on PORT ${port}`);
// });
server.listen(port, () =>
  console.log(`Listening on port ${port} in mode ${process.env.NODE_ENV}`)
);

export {userSocketIds};