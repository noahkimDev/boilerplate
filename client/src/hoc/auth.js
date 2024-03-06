/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action";
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
  // option
  // 1. null : 아무나 들어갈 수 있는 페이지
  // 2. true : 로그인한 유저만 접근 가능한 페이지
  // 3. false : 로그인한 유저는 접근이 불가능한 페이지

  // adminRoute : 관리자페이지 => 해당되는 페이지의 겨우 true
  // 기본값은 null (ES6문법)
  function AuthenticationCheck() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
      dispatch(auth()).then((res) => {
        // console.log(res.payload);
        if (!res.payload.isAuth) {
          // 로그인 안한상태
          if (option) {
            // 로그인 안했는데 로그인유저만 접근 가능한 페이지에 들어가려고 한다면
            // => login 페이지로 보낸다.
            navigate("/login");
          }
        } else {
          // 로그인 한 상태
          // case1 : adminRoute는 true인데 payload.isAdmin에서 false인 경우(=관리자 계정x)
          // 랜딩페이지로 보낸다
          if (adminRoute && !res.payload.isAdmin) {
            navigate("/");
          } else if (!option) {
            navigate("/");
          }
        }
      });
    }, []);

    return <SpecificComponent />;
  }

  return AuthenticationCheck;
}
