import React from 'react'
import {Stack,Avatar,Typography} from "@mui/material"
import {Face as FaceIcon, AlternateEmail as UserNameIcon,CalendarMonth as CalendarIcon } from "@mui/icons-material"
import moment from "moment";
import { useSelector } from 'react-redux';

export const Profile = () => {


  const {user} = useSelector(state=>state.auth);
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar src={user.avatar.url} sx={{
        width:200,
        height:200,
        objectFit:"center",
        marginBottom:"1rem",
        border:"5px solid white",
        
      }}/>
      <ProfileCard heading={"Bio"} text={user.bio} />
      <ProfileCard heading={"UserName"} text={user.username}  Icon={<UserNameIcon/>}/>
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon/>} />
      <ProfileCard heading={"Joined"} text={moment(user.createdAt).fromNow()} Icon={<CalendarIcon/>} />
    </Stack>
    
  )
}

export const ProfileCard = ({text,Icon,heading}) =>{
  return(
    <Stack 
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"yellow"}
    textAlign={"center"}
  >

    {Icon && Icon}

    <Stack>
      <Typography variant='body1'>{text}</Typography>
      <Typography color={"grey"} variant='caption'>{heading}</Typography>
    </Stack>

  </Stack>
  )
}


