import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  // LandingPage가 랜딩되자마자 실행되는 코드
  useEffect(() => {
    axios
      // 이럴경우에 client는 3000포트로 요청을 보내게된다.
      // 하지만 server는 5000포트에 있다
      // .get("/api/hello")
      .get("/api/hello") //
      .then((res) => console.log(res));
  }, []);
  const onClickHandler = () => {
    axios.get("/api/users/logout").then((res) => {
      // console.log(res.data);
      if (res.data.success) {
        return navigate("/login");
      } else {
        alert("failed to logout");
      }
    });
  };

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
      <h2>시작페이지</h2>
      <button onClick={onClickHandler}>로그아웃</button>
    </div>
  );
}

export default LandingPage;
