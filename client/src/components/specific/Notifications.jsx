import React, {memo} from "react";
import {
  List,
  ListItem,
  Dialog,
  Stack,
  DialogTitle,
  Button,
  Typography,
  Avatar
} from "@mui/material";
import { sampleNotificationData } from "../../constants/sampleData";
const Notifications = () => {
  // const friendRequestHandler = ({_id,accept}){
  //   // Add friend request handler
  // }

  const friendRequestHandler = ({ id, accept }) => {
    // Add friend request handler
  };

  return (
    <Dialog open>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotificationData.length > 0 ? (
          sampleNotificationData.map((i, index) => (
            <NotificationItems
              key={i._id}
              sender={i.sender}
              _id={i._id}
              handler={friendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>0 Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItems = memo(({ sender, _id, handler }) => {
  
  const {name,avatar}=sender;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar  />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-flex",
            WebkitLineClamp: 1,
            webkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} Sent you a friend request. `}
        </Typography>

        <Stack direction={{
          xs:"column",
          sm:"row"
        }}>
          <Button onClick={()=>handler({_id,accept:true})}>Accept</Button>
          <Button color="error" onClick={()=>handler({_id,accept:false})}>Reject</Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
