import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { useInputValidation } from "6pp"; // Assuming this is a custom hook for input validation
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {Navigate} from "react-router-dom"

const AdminLogin = () => {

  const isAdmin=false;  

  const navigate = useNavigate();
  const secretKey = useInputValidation("");

  // Function to handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    // Add logic to handle login
    if (secretKey.value === "12345") {
      navigate("/admin/dashboard");
    }
  };

  if(isAdmin) return <Navigate to="/admin/dashboard"/>

  return (
    <div
      style={{
        backgroundImage:
          "linear-gradient(to right top, #e9e125, #f8cf3f, #fdbe56, #fab16c, #eea77e)",
        // Adjusted gradient colors
      }}
    >
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
            <>
              {/* Login Form */}
              <Typography variant="h5">Admin Key</Typography>
              <form
                style={{
                  width: "100%",
                  marginTop: "1rem",
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                  value={secretKey.value}
                  onChange={secretKey.changeHandler}
                  autoComplete="new-password" // Add this line
                  // Updated change handler
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
              </form>
            </>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
