import express from "express";
import {
  login,
  newUser,
  getMyProfile,
  logOut,
  searchUser,
  sendFriendRequest,
  acceptRequest,
  getNotifications,
  getMyFriends,
} from "../controllers/user.js";
import { userExist } from "../middlewares/auth.js";
import {  singleAvatar } from "../middlewares/multer.js";
import { isAutheticated } from "../middlewares/auth.js";
import {
  registerValidator,
  validateValues,
  loginValidator,
  sendRequestValidator,
} from "../middlewares/userValidator.js";

const app = express.Router();


// not added these validators in /new route registerValidator,validateValues 
app.post("/new",singleAvatar, newUser);
app.post("/login", loginValidator(), validateValues, userExist, login);

// user must be logged in to access these routes
app.use(isAutheticated);
app.get("/me",  getMyProfile);
app.get("/logout",  logOut);
app.get("/searchuser",  searchUser);
app.put("/sendrequest",  sendFriendRequest);
app.put("/acceptrequest",  acceptRequest);
app.get("/notifications",getNotifications)
app.get("/friends",getMyFriends)

export default app;
