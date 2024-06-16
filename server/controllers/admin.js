import jwt from "jsonwebtoken";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { User } from "../models/user.js";
import  {cookieOptions} from "../utils/features.js"
import {adminSecretKey} from "../app.js"

const adminLogin = async(req,res,next)=>{
    try{
        const {secretKey}=req.body;
        if(!secretKey){
            console.log("SECRET KEY IS EMPTY")
            return res.stats(500).json({
                success:false,
                message:"SECRET KEY EMPTY PLEASE ENTER KEY"
            })
        }
        // check if key matches
        
        const isMatched = secretKey === adminSecretKey;
        if(!isMatched){
            console.log("Admin key does not match")
            return  res.stats(401).json({
                success:false,
                message:"admin key does not match"
            });
        }

        const token = jwt.sign(secretKey,process.env.JWT_SECRET);
        return res.status(200).cookie("admin-token",token,{...cookieOptions,maxAge:1000*60*15}).json({
            success:true,
            message:"Autheticated Successfully welcome admin"
        })

    }catch(error){
        console.log("error in adminLogin controller",error.message);
        return res.status(500).json({
            success:false,
            message:"error in admin Verify controller User Admin Api"
        })
    }
}


const adminLogout =async(req,res)=>{
    try{
        return res.status(200).cookie("admin-token","",{
            ...cookieOptions,maxAge:0
        }).json({
            success:true,
            message:"Admin Logged Out Successfully"
        })
    }catch(Error){
        console.log("Error in admin logout handler");
        return res.status(500).json({
            success:false,
            message:"error im admin logout controller"
        })
    }
}

const getAdminData = async(req,res) =>{
    try{
        return res.status(201).json({
            success:true,
            message:"Ye lo Admin Data"
        })
    }catch(Error){
        console.log("Error in getAdmin data controller")
        return res.status(400).json({
            success:false,
            message:"Error in geting admin data"
        })
    }
}

const allUsers = async(req,res)=>{
    try{

        const users = await User.find({});

        const trasnformedData = await Promise.all(
            users.map(async({name,username,avatar,_id})=>{
           
                const [groupCount,friendCount] = await Promise.all([
                 Chat.countDocuments({groupChat:true,members:_id}),
                 Chat.countDocuments({groupChat:false,members:_id}),
                ])
                
                 return {
                 name,
                 username,
                 avatar:avatar.url,
                 _id,
                 groups:groupCount,
                 friends:friendCount
     
                }
             })
        );


        // console.log(trasnformedData);


        return res.status(200).json({
            success:true,
            data:trasnformedData
        })

    }catch(error){
        console.log("Error in getUser Api");
        return res.status(500).json({
            success:false,
            message:"error in getAll User Admin Api"
        })
    }
}

const allChats = async (req, res) => {
    try {
        const chats = await Chat.find({})
            .populate("members", "name avatar")
            .populate("creator", "name avatar");

        const transformChat = await Promise.all(chats.map(async ({ members, _id, groupChat, name, creator }) => {
           
            const totalMessages = await Message.countDocuments({chat:_id});
           
            return {
                _id,
                groupChat,
                name,
                avatar: members.slice(0, 3).map((member) => member.avatar.url),
                members: members.map(({ _id, name, avatar }) => ({
                    _id,
                    name,
                    avatar: avatar.url,
                })),
                creator: {
                    name: creator ? creator.name || "None" : "None", // Fixing this line to handle the case where creator is undefined
                    avatar: creator ? creator.avatar.url || "" : "", // Fixing this line to handle the case where creator is undefined
                },
                totalMembers:members.length,
                totalMessages
            };
        }));

        // console.log(transformChat); // Fixing the console log to use the correct variable name

        return res.status(200).json({
            success: true,
            data: transformChat
        });
    } catch (error) {
        console.log("Error in get all Chat Api:", error); // Logging the actual error
        return res.status(500).json({
            success: false,
            message: "Error in getAll Chat Admin Api"
        });
    }
};

const allMessages = async(req,res)=>{
    try{
        const messages = await Message.find({})
            .populate("sender","name avatar")
            .populate("chat","groupChat");

        const transformedMessages = messages.map(
            ({content,attachements,_id,sender,createdAt,chat})=>({
                _id,
                attachements,
                content,
                createdAt,
                chat:chat._id,
                groupChat:chat.groupChat,
                sender:{
                    _id:sender._id,
                    name:sender.name,
                    avatar:sender.avatar.url,
                },
            })
        );
        
        return res.status(200).json({
            success:true,
            transformedMessages
        })

    }catch(error){
        console.log("Error in get all message admin control",error.message);
        return res.status(500).json({
            success:false,
            message:"Error in get all message admin controller"
        })
    }
}

const getDashBoardStats = async(req,res)=>{
    try{
        const [groupCount,usersCount,messagesCount,totalChatsCount] = await Promise.all([
            Chat.countDocuments({groupChat:true}),
            User.countDocuments(),
            Message.countDocuments(),
            Chat.countDocuments(),
        ]);


        const toadyDate = new Date();

        const last7Days = new Date();
        last7Days.setDate(last7Days.getDate()-7);

        const last7DaysMessages = await Message.find({
            createdAt:{
                $gte:last7Days,
                $lte:toadyDate,
            }
        }).select("createdAt");

        const messages = new Array(7).fill(0);
        const dayInMilliseconds = 1000*60*60*24;

        last7DaysMessages.forEach((message)=>{
            const indexApproach = 
            (today.getTime() - message.createdAt.getTime())/dayInMilliseconds;
            const index = Math.floor(indexApproach);

            messages[6-index]++;
        });

        const stats = {
            groupCount,
            usersCount,
            messagesCount,
            totalChatsCount,
            messagesChart:messages,
        }
        return res.status(200).json({
            success:true,
            stats,
        })

    }catch(error){
        console.log("Error in stats  admin control",error.message);
        return res.status(500).json({
            success:false,
            message:"Error in get stats admin controller"
        })
    }
}


export {adminLogin,adminLogout,getAdminData,allUsers,allChats,allMessages,getDashBoardStats};