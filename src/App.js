import React from "react";
import "./App.css";
import { ColorModeContext, useMode } from "./theme.jsx";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Topbar from "./Pages/Global/Topbar.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import OrderPage from "./Pages/OrderPage/OrderPage.jsx";

function App() {
  const { colorMode, theme } = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <main className="content">
            <Topbar />
            <Routes>
              <Route path="/" element={Dashboard}></Route>
              <Route path="/order" element={OrderPage}></Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
