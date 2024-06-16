import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { emitEvent, sendToken, uploadFilesToCloudinary } from "../utils/features.js";
import { cookieOptions } from "../utils/features.js";
const saltRounds = 10;
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";

// create a new user and save in database and return a cookie
const newUser = async (req, res) => {
  try {
    
    const { name, username, password, bio } = req.body;
    if(!name,!username,!password,!bio){
      return res.status(501).json({
        success:false,
        message:"Please fill the data carefully"
      })
    }
    
    const files = req.file;
    // console.log("File for signup is->",file);
    if(!files){
      return res.status(401).json({
        success:false,
        message:"Please upload Avatar"
      })
    }

    // console.log("starting cloudinary func")
    const result =  await uploadFilesToCloudinary([files]);
    // console.log("result after uploading",result)
    const avatar = {
      public_id: result[0].public_id,
      url: result[0].url,
    };

    // const avatar = {
    //   public_id: "asamskas",
    //   url: "asnsnjan",
    // };

    // password hashing is done using pre save schema function on User Model
    const user = await User.create({
      name,
      username,
      password,
      bio,
      avatar,
    });

    // used for creating token and sending a cookie back in response
    sendToken(res, user, 201, "User Created");
  } catch (error) {
    console.log("Error from SignUp Controller", error.message);
    res.status(500).send({
      success: false,
      message: "Error in SignUp",
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    // user will definately exits because we are already using a middelware to check so call for this func will exits if user actually exits
    const hashedPassword = user.password;
    const passwordMatches = await bcrypt.compare(password, hashedPassword);
    // console.log("Encrypted password is->", passwordMatches);
    if (!passwordMatches) {
      return res.status(401).send({
        success: false,
        message: "Logged in Failure",
      });
    }

    sendToken(res, user, 200, `Logged In Success, ${user.name}`);
    // res.send({
    //   success: true,
    //   message: `Login Succesfull for User with Id ${user.id}`,
    // });
  } catch (error) {
    console.log("Error from Login Controller", error.message);
    res.status(500).send({
      success: false,
      message: "Error in login",
    });
  }
};

const getMyProfile = async (req, res) => {
  try {
    // Finding the user from User data using id captured from token send in middelware
    const user = await User.findById(req.userId);
    console.log("Sent own profile",user);
    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};

const logOut = async (req, res) => {
  try {
    // just empty or remove the token data
    // keep the other options same for cookie token and overwrite the other options
    return res
      .status(200)
      .cookie("chattu-token", "", { ...cookieOptions, maxAge: 0 })
      .json({
        success: true,
        message: "Logged Out Success",
      });
  } catch (error) {
    console.log("Error in Logout Page", error);
    res.status(510).json({
      success: false,
      message: "Error in Logout Function",
    });
  }
};

const searchUser = async (req, res) => {
  try {
    // on search we will receive a text based on that we have to search on the database and show username matching
    const { name = "" } = req.query;

    const myChats = await Chat.find({ groupChat: false, members: req.userId });
    console.log(myChats);
    const allUsersFromCommomChats = myChats.map((chat) => chat.members).flat();
    console.log(allUsersFromCommomChats);
    console.log(allUsersFromCommomChats.length);
    const allUserExceptMeAndFriends = await User.find({
      _id: { $nin: allUsersFromCommomChats },
      name: { $regex: name, $options: "i" },
    });
    console.log(allUserExceptMeAndFriends);

    const users = allUserExceptMeAndFriends.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      message: "search User Result Success",
      user: users,
    });
  } catch (error) {
    console.log("Error in Search user function", error);
    return res.status(502).json({
      success: false,
      message: "Error in Search user function",
    });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    console.log("inside first request");

    const { userId } = req.body;

    const request = await Request.findOne({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    });

    if (request) {
      return res.status(500).json({
        status: false,
        message: "Request Already Sent",
      });
    }

    await Request.create({
      sender: req.userId,
      receiver: userId,
    });

    emitEvent(req, NEW_REQUEST, [userId]);

    return res.status(200).json({
      success: true,
      message: "Friend request sent",
    });
  } catch (error) {
    console.log("Error in send friend request", error);
    return res.status(502).json({
      success: false,
      message: "Error in send friend request",
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    //
    const { requestUserId, accept } = req.body;
    console.log("Received user id for request is->",requestUserId)
    if (!requestUserId || typeof requestUserId !== 'string') {
      return res.status(400).json({ error: "Invalid or missing 'requestUserId'" });
    }
    // search the id in request
    const request = await Request.findOne({ sender: requestUserId })


    console.log("request is->",request);
    if (!request) {
      return res.status(500).json({
        success: false,
        message: "No request recieved",
      });
    }

    // console.log(req.userId.toString());
    // console.log(request.receiver._id.toString());

    if (request.receiver._id.toString() !== req.userId.toString()) {
      return res.status(500).json({
        success: false,
        message: "Unauthorized to accept request",
      });
    }

    console.log(request);

    if (!accept) {
      await request.deleteOne();

      return res.status(200).json({
        success: true,
        message: "Friend Request Rejected",
      });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
      Chat.create({
        members,
        name: `${request.sender.name}-${request.receiver.name}`,
      }),
      request.deleteOne(),
    ]);

    emitEvent(req, REFETCH_CHATS, [request.sender_id, request.receiver._id]);

    return res.status(200).json({
      success: true,
      message: "Request Accepted",
      senderId: request.sender._id,
    });
  } catch (error) {
    console.log("Error in Acception Friend Request", error);
    return res.status(502).json({
      success: false,
      message: "Error in in Acception Friend Request",
    });
  }
};

const getNotifications = async (req, res) => {
  try {
    console.log(req.userId);
    const request = await Request.find({ receiver: req.userId }).populate(
      "sender",
      "name avatar"
    );

    console.log(request);

    const allRequest = request.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));

    return res.status(200).json({
      success: true,
      data: allRequest,
    });
  } catch (error) {
    console.log("Error in getting notifications", error);
    return res.status(502).json({
      success: false,
      message: "Error in in getting notifications",
    });
  }
};

const getMyFriends = async (req, res) => {
  try {
    const chatId = req.query.chatId;
    console.log(chatId);

    const chats = await Chat.find({
      members: req.userId,
      groupChat: false,
    }).populate("members", "name avatar");

    console.log(chats)

    const friends = chats.map(({ members }) => {
      const otherUser = getOtherMember(members, req.userId);

      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar,
      };
    });

    console.log("friends",friends);

    if (chatId) {
      const chat = await Chat.findById(chatId);

      const availFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );

      console.log("availFriends",availFriends)

      return res.status(200).json({
        success: true,
        friends: availFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  } catch (error) {
    console.log("Error in getMyFriends Api");
    return res.status(500).json({
      success: false,
      message: "Error in getMyFriends API",
    });
  }
};

// own
const signIn = async (req, res) => {
  try {
    const { name, bio, username, password } = req.body;
    // basic check for password
    if (!name || !username || password) {
      return res.status(301).send({
        success: false,
        message: "Some Data Entry Left in Sign up form. Check",
      });
    }
    // hash the password before storing
    const hashedPassword = await bcrypt.hashSync(password, saltRounds);
    console.log("HasedPassword is->", hashedPassword);
    const newUser = new User({
      name,
      bio,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.send({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log("Error from SignUp Controller", error.message);
    res.status(500).send({
      success: false,
      message: "Error in SignUp",
    });
  }
};

export {
  login,
  newUser,
  getMyProfile,
  logOut,
  searchUser,
  sendFriendRequest,
  acceptRequest,
  getNotifications,
  getMyFriends,
};
