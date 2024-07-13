import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OrderPage from "./Pages/OrderPage";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
