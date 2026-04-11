import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Homepage from "./pages/Homepage";
import FlavorsPage from "./pages/FlavorsPage";
import LoginPage from "./pages/LoginPage";
import OrderHistory from "./pages/OrderHistoryPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/flavors" element={<FlavorsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/orderHistory" element = {<OrderHistory />} />
        <Route path="/signup" element = {<SignUpPage />} />
      </Routes>
    </Router>
  );
}

export default App;