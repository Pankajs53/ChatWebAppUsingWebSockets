import React, { Suspense, lazy, useEffect, useState } from "react";
import {
  Typography,
  Stack,
  Tooltip,
  Grid,
  IconButton,
  Box,
  Drawer,
  TextField,
  Button,
  Backdrop,
} from "@mui/material";
import { matBlack, orange } from "../constants/color";
import {
  Add as AddIcon,
  BorderColor,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useSearchParams } from "react-router-dom";
import { memo } from "react";
import { Link } from "../components/styles/StyledCompinents";
import AvatarCard from "../components/shared/AvatarCard";
import { SampleUsers, sampleChats } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";

const ConfirmDeleteDailog = lazy(() =>
  import("../components/dailogs/ConfirmDeleteDailog")
);

const AddMemberDailog = lazy(() =>
  import("../components/dailogs/AddMemberDailog")
);

const Groups = () => {
  const navigate = useNavigate(); // Corrected variable name
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const chatId = useSearchParams()[0].get("group");
  const [isEdit, setIsEdit] = useState();
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDailog, setConfirmDeleteDailog] = useState(false);
  const isAddMember = false;

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    console.log("Length is", sampleChats.length);
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = (e) => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    console.log(groupNameUpdatedValue);
  };

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDailog(true);
    console.log("delte ");
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDailog(false);
  };

  const openAddMemberHandler = () => {
    console.log("Add member");
  };

  const deleteHandler = () => {
    console.log("Delete Handler Group");
  };

  useEffect(() => {
    if(chatId){
        setGroupName(`Group Name ${chatId}`);
        setGroupNameUpdatedValue(`Group Name ${chatId}`);
    }
    

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("");
      setIsEdit(false);
    };
  }, [chatId]);

  const GroupName = (
    <>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        spacing={"1rem"}
        padding={"3rem"}
      >
        {isEdit ? (
          <>
            <TextField
              value={groupNameUpdatedValue}
              onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
            />
            <IconButton onClick={updateGroupName}>
              <DoneIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h4">{groupName}</Typography>
            <IconButton onClick={() => setIsEdit(true)}>
              <EditIcon />
            </IconButton>
          </>
        )}
      </Stack>
    </>
  );

  const IconBtns = (
    <Box>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );

  // const ButtonGroup = (
  //   <Stack
  //     sx={{
  //       flexDirection: {
  //         sm: "row",
  //         xs: "column-reverse",
  //       },
  //       spacing: "1rem",
  //       padding: {
  //         sm: "1rem",
  //         xs: "0",
  //         md: "1rem 4rem",
  //       },
  //     }}
  //   >
  //     {/* Add your buttons or components here */}
  //   </Stack>
  // );

  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        sm: "1rem",
        xs: "0",
        md: "1rem 4rem",
      }}
    >
      <Button
        size={"large"}
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openConfirmDeleteHandler}
      >
        Delete Group
      </Button>
      <Button
        size={"large"}
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberHandler}
      >
        Add Member
      </Button>
    </Stack>
  );

  const removeMemberHandler = (id) => {
    console.log("Removing the member with id", id);
  };
  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        bgcolor={"orange"}
      >
        <GroupsList myGroups={sampleChats} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}
        {groupName && (
          <>
            {GroupName}{" "}
            <Typography
              variant="body1"
              margin={"2rem"}
              alignSelf={"flex-start"}
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* members card */}

              {SampleUsers.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  isAdded
                  styling={{
                    boxShadow: "0 0 0.5rem 0.5rem  rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem",
                  }}
                  handler={removeMemberHandler}
                />
              ))}
            </Stack>
            {/* Button Group */}
            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDailog />
        </Suspense>
      )}

      {confirmDeleteDailog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDailog
            open={confirmDeleteDailog}
            handleClose={closeConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList myGroups={sampleChats} w={"50vw"} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w}>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={"center"} padding="1rem">
          No Groups
        </Typography>
      )}
    </Stack>
  );
};

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
