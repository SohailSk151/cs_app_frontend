import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Pages */
import Simple from "./pages/simple.js";
import MuiPage from "./pages/mui_page.js";
import OrderPage from "./pages/order_page.js";

/* Components */
import Navbar from "./component/navbar.js";

function App() {
  return (
    <>
      <Router>
         <Navbar /> 
        <Routes>
          <Route path="/" element={<Simple />} />
          <Route path="/orders" element={<MuiPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="*" element={<Simple />} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App;
