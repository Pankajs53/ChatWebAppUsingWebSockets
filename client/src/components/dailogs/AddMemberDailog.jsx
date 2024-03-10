import React, { useState } from "react";
import { Dialog, Stack, DialogTitle, Button,Typography } from "@mui/material";
import { SampleUsers } from "../../constants/sampleData";
import UserItem from "../shared/UserItem";

const AddMemberDailog = ({ addMember, isLoadingAddMember, chatId }) => {
  
  const [members,setmembers ] = useState(SampleUsers);
  const[selectedMembers,setSelectedMembers] = useState([]);

  const seletedMemberHandler = (_id)=>{
    setSelectedMembers((prev)=>{
        return prev.includes(_id)
        ? prev.filter((currElement)=>currElement!==_id)
        : [...prev, _id];
    })
  }
  

  const addMemberSubmitHandler = () =>{
    closeHandler();
  }

  const closeHandler = () =>{
    setSelectedMembers([]);
    setmembers([]);
  }

  return (
    <Dialog open onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Friends</DialogTitle>
        <Stack>
          {members.length > 0 ? (
            members.map((i) => (
              <UserItem key={i._id} user={i}
               handler={seletedMemberHandler}
               isAdded={selectedMembers.includes(i._id)}
               />

            ))
          ) : (
            <Typography textAlign={"center"}>No Friends To Add</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button onClick={addMemberSubmitHandler} disabled={isLoadingAddMember} variant="contained">
            Add
          </Button>
          <Button onClick={closeHandler} color="error">Cancel</Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDailog;
