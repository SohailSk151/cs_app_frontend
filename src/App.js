import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

/* Pages */
import Simple from "./pages/simple.js";
import Orders from "./pages/orders.js";
import OrderPage from "./pages/order_page.js";

/* Components */
import Navbar from "./component/navbar.js";

function App() {
  return (
    <>
      <Router>
         <Navbar /> 
        <Routes>
          <Route path="/" element={<Orders />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="*" element={<Orders />} />
        </Routes>
      </Router>
      
    </>
  )
}

export default App;
