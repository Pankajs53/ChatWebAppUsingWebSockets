import React, { memo } from "react";
import {
  List,
  ListItem,
  Dialog,
  Stack,
  DialogTitle,
  Button,
  Typography,
  Avatar,
  Skeleton,
} from "@mui/material";
import { sampleNotificationData } from "../../constants/sampleData";
import { useAcceptFriendRequestMutation, useGetNotificationsQuery } from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { setIsNotification } from "../../redux/reducers/misc";
import toast from "react-hot-toast";
const Notifications = () => {


  const dispatch = useDispatch();
  const {isNotification} = useSelector(state=>state.misc);

  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAcceptFriendRequestMutation();
  const friendRequestHandler = async({ _id, accept }) => {
    // Add friend request handler
    dispatch(setIsNotification(false));
    try{
      const res = await acceptRequest({
        requestUserId:_id,accept
      });

      console.log(res);

      if(res.data?.success){
        console.log("Use Socket here");
        toast.success(res.data.message)
      }else{
        toast.error(res.data?.error || "Something went wrong")
      }
    }catch(error){
      toast.error("Something went wrong")
      console.log(error)
    }
  };

  const closeHandler = () => dispatch(setIsNotification(false));

  useErrors([{ error, isError }]);
  console.log(data);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.data.length > 0 ? (
              data?.data.map((i, index) => (
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
          </>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItems = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar />
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

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
