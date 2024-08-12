import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./Pages/Global/Topbar";
import Sidebar from "./Pages/Global/Sidebar";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Team from "./Pages/Team/Team";
// import Bar from "./scenes/bar";
import Form from "./Pages/Form/Form";
// import Line from "./scenes/line";
// import Pie from "./scenes/pie";
// import FAQ from "./scenes/faq";
// import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import OrderPage from "./Pages/OrderPage/OrderPage";
import DaftarMenu from "./Pages/DaftarMenu/DaftarMenu";
import PaymentPage from "./Pages/Payment/PaymentPage";
import OrderDetailCustomer from "./Pages/OrderPage/OrderDetailCustomer";


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
              <Route path="/daftar-menu" element={<DaftarMenu />} />
              <Route path="/order/pembayaran" element={<PaymentPage />} />
              <Route path="/order/:noMeja" element={<OrderPage />} />
              <Route path="/order-tracker/:id/:namaPelanggan" element={<OrderDetailCustomer />} />
              {/* <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} /> */}
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
