// Action
import axios from "axios";
import { LOGIN_USER } from "./types";
// import { createAsyncThunk } from "@reduxjs/toolkit";
// action은 return 값이 객체 형태

//여기부터
export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit) //
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  // .then((res) => {
  //   return { type: LOGIN_USER, payload: res };
  // });

  // reducer로 보낸다.
  // 왜냐하면 reducer는 action object와 이전 state를 가지고
  // next state를 return하기 때문에
  // {type:.., response:..} 형태
  // 강의에서는 {type:.., payload:..} 형태로 보냄.
  //   //? 질문: 어떻게 reducer로 action을 보낼 것인가???
  //   //! 리턴하면 reducer에서 받는 것

  // 에러 : A non-serializable value was detected in an action,
  // in the path: `payload`. Value: Promise {<pending>}
  // 원인 : store는 객체값만 받는데 promise 값이 왔다는 얘기
  // {loginSuccess: true, userId: '6ㅌㅌㅌㅌ'}이런식으로 객체만 보내면 성공!
  // 그래서 영상에서 redux-promise사용하자고 했는데
  // configureStore로 바뀌면서 해결방법을 모르겠다
  // 여기부터2
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

// export const loginUser = createAsyncThunk(LOGIN_USER, async (dataToSubmit) => {
//   const request = axios
//     .post("/api/users/login", dataToSubmit) //
//     .then((response) => {
//       return response.data;
//     })
//     .catch((err) => {
//       console.log(err);
//     });

//   return {
//     type: LOGIN_USER,
//     payload: request,
//   };
// });
