import { NextFunction } from "express";
import bcrypt from "bcrypt";

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const saltRounds = 10;
// 스키마 작성
import { Document } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  lastname?: string;
  role?: number;
  image?: string;
  token?: string;
  tokenExp?: number;
}

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

useSchema.pre("save", function (next: NextFunction) {
  // this는 client 회원가입 정보를 바탕으로 새로 생성된 useSchema 객체를 의미
  const user: IUser = this;
  // console.log(user);

  // password가 수정되었을 경우에만 다음 코드 실행
  // user.isModified("password")
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

useSchema.methods = {
  // 비번 비교하는 method
  comparePassword: async function (clientInputPw: string) {
    // clientInputPw : ex '12344'
    // dbInputPw : 암호화된 pw
    const result = await bcrypt.compare(clientInputPw, this.password);
    return result;
  },

  // 토큰 생성하는 method
  generateToken: async function () {
    const user = this;
    // jwt.sign(user 식별할 수 있는 데이터, anyString)
    // 아래에서는 user 식별할 수 있는 데이터로 '_id' property를 사용

    const token = jwt.sign(user._id.toHexString(), "secretToken");
    // console.log(token);
    user.token = token;
    await user.save(); // save() : 해당 몽고db user 데이터에 user.token=token 데이터가 저장됨
    return user;
    // 원리
    // user._id + "secretToken" 합쳐져서 => Token 생성
    // 추후에 Token을 해석할 때 "secretToken" 넣으면 user._id를 알 수 있음
    // => 그러므로 "secretToken"을 기억하고 있어야함
  },
};

// 모델로 스키마를 감싼다.
// const User = mongoose.model("모델명", 스키마);
const User = mongoose.model("User", useSchema);

// 모델 export
module.exports = { User };
// export default User;
