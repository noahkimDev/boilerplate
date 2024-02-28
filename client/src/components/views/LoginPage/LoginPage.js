import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";
import { useNavigate } from "react-router-dom";

function LoginPage(props) {
  //redux
  // 순서 : dispatch=> dispatch를 이용해서 action을 취한다
  // => loginUser라는 action을 취한다.
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  function onEmailHandler(event) {
    // email input에 글자가 작성될 때마다 state값을 재할당하는 함수
    setEmail(event.target.value);
  }

  function onPasswordHandler(event) {
    // password input에 글자가 작성될 때마다 state값을 재할당하는 함수
    setPassword(event.target.value);
  }

  function onSubmitHandler(event) {
    //! 하지 않으면 로그인할 때마다 페이지가 refresh 된다
    //? => onSubmitHandler 함수에서 해야하는 작업을 할 수가 없다.

    event.preventDefault();
    let body = { email: Email, password: Password };
    // dispatch를 이용해서 loginUser라는 action을 취한다
    dispatch(loginUser(body)).then((res) => {
      if (res.payload.loginSuccess) {
        // props.history.push("/");
        navigate("/");
      } else {
        alert("Error");
      }
    });
    // dispatch(loginUser(body));

    // axios
    //   .post("api/users/login", body) //
    //   .then((res) => {});
    // 서버에 로그인 정보를 보낸다
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={onSubmitHandler}
      >
        <label>Email</label>
        <input type="email" value={Email} onChange={onEmailHandler} />
        <br />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
