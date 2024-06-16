import { body, check, validationResult, param, query } from "express-validator";

const newGroupChatValidator = () => [
  body("name", "Please Provide Group name").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please enter group member to create group")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members should be greater than 2 and less than 100"),
];

const addMemberValidator = () => [
  body("chatId", "Plase enter chatId in which u want to add").notEmpty(),
  body("member", "Please enter user to add").notEmpty(),
];

const removeMemberValidator = () => [
  body("chatID", "Plase enter chatId in which u want to add").notEmpty(),
  body("member", "Please enter user to add").notEmpty(),
];

// not correct
const leaveGroupValidator = () => [
  param(
    "id",
    "Please Provide id chat id of group you want to leave"
  ).notEmpty(),
];

const sendAttachmentValidator = () => [
  body("chatId", "Please Provide  chat id").notEmpty(),
  check("files")
    .notEmpty()
    .withMessage("Please enter the file to send")
    .isArray({ min: 1, max: 5 })
    .withMessage("Attachments must be 1-5"),
];

const getChatDetailsValidator = () => [
    param("id","Enter the chatId to access chats").notEmpty(),
]

const getMessagesValidator = () => [
    param("id","Please enter the chat id").notEmpty(),
]

const renameGroupValidator = () => [
  param("id","Please enter the chat id").notEmpty(),
  body("newGroupName","Please Provide Group name").notEmpty(),
]


export {
  newGroupChatValidator,
  addMemberValidator,
  removeMemberValidator,
  leaveGroupValidator,
  sendAttachmentValidator,
  getChatDetailsValidator,
  getMessagesValidator,
  renameGroupValidator
};
