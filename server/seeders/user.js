// fake data

import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import {faker, simpleFaker} from "@faker-js/faker"
import { Message } from "../models/message.js";

const createUser = async(numUser)=>{
    try{

        const userPromise=[];

        for(let i=1; i<numUser; i++){
            const tempUser = User.create({
                name:faker.person.fullName(),
                username:faker.internet.userName(),
                bio:faker.lorem.sentence(10),
                password:"password",
                avatar:{
                    url:faker.image.avatar(),
                    public_id:faker.system.fileName()
                }
            })
            userPromise.push(tempUser);
        }

        await Promise.all(userPromise);
        console.log("User created->",numUser);
        process.exit(1);

    }catch(error){
        console.log("Error in createUser",error);
        process.exit(1);
    }
}


const createSingleChats = async(numChats) =>{
    try{
        const users = await User.find().select("_id");
        const chatsPromise=[];

        for(let i=0; i<users.length; i++){
            for(let j=i+1; j<users.length; j++){
                chatsPromise.push(
                    Chat.create({
                        name:faker.lorem.words(2),
                        members:[users[i],users[j]]
                    })
                )
            }
        }

        await Promise.all(chatsPromise);
        console.log("Chats created succesfully");
        process.exit();
    }catch(error){
        console.log("Error in creating single chats",error);
        process.exit(1);
    }
}

const createGroupChats = async(numChats) =>{
    try{
        const users = await User.find().select("_id");
        const chatsPromise=[];

        for(let i=0; i<numChats; i++){
            const numMembers = simpleFaker.number.int({min:3, max:users.length});
            const members=[];

            for(let i=0; i<numMembers; i++){
                const randomIndex=Math.floor(Math.random()*users.length);
                const randomUser = users[randomIndex];

                // ensure same member does not get added again
                if(!members.includes(randomUser)){
                    members.push(randomUser);
                }
            }

            const chat = Chat.create({
                groupChat:true,
                name:faker.lorem.words(1),
                members,
                creator:members[0]
            })

            chatsPromise.push(chat);
        }

        await Promise.all(chatsPromise);
        console.log("Groups created succesfully");
        process.exit();

    }catch(error){
        console.log("Error in creating Groups chats",error);
        process.exit(1);
    }
}

const createMessages = async(numMessages) =>{
    try{
        const users = await User.find().select("_id");
        const chats = await Chat.find().select("_id");

        const messagePromise = [];
        for(let i=0; i<numMessages; i++){
            const randomUser = users[Math.floor(Math.random()*users.length)];
            const randomChat = chats[Math.floor(Math.random()*chats.length)];

            messagePromise.push(
                Message.create({
                    chat:randomChat,
                    sender:randomUser,
                    content:faker.lorem.sentence(),
                })
            )
        }

        await Promise.all(messagePromise);
        console.log("Messaged created succesfully");
    }catch(error){
        console.log("Error in creating messages ",error);
        process.exit(1);
    }
}

const createMessagesInChat = async(chatId,numMessages) =>{
    try{
  
      const user = await User.find().select("_id");
  
      const messagePromise=[];
  
      for(let i=0; i<numMessages; i++){
        const randomUser = user[Math.floor(Math.random()*user.length)];
        messagePromise.push(
          Message.create({
            chat:chatId,
            sender:randomUser,
            content:faker.lorem.sentence,
          })
        )
      }
  
      await Promise.all(messagePromise);
  
      console.log("Message created successfully");
      process.exit(1);
  
    }catch(error){
      console.log("Error in create message in a chat",error);
      process.exit(1);
    }
}



export {createUser,createMessages,createGroupChats,createSingleChats,createMessagesInChat};