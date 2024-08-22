import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { io } from "socket.io-client";
import { ContextNotification } from "../../Components/ContextNotification/ContextNotification";
import Pusher from 'pusher-js';

const Topbar = () => {
  const [message, setMessage] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const {notif} = useContext(ContextNotification)

  useEffect(() => {
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    // Initialize Pusher
    const pusher = new Pusher('eeac291f5408aa1cf514', {
      cluster: 'ap1',
    });

    // Subscribe to the channel
    const channel = pusher.subscribe('my-channel');

    // Bind to the event
    channel.bind('my-event', (data) => {
      alert(data)
      setMessage(curr => [...curr, JSON.stringify(data)]);
    });

    // Cleanup on component unmount
    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

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
        <div className="p-2 relative group">
          <NotificationsOutlinedIcon />
          <div className="absolute top-8 p-2 right-0 w-52 max-h-32 invisible group-hover:visible rounded bg-slate-700">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-1 hover:bg-slate-800">Notifikasi {i}</div>
            ))}
          </div>
        </div>
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
