import {isValidUsername} from "6pp";

export const usernameValidator = (username) =>{
    if(!isValidUsername(username))
        return { isValid:false, errorMessage:"Username is invalid"};
}

// export const passwordValidator = (password)=>{
//     if(!isValidPassword(password))
//         return{isValid:false, errorMessage:"Weak Password"}
// }