import React from "react";
import Home from "./pages/Home/Home";
import SignUP from "./pages/SignUp/SignUP";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Login from "./pages/LoginPg/login";

const routes = (
  < Router >
    <Routes>
      <Route path="/dashboard" element={<Home />} />
      <Route path="/" element={<Login />} />
      <Route path="/signUp" element={<SignUP />} />
    </Routes>
  </Router >

);

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
}

export default App