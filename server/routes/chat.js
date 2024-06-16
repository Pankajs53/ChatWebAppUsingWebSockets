// Basic Stuff

import express from "express";
import {
  newGroupChat,
  getMyChat,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.js";

// used for validation of current user
import { isAutheticated } from "../middlewares/auth.js";
// used for validation of data as middlewares
import { validateValues } from "../middlewares/userValidator.js";
import {
  newGroupChatValidator,
  addMemberValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentValidator,
  getChatDetailsValidator,
  getMessagesValidator,
  renameGroupValidator
} from "../middlewares/chatValidator.js";

// used for accessing file data from request
import { attachmentMulter } from "../middlewares/multer.js";

const app = express.Router();

// using autheticated middelware at top so all below function will also use isautheticated as a middelware
// we dont have to pass it again
app.use(isAutheticated);

app.post("/new", newGroupChatValidator(), validateValues, newGroupChat);
app.get("/my", isAutheticated, getMyChat);
app.get("/my/groups", getMyGroups);
app.put("/addMembers", addMemberValidator(), validateValues, addMembers);
app.put("/removeMember", removeMemberValidator(), validateValues, removeMember);
// dynamic route
app.delete("/leave/:id",leaveGroupValidator(),validateValues, leaveGroup);

// send attachment
app.post("/messages",attachmentMulter,sendAttachmentValidator(),validateValues, sendAttachments);

// get messages
app.get("/messages/:id", getMessagesValidator(),validateValues,getMessages);

// get chat details, rename,delete
// same routes but different methods->also known as chaining
// always keep this type of function in the end
app.route("/:id").get(getChatDetailsValidator(),validateValues,getChatDetails).put(renameGroupValidator(),validateValues,renameGroup).delete(deleteChat);

export default app;
