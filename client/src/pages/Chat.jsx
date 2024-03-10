import React, { useRef } from "react";
import AppLayout from "../components/layout/AppLayout";
import { Stack, IconButton } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledCompinents";
import { orange } from "../constants/color";
import FileMenu from "../components/dailogs/FileMenu";
import { sampleMessage } from "../constants/sampleData";
import MessageComponent from "../components/shared/MessageComponent";

const graycolor = "#CCCCCC"; // Define your gray color here
const user={
  _id:"sdfsfscfxcs",
  name:"Abhishek Gandu"
}

const Chat = () => {
  const containerRef = useRef(null);


  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"} // Changed to a number
        bgcolor={graycolor}
        height="90%"
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* Add your chat content here */}
        {
          
          sampleMessage.map((i,index)=>(
            <MessageComponent key={index} message={i} user={user}/>
          ))
        }
      </Stack>

      <form style={{ height: "10%" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          height={"100%"}
          padding={"1rem"}
          position={"relative"}
        >
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox sx={{
            marginLeft:"3rem"
          }} placeholder="Type Message Here..." />
          <IconButton
            type="submit"
            sx={{
              backgroundColor: orange,
              rotate: "-30def",
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu/>
    </>
  );
};

export default AppLayout()(Chat); // Removed the unnecessary parentheses around AppLayout
