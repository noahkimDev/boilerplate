import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../_actions/user_action";

function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Name, setName] = useState("");
  const [ConfirmPassword, setConfirmPassword] = useState("");

  function onEmailHandler(event) {
    setEmail(event.target.value);
  }

  function onPasswordHandler(event) {
    setPassword(event.target.value);
  }

  function onNameHandler(event) {
    setName(event.target.value);
  }

  function onConfirmPasswordHandler(event) {
    setConfirmPassword(event.target.value);
  }

  function onSubmitHandler(event) {
    event.preventDefault();

    if (Password !== ConfirmPassword) {
      return alert("비밀번호와 비밀번호 확인은 같아야 합니다");
    }

    let body = { email: Email, password: Password, name: Name };
    // dispatch를 이용해서 loginUser라는 action을 취한다
    dispatch(registerUser(body)).then((res) => {
      console.log(res);
      if (res.payload.success) {
        navigate("/login");
      } else {
        alert("Failed to sign up");
      }
    });
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
        <label>Name</label>
        <input type="text" value={Name} onChange={onNameHandler} />
        <br />
        <label>Password</label>
        <input type="password" value={Password} onChange={onPasswordHandler} />
        <br />
        <label>Confirm Password</label>
        <input
          type="password"
          value={ConfirmPassword}
          onChange={onConfirmPasswordHandler}
        />
        <br />
        <br />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
