import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user:null,
    isAdmin:false,
    loader:true,
    token: localStorage.getItem("chattu-token") ? JSON.parse(localStorage.getItem("chattu-token")) :null,
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        userExists:(state,action)=>{
            state.user = action.payload;
            state.loader=false;
        },
        userNotExists:(state)=>{
            state.user=null;
            state.loader=false;
        },
        setToken(state,action){
            localStorage.setItem("chattu-token",JSON.stringify(action.payload));
            state.token = action.payload;
        },
    }
});


export default authSlice;
export const {userExists,userNotExists} = authSlice.actions;