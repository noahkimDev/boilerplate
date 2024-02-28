"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const saltRounds = 10;
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
useSchema.pre("save", function (next) {
    // this는 client 회원가입 정보를 바탕으로 새로 생성된 useSchema 객체를 의미
    const user = this;
    // console.log(user);
    // password가 수정되었을 경우에만 다음 코드 실행
    // user.isModified("password")
    if (user.isModified("password")) {
        bcrypt_1.default.genSalt(saltRounds, function (err, salt) {
            if (err)
                return next(err);
            bcrypt_1.default.hash(user.password, salt, function (err, hash) {
                if (err)
                    return next(err);
                user.password = hash;
                next();
            });
        });
    }
    else {
        next();
    }
});
useSchema.methods = {
    // 비번 비교하는 method
    comparePassword: function (clientInputPw) {
        return __awaiter(this, void 0, void 0, function* () {
            // clientInputPw : ex '12344'
            // dbInputPw : 암호화된 pw
            const result = yield bcrypt_1.default.compare(clientInputPw, this.password);
            return result;
        });
    },
    // 토큰 생성하는 method
    generateToken: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this;
            // jwt.sign(user 식별할 수 있는 데이터, anyString)
            // 아래에서는 user 식별할 수 있는 데이터로 '_id' property를 사용
            const token = jwt.sign(user._id.toHexString(), "secretToken");
            // console.log(token);
            user.token = token;
            yield user.save(); // save() : 해당 몽고db user 데이터에 user.token=token 데이터가 저장됨
            return user;
            // 원리
            // user._id + "secretToken" 합쳐져서 => Token 생성
            // 추후에 Token을 해석할 때 "secretToken" 넣으면 user._id를 알 수 있음
            // => 그러므로 "secretToken"을 기억하고 있어야함
        });
    },
};
useSchema.statics = {
    findByToken: function (token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this;
            // how to decode(복호화) : jsonwebtoken npm 사이트 확인
            // 결고값은 user._id값이 나올 것 => token 만들 때 user._id를 넣었기때문
            const userId = yield jwt.verify(token, "secretToken");
            // userId를 사용하여 user를 찾아
            // client에서 가져온 token과 db에서 찾은 token
            // 일치하는지 확인
            return yield user.findOne({ _id: userId, token: token });
        });
    },
};
// 모델로 스키마를 감싼다.
// const User = mongoose.model("모델명", 스키마);
const User = mongoose.model("User", useSchema);
// 모델 export
module.exports = { User };
// export default User;
