import React, { useState } from "react";
import {
  Stack,
  Grid,
  Box,
  IconButton,
  Drawer,
  Typography,
  styled,
} from "@mui/material";
import {
  Close as CloseIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { Link as LinkComponent, useLocation ,useNavigate} from "react-router-dom";
import {Navigate} from "react-router-dom"


const Link = styled(LinkComponent)`
  text-decoration:none,
  border-radius:2rem,
  padding:1rem 2rem,
  color:black,
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

export const adminTabs = [
  {
    name: "Dashboard",
    path:"/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const SideBar = ({ w = "100%" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const logoutHandler = () =>{
    console.log("Hitted Logout from DashBoard")
    navigate("/")
  }
  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      <Typography variant="h5" textTransform={"uppercase"}>
        Admin
      </Typography>

      <Stack>
        {adminTabs.map((tab, index) => (
          <Link key={index} to={tab.path}
            sx={
                location.pathname==tab.path && {
                    bgcolor:"#1c1c1c",
                    color:"white",
                    ":hover":{color:"gray"}
                }
            }
          
          >

            <Stack direction={"row"} alignItems={"center"} spacing={"2rem"} margin={"2rem"} borderRadius={"50%"}>
              {tab.icon}
              <Typography fontSize={"1.2rem"}>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Link onClick={logoutHandler}>

            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              <ExitToAppIcon/>
              <Typography fontSize={"1.2rem"}>Logout</Typography>
            </Stack>
          </Link>

      </Stack>
    </Stack>
  );
};

const isAdmin=true;
const AdminLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleMobile = () => {
    setIsMobile((prev) => !prev);
  };

  const handleClose = () => setIsMobile(false);
  if(!isAdmin) return <Navigate to="/admin"/>

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <SideBar />
      </Grid>

      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: "gray",
        }}
      >
        {children}
      </Grid>

      <Drawer open={isMobile} onClose={handleClose}>
        <SideBar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
