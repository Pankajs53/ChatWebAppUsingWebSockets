import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import {adminSecretKey} from "../app.js"
import "dotenv/config";

const userExist = async (req, res, next) => {
  try {
    const username = req.body.username;
    const currUser = await User.findOne({ username });
    if (currUser) {
      console.log("USER EXIST");
      next();
    } else {
      res.send({
        success: false,
        message: "User Does Not Exits. Navigate To SignUp Page",
      });
    }
  } catch (error) {
    console.log("Error from UserExits", error.message);
    res.send({
      success: false,
      message: "Error in userExist",
    });
  }
};

// Middelware to check if user is logged in
const isAutheticated = async (req, res, next) => {
  try {
    // check if token exist in user req cookie
    console.log("Inside is authenticated");
    const token = req.cookies["chattu-token"];
    // if token not found then return
    if (!token) {
      console.log("Token not found 1");
      return res.status(503).json({
        success: false,
        message: "Token not found for Autheticatoion",
      });
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decode Data is->", decodeData);
    // storing user id in request on this middelware
    req.userId = decodeData._id;
    console.log("User id in req is now->",req.userId);

    next();
  } catch (error) {
    console.log("error in middelware of isAutheticated", error.message);
    return res.status(501).json({
      success: false,
      message: "Error in Autheticated",
    });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // check if token exist in user req cookie
    const token = req.cookies["admin-token"];
    // if token not found then return
    if (!token) {
      return res.status(505).json({
        success: false,
        message: "Token not found for Autheticatoion. Only admin can access",
      });
    }

    const adminKey = jwt.verify(token, process.env.JWT_SECRET);
    const isMatched = adminKey === adminSecretKey;
    if(!isMatched){
      console.log("Error in matching admin key middelware")
      return res.status(401).json({
        success:false,
        message:"Admin key does not match"
      })
    }

    console.log("Admin key matched in middelware")
    next();
  } catch (error) {
    console.log("error in middelware of isAdmin", error.message);
    return res.status(501).json({
      success: false,
      message: "Error in Autheticated",
    });
  }
};

export { userExist, isAutheticated,isAdmin };
