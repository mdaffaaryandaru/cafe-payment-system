import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./Pages/Global/Topbar";
import Sidebar from "./Pages/Global/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Team from "./Pages/Team/Team";
import Invoices from "./Pages/Invoice/Invoice";
import Contact from "./Pages/DaftarMenu/DaftarMenu";
// import Bar from "./scenes/bar";
// import Form from "./scenes/form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import OrderPage from "./Pages/OrderPage/OrderPage";
// import Calendar from "./scenes/calendar/calendar";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation()
  const isOrderPage = location.pathname.includes('/order')

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isOrderPage && <Sidebar />}
          <main className="content">
            {!isOrderPage && <Topbar />}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/daftar-menu" element={<Contact />} />
              <Route path="/invoices" element={<Invoices />} />

              {/* order page client */}
              <Route path="/order/:noMeja" element={<OrderPage/>}/>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
