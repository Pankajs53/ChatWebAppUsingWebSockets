import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button , Stack, Avatar } from "@mui/material";
import { IconButton } from '@mui/material';
import {CameraAlt as CameraAltIcon} from "@mui/icons-material"
import {VisuallyHiddenInput} from "../components/styles/StyledCompinents"
import { usernameValidator } from "../utils/validator";
import {useInputValidation,useFileHandler} from "6pp"

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () =>setIsLogin((prev)=> !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username=useInputValidation("",usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");
  
  const handleSignUp = (e) =>{
    e.preventDefault();
  }

  const handleLogin = (e) =>{
    e.preventDefault();
  }

  

  return (
    <div
      style={{
        backgroundImage:
        "linear-gradient(to right top, #e9e125, #f8cf3f, #fdbe56, #fab16c, #eea77e)"
      }}
    >
      <Container component={"main"} maxWidth="xs" sx={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
      }}>
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form   
                  style={{
                      width:"100%",
                      marginTop:"1rem",
                  }}

                onSubmit={handleLogin}

                  
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Login
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                <Button
                
                  fullWidth
                  variant="text"
                  color="secondary"
                  onClick={toggleLogin}
                >
                  Sign Up Instead
                </Button>
              </form>
            </>
          ) : (
              <>
              <Typography variant="h5">Sign Up</Typography>
              <form   
                  style={{
                      width:"100%",
                      marginTop:"1rem",
                  }}

                  onSubmit={handleSignUp}

                  
              >
                  <Stack position={"relative"} width={"10rem"} margin={"auto"}>
                      <Avatar
                          sx={{
                              width:"10rem",
                              height:"10rem",
                              objectFit:"contain"
                          }}

                          src={avatar.preview}
                      />

                      

                      <IconButton sx={{
                          position:"absolute",
                          bottom:"0",
                          right:"0",
                          color:"white",
                          bgcolor:"rgba(0,0,0,0.5)",
                          ":hover":{
                              bgcolor:"rgba(0,0,0,0.7)"
                          },
                      }}
                          component="label"

                      >
                        
                              <CameraAltIcon/>
                              <VisuallyHiddenInput type="file" onChange={avatar.changeHandler}/>
                          

                      </IconButton>

                  </Stack>
                  {
                        avatar.error && (
                          <Typography color="error" m={"1rem auto"} variant="caption">
                            {avatar.error}
                          </Typography>
                        )
                  }

                <TextField
                  required
                  fullWidth
                  label="Name"
                  margin="normal"
                  variant="outlined"
                  value={name.value}
                  onChange={name.changeHandler}
                />

                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}

                />
                {
                  username.error && (
                    <Typography color="error" variant="caption">
                      {username.error}
                    </Typography>
                  )
                }
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                
                />
                
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Sign Up
                </Button>
                <Typography textAlign={"center"} m={"1rem"}>OR</Typography>
                <Button
                
                  fullWidth
                  variant="text"
                  color="secondary"
                  onClick={toggleLogin}
                >
                  Login Instead
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
    
  );
};

export default Login;
