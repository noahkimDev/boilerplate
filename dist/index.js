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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const app = (0, express_1.default)();
const port = 5000;
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { User } = require("./models/User");
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cookieParser());
mongoose
    .connect(process.env.MONGOURL)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
app.get("/", (req, res) => res.send("hello world!"));
// "/register" : 회원가입
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 회원가입할 때 필요한 정보들(req.body)을 client에서 가져오면
    // 그것들을 db에 넣어준다.
    // (mongoose)User model instance를 생성하고
    const user = new User(req.body);
    // save() : mongodb method
    // user.save() : 새로만든 User model instance를 db에 저장한다.
    //! 여기서 암호화 진행(실제 여기서 코드를 작성하는 것은 아님 (User.ts)
    yield user // user.save() : 새로만든 User model instance를 db에 저장한다.
        .save()
        .then(() => res.status(200).json({ success: true }))
        .catch((err) => res.json({ success: false, err }));
}));
// 로그인 route
app.post("/login", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 요청된 email데이터를 DB에서 찾는다
    const { email, password } = req.body;
    const user = yield User.findOne({ email: email });
    if (user) {
        // console.log(user);
        // 동일 email을 찾았다면 비밀번호를 비교해야한다.
        // 비밀번호 비교는 모델 생성 file에서 수행한다.
        // comparePassword 메소드는 비밀번호 비교하는 method이다(모델 생성 파일에서 만든다)
        // comparePassword의 첫번째 argument는 client에서 입력받은 비밀번호를 뜻한다
        try {
            const result = yield user.comparePassword(password);
            if (!result)
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 일치하지않음",
                });
            // 토큰을 저장해야한다 => 어디에? : 쿠키 or 로컬스토리지 등
            const userObj = yield user.generateToken();
            // console.log(userObj);
            res // res.cookie : 브라우저 cookies에 저장됨
                .cookie("x_auth", userObj.token) // client에게 토큰을 쿠키로 보냄
                .status(200)
                .json({ loginSuccess: true, userId: userObj._id });
            // 쿠키에 저장하려면 라이브러리 cookieParser설치해야한다
        }
        catch (error) {
            next(error);
        }
    }
    else {
        return res.json({ loginSuccess: false, message: "해당 user가 없습니다" });
    }
    // db에 email 데이터가 있다면 => 비밀번호를 비교한다
    // 비밀번호까지 일치한다면  => Token 생성
}));
app.use((err, req, res, next) => {
    console.log("error 발생");
    res.status(500).json({ message: err.message });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
