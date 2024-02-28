/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage.js";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/login" element={<LoginPage />} />
          <Route exact path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
