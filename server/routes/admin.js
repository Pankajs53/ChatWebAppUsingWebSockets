import express from "express";

import {
  allUsers,
  allChats,
  allMessages,
  getDashBoardStats,
  adminLogin,
  adminLogout,
  getAdminData,
} from "../controllers/admin.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();

// create a new token to verify the admin using secret key and if verified pas a cookie or token for admin
app.post("/verify", adminLogin);
app.get("/logout", adminLogout);

// for these cretae a middelware specially for admin

app.use(isAdmin); // because of this below routes will have to follow this middelware, instead of showing it in all
app.get("/", getAdminData);
app.get("/users", allUsers);
app.get("/chats", allChats);
app.get("/message", allMessages);
app.get("/stats", getDashBoardStats);

export default app;
