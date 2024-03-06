/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable no-unused-vars */
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/views/LandingPage/LandingPage.js";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from "./hoc/auth.js";

function App() {
  // Auth(LoginPage,false) 의미 : 로그인 페이지는 로그인하지 않은 유저만 접근 가능
  return (
    <div>
      <Router>
        <Routes>
          <Route exact path="/" Component={Auth(LandingPage, null)} />
          <Route exact path="/login" Component={Auth(LoginPage, false)} />
          <Route exact path="/register" Component={Auth(RegisterPage, false)} />
          {/* <Route exact path="/" Component={LandingPage} />
          <Route exact path="/login" Component={LoginPage} />
          <Route exact path="/register" Component={RegisterPage} /> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
