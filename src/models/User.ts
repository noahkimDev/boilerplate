const mongoose = require("mongoose");

// 스키마 작성
const useSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 1,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  // 토큰-유효성 검사
  token: {
    type: String,
  },
  //  토큰의 유효기간
  tokenExp: {
    type: Number,
  },
});

// 모델로 스키마를 감싼다.
// const User = mongoose.model("모델명", 스키마);

const User = mongoose.model("User", useSchema);

// 모델 export
module.exports = { User };
// export default User;
