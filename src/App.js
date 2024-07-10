import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderPage from "./Pages/OrderPage";
import AdminPage from "./Pages/AdminPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin-00124" element={<AdminPage />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
