import AppLayout from "../components/layout/AppLayout";
import {Typography,Box} from "@mui/material"
const Home =() =>{
    return(
        <Box bgcolor={"GrayText"} height={"100%"}>
            <Typography p={"2rem"} variant="h5" textAlign={"center"}>
                Select a Friend To chat
            </Typography>
        </Box>
    )
    
}

export default  AppLayout()(Home);