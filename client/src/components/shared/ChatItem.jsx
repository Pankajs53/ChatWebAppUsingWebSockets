import React from 'react'
// import {Link} from "react-router-dom"
import {Stack, Typography,Box} from "@mui/material"
import {memo} from 'react'
import AvatarCard from './AvatarCard'
import {Link} from "../styles/StyledCompinents"
import "../../../index.css"

const ChatItem = ({
    avatar=[],
    name,
    _id,
    groupChat=false,
    sameSender,
    isOnline,
    newMessageAlert,
    index=0,
    handleDeleteChatOpne,
}) => {
  return (
    <Link
        sx={{
            padiing:"0",
        }}
    to={`/chat/${_id}`} onContextMenu={(e)=>handleDeleteChatOpne(e,_id,groupChat)}>
        <div
            style={{
                disply:"flex",
                gap:"1rem",
                alignItems:"center",
                padding:"1rem",
                backgroundColor:sameSender?"black":"unset",
                color:sameSender?"white":"unset",
                position:"realtive",
            }}
        >
                {/* Avatar Card  */}
                <div className='firstClass'>
                    <AvatarCard avatar={avatar}/>
                    {/* <Stack>
                        <Typography>{name} </Typography>
                        {
                            newMessageAlert &&  (
                                <Typography>{newMessageAlert.count} New Message</Typography>
                            )
                        }
                    </Stack> */}
                    <div>
                        <p>{name}</p>
                        {
                            newMessageAlert && (
                                <p>{newMessageAlert.count} New Message</p>
                            )
                        }
                    </div>
                </div>

                {
                    isOnline && (
                        <Box
                            sx={{
                                width:"10px",
                                height:"10px",
                                borderRadius:"50%",
                                backgroundColor:"green",
                                position:"absolute",
                                top:"50%",
                                right:"1rem",
                                transform:"translateY(-50%)"
                            }}
                        >

                        </Box>
                    )
                }
        </div>
    </Link>
)
  
}

export default memo(ChatItem);