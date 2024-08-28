import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ringtoneChat from '../../Assets/livechat-129007.mp3';
import Pusher from 'pusher-js';
import { Link } from "react-router-dom";

const Topbar = () => {
  const [message, setMessage] = useState([]);
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [isOpened, setIsOpened] = useState(true);

  const audioRef = useRef(new Audio(ringtoneChat));

  const loadAudio = () => {
      return new Promise((resolve, reject) => {
          const audio = new Audio(ringtoneChat); // Path ke file audio
          audio.preload = 'auto';
      
          audio.oncanplaythrough = () => {
              audioRef.current = audio;
              resolve();
          };
      
          audio.onerror = (error) => {
              reject(new Error('Failed to load audio'));
          };
      });
  };

  const playAudio = () => {
      if (audioRef.current) {
          audioRef.current.play().catch(error => {
              console.error('Error playing ringtone:', error);
          });
      }
  };

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
      setIsOpened(false);
      alert('Pesanan baru masuk');
      console.log(data.message);
      setMessage(curr => [data.message, ...curr]);
    });

    // Cleanup on component unmount
    return () => {
      pusher.unsubscribe('my-channel');
    };
  }, []);

  const handleOpenNotification = () => {
    setIsOpened(true);
  }

  useEffect(() => {
    loadAudio()
    if (message.length > 0) {
        playAudio();
    }
  }, [message]);

  return (
    <Box display="flex" justifyContent="end" p={2} bgcolor={'#419197'}>
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <div className="p-2 relative group" onClick={handleOpenNotification}>
          {!isOpened && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></div>}
          <NotificationsOutlinedIcon />
          <div className='absolute top-8 p-2 z-50 right-0 w-64 invisible group-hover:visible rounded bg-white shadow-md'>
            {message.length > 0 ?
              <ul className="z-auto">
                {message.slice(0, 3).map((notif, i) => (
                  <li key={i} className="w-full py-1 px-2 hover:bg-slate-200">
                    <Link to={`/detail-orderan-pelanggan/${notif.id}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex flex-col">
                            <span className="font-bold text-base text-black">Pesanan Baru</span>
                            <span className="text-gray-700">{notif.namaPelanggan}</span>
                          </div>
                          <p className="text-lg font-bold text-black">{notif.noMeja}</p>
                        </div>
                    </Link>
                  </li>
                ))}
              </ul>
            : <p className="text-center text-black">Tidak ada notifikasi</p>
          }
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
