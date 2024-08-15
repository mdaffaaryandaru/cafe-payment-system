import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { ContextNotification } from "../../Components/ContextNotification/ContextNotification";

const Topbar = () => {
  const { notif } = useContext(ContextNotification)

  console.log("Current notifications:", notif);

  useEffect(() => {
    console.log(notif)
  }, [notif])

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  // useEffect(() => {
  //   const newSocket = io("http://localhost:3000", {
  //     transports: ["websocket"],
  //   });

  //   newSocket.on("connect", () => {
  //     console.log("Connected to Socket.IO server.");
  //   });

  //   newSocket.on("message", (data) => {
  //     console.log(data.message)
      // try {
      //   setMessages((prevMessages) => [
      //     ...prevMessages,
      //     `Received: ${data.message}`,
      //   ]);
      // } catch (error) {
      //   console.error("Error processing message:", error);
      // }
    // });

  //   newSocket.on("disconnect", () => {
  //     console.log("Disconnected from Socket.IO server.");
  //   });

  //   newSocket.on("error", (error) => {
  //     console.error("Socket.IO error:", error);
  //   });

  //   setSocket(newSocket);
  // }, []);

  // const sendMessages = () => {
  //   console.log('test')
  //   socket.send({
  //     message: "hello"
  //   })
    // socket.emit('message', message);
    // setMessage('');
  // };

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  return (
    <Box display="flex" justifyContent="end" p={2}>
      {/* SEARCH BAR */}
      {/* <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box> */}

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
