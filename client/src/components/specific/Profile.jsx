import React from 'react'
import {Stack,Avatar,Typography} from "@mui/material"
import {Face as FaceIcon, AlternateEmail as UserNameIcon,CalendarMonth as CalendarIcon } from "@mui/icons-material"
import moment from "moment";

export const Profile = () => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      <Avatar sx={{
        width:200,
        height:200,
        objectFit:"contain",
        marginBottom:"1rem",
        border:"5px solid white"
      }}/>
      <ProfileCard heading={"Bio"} text={"asnajsbha asbhashbash bashbhas"} />
      <ProfileCard heading={"UserName"} text={"pankaj.s18"}  Icon={<UserNameIcon/>}/>
      <ProfileCard heading={"Name"} text={"Panka Singh"} Icon={<FaceIcon/>} />
      <ProfileCard heading={"Joined"} text={moment('2023-11-04T18:30:00.000Z').fromNow()} Icon={<CalendarIcon/>} />
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


