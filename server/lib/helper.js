import  {userSocketIds} from "../app.js";

// connect with cloudinary
import {v2 as cloudinary} from 'cloudinary'

export const cloudinaryConnect = () => {
	try {
		cloudinary.config({
			//!########Configuring the Cloudinary to Upload MEDIA ########
			cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
			api_key: process.env.CLOUDINARY_API_KEY,
			api_secret: process.env.CLOUDINARY_API_SECRET ,
		});
		console.log("CLOUDINARY CONNECTED")
	} catch (error) {
		console.log(error);
	}
};

// if not a group chat then return the otherMember not the curr user
const getOtherMember = (members, userId) => {
  return members.find((member) => member._id.toString() !== userId.toString());
};

function checkifSame(members, userId) {
  for (const member of members) {
    if (member._id.toString() === userId) {
      console.log("chud gyi bsnti");
      return true;
    }
  }
  return false; // Return false if no match is found
}

export const getSockets = (users=[]) =>{
  const sockets = users.map((user)=>userSocketIds.get(user._id.toString()));
  return sockets;
}

export const getBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
};

export { getOtherMember,checkifSame };
