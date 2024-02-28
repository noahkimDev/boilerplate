import { combineReducers } from "redux";
import user from "./user_reducer";
// import comment from "./comment_reducer";

// 여러 종류의 reducer를 import해서 combineReducers로 합친다.
const rootReducer = combineReducers({
  // user, comment
  user,
});

export default rootReducer;
