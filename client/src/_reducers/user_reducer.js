/* eslint-disable no-unreachable */
/* eslint-disable import/no-anonymous-default-export */
// Reducer
import { LOGIN_USER } from "../_actions/types";

//! action은 return{type: , payload: }가 할당되어오고
//! state에는 (아마도) store에서 가져오지않겠나
export default function (state = {}, action) {
  // switch문법 사용
  // action 파일의 return object의 type property의 종류가 많아질 것이기 때문

  // action객체는 action.js파일참고
  // 구조 {type:.., payload:..}

  // 편의상 type만 _actions폴더의 types.js에 따로 모아놓고
  // types.js에서 type 목록을 가져오자(action객체에서 직접 뽑지않고)
  switch (action.type) {
    case LOGIN_USER:
      //이전 state와 전달받은 action => next state를 생성
      return { ...state, loginSuccess: action.payload };
      break;

    default:
      return state;
  }
}
