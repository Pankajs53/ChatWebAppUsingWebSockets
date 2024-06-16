import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { checkifSame, getOtherMember } from "../lib/helper.js";
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { Message } from "../models/message.js";

const newGroupChat = async (req, res) => {
  try {
    const { name, members } = req.body;
    // handled by validator
    // cant create group with signle user
    // if (members.length < 2) {
    //   return res.status(507).json({
    //     success: false,
    //     message: "Creating Group with Single Member not possible",
    //   });
    // }

    const allMembers = [...members, req.userId];
    // console.log("all members are->",allMembers);
    // console.log("userId from create group->",req.userId)
    const newGroup = await Chat.create({
      name,
      groupChat: true,
      creator: req.userId,
      members: allMembers,
    });

    // function to emit event to all group members including urself when new group is created
    emitEvent(req, ALERT, allMembers, `Welcome to ${name} Group..`);
    // When new Group will be created we will refetch all the chats of all other mebers
    emitEvent(req, REFETCH_CHATS, members);

    return res.status(201).json({
      success: true,
      message: "Group created",
      data: newGroup,
    });
  } catch (error) {
    console.log("Error in new Group Chat Function", error);
    return res.status(504).json({
      success: false,
      message: "Erorr in Group Chat Function",
    });
  }
};

const getMyChat = async (req, res) => {
  try {
    // Accessed the userid of current user which was passed in request by authenticated middelware
    const userid = req.userId;
    console.log("User id is->", userid);
    // now get chatId of all chats in which user exist with the curr userId
    const chats = await Chat.find({ members: userid }).populate(
      "members",
      "name  avatar"
    );

    console.log("chats data is->",chats);

    // chats.map((chat)=>{
    //     console.log("Chats are->",chat)
    // })

    // we can also use aggregation here
    const transformChat = chats.map((chat) => {
      const { _id, name, members, groupChat } = chat;
      const otherMember = getOtherMember(members, req.userId);
      return {
        _id,
        groupChat,
        avatar: groupChat
          ? members.slice(0, 3).map(({ avatar }) => avatar.url)
          : [otherMember.avatar.url],
        name: groupChat ? name : otherMember.name,
        members: members.reduce((prev, curr) => {
          if (curr._id.toString() !== req.userId.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    console.log("Transformed chat is->", transformChat);

    return res.status(200).json({
      success: true,
      data: transformChat,
    });
  } catch (error) {
    console.log("Error in getMyChat Function",error);
    return res.status(500).json({
      success: false,
      messgae: "Failure in getMyChat for",
    });
  }
};

// function to get groups which have been created by us
const getMyGroups = async (req, res) => {
  try {
    const chats = await Chat.find({ creator: req.userId }).populate(
      "members",
      "name avatar"
    );
    console.log("chats are->", chats);
    chats.map((chat) => {
      console.log("chats are->", chat);
    });

    const groups = chats.map(({ members, _id, groupChat, name }) => ({
      _id,
      groupChat,
      name,
      avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
    }));

    return res.status(200).json({
      status: true,
      message: "Here are the group created by you",
      data: groups,
    });
  } catch (error) {
    console.log("Error in getMyGroups Function".error);
    return res.status(500).json({
      success: false,
      messgae: "Failure in getMyChat for",
    });
  }
};

// used to add members in group
// funct ready to add 1 add at a single time in group
const addMembers = async (req, res) => {
  try {
    // only admin(who created the group can add)
    // groupId,check if curr used created that group,then check if to be added user already in group
    const { chatId, member } = req.body;
    // get the group from chatId
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(500).json({
        success: False,
        message: "Did Not Found a chat with",
      });
    }
    // now check if chat is group or not
    const isGroup = chat.groupChat === true;
    if (!isGroup) {
      return res.status(500).json({
        success: false,
        message: `${chatId} not a Group Check Again`,
      });
    }

    // now check if group is created by current user
    const isCreator = chat.creator.toString() === req.userId;
    // console.log(chat.creator);
    // console.log(req.userId);
    // console.log("iscreator", isCreator);
    if (!isCreator) {
      return res.status(500).json({
        success: false,
        message: ` Cannot Add a Member because not admin ${req.userId} `,
      });
    }

    // now check if requested user to add already exits in group
    const alreadyExist = chat.members.includes(member);
    if (alreadyExist) {
      return res.status(500).json({
        success: false,
        message: "User already Exits in Group",
      });
    }

    // finally add the member in group
    chat.members.push(member);
    await chat.save();

    // after adding emitEvent for alter to the new user
    emitEvent(req, ALERT, chat.members, `Added To new Group ${chat.name}`);
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: true,
      message: "Member added successfully.",
    });
  } catch (error) {
    console.log("Error in getMyGroups Function".error);
    return res.status(500).json({
      success: false,
      messgae: "Failure in getMyChat for",
    });
  }
};

// remove member
const removeMember = async (req, res) => {
  try {
    const { member, chatID } = req.body;
    // find if chat exist with this id
    const chat = await Chat.findById(chatID);

    if (!chat) {
      return res.status(500).json({
        success: False,
        message: "Did Not Found a chat with",
      });
    }

    // console.log("chat found", chat);
    // now check if chat is group or not
    const isGroup = chat.groupChat === true;
    if (!isGroup) {
      return res.status(500).json({
        success: false,
        message: `${chatID} not a Group Check Again`,
      });
    }

    // console.log("Is a group", isGroup);
    // now check if requested user to  exits in group
    const alreadyExist = chat.members.includes(member);
    if (!alreadyExist) {
      return res.status(500).json({
        success: false,
        message: "User does not Exits in Group",
      });
    }

    // console.log("Already exits", alreadyExist);

    if (chat.members <= 3) {
      return res.status(500).json({
        success: false,
        message:
          "Group has 3 people cannot Remove because 2 people cannot form group",
      });
    }

    // removing the member
    chat.members = chat.members.filter(
      (i) => i.toString() !== member.toString()
    );

    await chat.save();

    const userthatHasBeenRemoved = await User.findById(member);
    emitEvent(
      req,
      ALERT,
      chat.members,
      `${userthatHasBeenRemoved.name} has been removed from group`
    );
    emitEvent(req, REFETCH_CHATS, chat.members);

    return res.status(200).json({
      success: false,
      message: "User has been removed successfully",
      data: chat.members,
    });
  } catch (error) {
    console.log("Error in removeMember func", error);
    return res.status(500).json({
      success: false,
      message: "Error in Remove Member function",
    });
  }
};

const leaveGroup = async (req, res) => {
  try {
    // accessing chatId from dynamic route(we will send id in url as http://localhost//300/chat/leave/:id)
    const chatId = req.params.id;
    console.log("chat id is->", chatId);
    console.log("User is->", req.userId);

    // find if chat exist with this id
    const chat = await Chat.findById(chatId);
    console.log("Yes")
    if (!chat) {
      return res.status(500).json({
        success: false,
        message: "Did Not Found a chat with",
      });
    }

    console.log("Chat tak done");

    // now check if chat is group or not
    const isGroup = chat.groupChat === true;
    if (!isGroup) {
      return res.status(500).json({
        success: false,
        message: `${chatId} not a Group Check Again`,
      });
    }

    console.log("Group tak done");
    // remaining members(Basically filtering)
    const remainMembers = chat.members.filter(
      (i) => i.toString() !== req.userId.toString()
    );

    console.log("Remaining Members", remainMembers);
    if (remainMembers.length < 2) {
      return res.status(200).json({
        success: false,
        message: "Bhai 2 ka Group kse Bnau? Error in Leave Group Functiom",
      });
    }

    console.log("member check done->");

    if (chat.creator.toString() === req.userId.toString()) {
      // we can also make any random user admin
      // But for shake of simplicity make 1st as admin
      const newCreatorId = remainMembers[0];
      chat.creator = newCreatorId;
    }

    // leave the group
    chat.members = remainMembers;

    // instead of these 2 below commented line we can use a sigle promise with 2 works simultaneously for same work
    // const userLeftTheGroup = await User.findById(req.userId);
    // await chat.save();

    // accesiing user bevause we only need user
    const [user] = await Promise.all([
      User.findById(req.userId, "name"),
      chat.save(),
    ]);

    emitEvent(
      req,
      ALERT,
      chat.members,
      `User with chatid ${user} left the group`
    );

    return res.status(200).json({
      success: true,
      message: `Succesfully left the chat ${chat.name} `,
    });
  } catch (error) {
    console.log("Error in leave group func", error);
    return res.status(500).json({
      success: false,
      message: "Error in  leave group function",
    });
  }
};

// used for sending attachments and storing on cloudinary as well as for real time ALERT for attachmenst
const sendAttachments = async (req, res) => {
  try {
    const { chatId } = req.body;
    // find if chat exist with this id
    const [chat, user] = await Promise.all([
      Chat.findById(chatId),
      User.findById(req.userId, "name"),
    ]);
    if (!chat || !user) {
      return res.status(500).json({
        success: False,
        message: "Did Not Found a chat with",
      });
    }

    // console.log("Not errro 1");
    // accessing files from request or attachment
    const files = req.files || [];
    if (files.length < 1) {
      return res.status(501).json({
        success: false,
        messsage: "File not send check again",
      });
    }
    // console.log(files);
    // console.log("Not errro 2");

    // upload files here on cloudinary
    const attachments = [];

    const messageForDB = {
      content: "",
      attachments: attachments,
      sender: user._id,
      chat: chatId,
    };

    const messageForRealTime = {
      ...messageForDB,
      sender: {
        _id: user._id,
        name: user.name,
      },
    };

    // console.log("Not errro 3");

    // saving in message DB
    const message = await Message.create(messageForDB);
    // console.log("Not errro 4");

    emitEvent(req, NEW_ATTACHMENT, chat.members, {
      message: messageForRealTime,
      chatId,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members, { chatId });

    return res.status(200).json({
      success: true,
      message: `Succesfully Added  the Attachment in chat ${chat.name} `,
      data: message,
    });
  } catch (error) {
    console.log("Error in leave group func", error);
    return res.status(500).json({
      success: false,
      message: "Error in  send Attachment function",
    });
  }
};

const getChatDetails = async (req, res) => {
  try {
    const chatId = req.params.id;
    // if chat id not provided in url
    if (!chatId) {
      return res.status(500).json({
        success: false,
        message: "chatid not present in params",
      });
    }
    // find chat with this id
    const chat = await Chat.findById(chatId)
      .populate("members", "name avatar")
      .lean();
    // check if chat exist else return
    if (!chat) {
      return res.status(500).json({
        success: false,
        message: "chat not present with this chatId",
      });
    }

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      data: chat,
    });
  } catch (error) {
    console.log("Error in getting the chat details", error);
    return res.status(500).json({
      success: false,
      message: "Error  in getting the chat details",
    });
  }
};

const renameGroup = async (req, res) => {
  try {
    const chatid = req.params.id;

    // if chat id not provided in url
    if (!chatid) {
      return res.status(500).json({
        success: false,
        message: "chatid not present in params",
      });
    }

    const chat = await Chat.findById(chatid);
    if (!chat) {
      return res.status(500).json({
        success: false,
        message: "chat not found with this id",
      });
    }

    const isGroup = chat.groupChat ? "true" : "false";
    if (!isGroup) {
      return res.status(500).json({
        success: false,
        message: "Group nhi h chutiya mt bna",
      });
    }

    // only admin is allowed to rename the group
    if (req.userId.toString() !== chat.creator.toString()) {
      return res.status(501).json({
        success: false,
        message: "Only Admin is allowd to rename the group",
      });
    }

    // finally rename the group
    const { newGroupName } = req.body;
    chat.name = newGroupName;
    await chat.save();

    emitEvent(
      req,
      REFETCH_CHATS,
      chat.members,
      `Group name changed to ${chat.name}`
    );

    return res.status(200).json({
      success: true,
      message: "New group name updated",
      data: chat.name,
    });
  } catch (error) {
    console.log("Error in rename Group", error);
    return res.status(500).json({
      success: false,
      message: "Error in rename group",
    });
  }
};

const deleteChat = async (req, res) => {
  try {
    const chatid = req.params.id;
    // if chat id not provided in url
    if (!chatid) {
      return res.status(500).json({
        success: false,
        message: "chatid not present in params",
      });
    }

    // find chat with this id
    const chat = await Chat.findById(chatid)
      .populate("members", "name avatar")
      .lean();
    // check if chat exist else return
    if (!chat) {
      return res.status(500).json({
        success: false,
        message: "chat not present with this chatId",
      });
    }

    const members = chat.members;
    // only admin can delete the group chat
    if (chat.groupChat && chat.creator.toString() !== req.userId) {
      return res.status(500).json({
        success: false,
        message: "Only Admin Can delete the chat",
      });
    }

    // if we are not in a group member
    const isSame = checkifSame(chat.members, req.userId);

    if (chat.groupChat && !isSame) {
      return res.status(500).json({
        success: false,
        message: "You are not a group member",
      });
    }

    // here we have to delete all messages as well as attachment/files on cloudinary
    const messagesWithAttachment = await Message.find({
      chat: chatid,
      attachments: { $exists: true, $ne: [] },
    });

    // used for storing the cloudinary public id so we can delelte them
    const public_ids = [];
    // we may have n attachments and each n attachment may contain other m attachments
    messagesWithAttachment.forEach(({ attachments }) => {
      attachments.forEach((attachment) => {
        public_ids.push(attachment.public_id);
      });
    });

    console.log("Done till here");

    // 3 promised inside a single
    await Promise.all([
      // delete files from cloudinary
      deleteFilesFromCloudinary(public_ids),
      Chat.deleteOne({ _id: { $eq: chatid } }),
      Message.deleteMany({ chat: chatid }),
    ]);

    console.log("All promised done");

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
      success: true,
      message: `Chat Deleted with id ${chatid} `,
    });
  } catch (error) {
    console.log("Error in deleting the chat", error);
    return res.status(500).json({
      success: false,
      message: "Error  in getting the chat details",
    });
  }
};

const getMessages = async (req, res) => { 
  try {
    const chatId = req.params.id;
    const { page = 1 } = req.query;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const [messages, totalMessagesCount] = await Promise.all([
      Message.find({ chat: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender", "name")
        .lean(),
      Message.countDocuments({ chat: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    return res.status(200).json({
      success: true,
      data: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    console.log("Error in get message func", error);
    return res.status(500).json({
      success: false,
      message: "Error  in getting the messages details",
    });
  }
};

export {
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
};
