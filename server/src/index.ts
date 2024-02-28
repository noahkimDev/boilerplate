import express, { Request, Response, NextFunction } from "express";
import env from "dotenv";

const app = express();
const router = express.Router();
const port = 5000;

const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");
const { auth } = require("./middleware/auth");

env.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err: Error) => console.log(err));

app.get("/", (req: Request, res: Response) => res.send("hello world!"));

// "/register" : 회원가입
app.post("/register", async (req: Request, res: Response) => {
  // 회원가입할 때 필요한 정보들(req.body)을 client에서 가져오면
  // 그것들을 db에 넣어준다.
  // (mongoose)User model instance를 생성하고
  const user = new User(req.body);
  // save() : mongodb method
  // user.save() : 새로만든 User model instance를 db에 저장한다.
  //! 여기서 암호화 진행(실제 여기서 코드를 작성하는 것은 아님 (User.ts)
  await user // user.save() : 새로만든 User model instance를 db에 저장한다.
    .save()
    .then(() => res.status(200).json({ success: true }))
    .catch((err: Error) => res.json({ success: false, err }));
});

// 로그인 route
app.post(
  "/api/users/login",
  async (req: Request, res: Response, next: NextFunction) => {
    // 요청된 email데이터를 DB에서 찾는다
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      // console.log(user);
      // 동일 email을 찾았다면 비밀번호를 비교해야한다.
      // 비밀번호 비교는 모델 생성 file에서 수행한다.

      // comparePassword 메소드는 비밀번호 비교하는 method이다(모델 생성 파일에서 만든다)
      // comparePassword의 첫번째 argument는 client에서 입력받은 비밀번호를 뜻한다
      try {
        const result = await user.comparePassword(password);
        if (!result)
          return res.json({
            loginSuccess: false,
            message: "비밀번호가 일치하지않음",
          });
        // 토큰을 저장해야한다 => 어디에? : 쿠키 or 로컬스토리지 등
        const userObj = await user.generateToken();
        // console.log(userObj);
        res // res.cookie : 브라우저 cookies에 저장됨
          .cookie("x_auth", userObj.token) // client에게 토큰을 쿠키로 보냄
          .status(200)
          .json({ loginSuccess: true, userId: userObj._id });
        // 쿠키에 저장하려면 라이브러리 cookieParser설치해야한다
      } catch (error) {
        next(error);
      }
    } else {
      return res.json({ loginSuccess: false, message: "해당 user가 없습니다" });
    }
    // db에 email 데이터가 있다면 => 비밀번호를 비교한다
    // 비밀번호까지 일치한다면  => Token 생성
  }
);

// auth 미들웨어 추가
// 미들웨어 : 요청을 받아서 req,res  콜백함수를 실행하기 전에 실행된다
interface AuthenticatedRequest extends Request {
  token?: string;
  userInfo?: {
    _id?: unknown;
    name?: string;
    lastname?: string;
    email?: string;
    password?: string;
    role?: number;
    image?: unknown;
  };
  // userInfo의 실제 유형이 있으면 'any' 대신 해당 유형으로 대체
}
app.get("/api/users/auth", auth, (req: AuthenticatedRequest, res: Response) => {
  // 여기까지 왔다는건 미들웨어auth를 통과했다는 이야기이고
  // authentication이 true라는 말
  res.status(200).json({
    _id: req.userInfo._id,
    isAdmin: req.userInfo.role === 0 ? false : true,
    isAuth: true,
    email: req.userInfo.email,
    name: req.userInfo.name,
    lastname: req.userInfo.lastname,
    role: req.userInfo.role,
    image: req.userInfo.image,
  });
});

app.get(
  "/api/users/logout",
  auth,
  async (req: AuthenticatedRequest, res: Response) => {
    // findOneAndUpdate() 사용 : 찾아서 업데이트한다.
    /* 예시
    const filter = { name: "Jean-Luc Picard" };
    const update = { age: 59 };
    let doc = await Character.findOneAndUpdate(filter, update);
    */
    await User.findOneAndUpdate({ _id: req.userInfo._id }, { token: "" });
    return res.status(200).send({ success: true });
  }
);

app.get("/api/hello", (req: Request, res: Response) => {
  res.send("안녕");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("error 발생");
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
