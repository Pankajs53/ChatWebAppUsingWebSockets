import { mongoose } from "mongoose";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { v4 as uuid } from "uuid";
import {v2 as cloudinary} from "cloudinary"
import { getBase64 } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};


const dbConnect = function () {
    mongoose
      .connect(process.env.MONGOURL)
      .then(() => {
        console.log("DB CONNECTED SUCCESSFULLY");
      })
      .catch((error) => {
        console.log("ISSUE IN DB CONNECTION");
        console.error(error);
        process.exit(1);
      });
};
  


const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  console.log("Token is->", token);

  return res.status(code).cookie("chattu-token", token, cookieOptions).json({
    success: true,
    message,
  });
};

// checking working of token
// sendToken("asansa",{_id:"ansbhbas"},201,"User Created");

// events
const emitEvent = (req, event, user, data) => {
  console.log("Emitting Event", event);
};

// used for deleting files from cloduinary
const deleteFilesFromCloudinary = async (public_ids) => {
  console.log("Deleted files from cloudinart");
  return;
};

// upload files to cloudinary
const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resouce_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try{

    console.log("Starting",uploadPromises)
    const results = await Promise.all(uploadPromises);
    const formatedResult = results.map((result)=>({
      public_id : result.public_id ,
      url : result.secure_url,
    }));
    
    
    return formatedResult;

  }catch(error){
    throw new Error("Error in uploading files to cloudinary",error.message)
  }
};

export {
  dbConnect,
  uploadFilesToCloudinary,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
};
