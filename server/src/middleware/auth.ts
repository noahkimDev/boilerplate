import { Request, Response, NextFunction } from "express";

const { User } = require("../models/User");
// 인증처리 미들웨어
interface AuthenticatedRequest extends Request {
  token?: string;
  userInfo?: unknown;
  // userInfo의 실제 유형이 있으면 'any' 대신 해당 유형으로 대체
}

const auth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    //1 클라이언트 쿠키에서 토큰을 가져온다
    // x_auth인 이유 : cookie에 넣을 때 key값이 x_auth였기 때문
    const token = req.cookies.x_auth;
    //2-1 User모델에서 토큰 복호화하기(method name : findByToken)
    //2-2 토큰을 복호화한다=> user객체 가져온다(=user찾기)
    const userInfo = await User.findByToken(token);
    //3 user가 없으면 인증 false
    if (!userInfo) return res.json({ isAuth: false, error: true });
    //4 user가 있으면 인증 ok
    // req.token,req.userInfo 하는 이유는 next()를 통해 콜백함수로 이동 후에
    // 사용하기위해서!
    req.token = token;
    req.userInfo = userInfo;
    next(); // next()가 없다면 auth 미들웨어에 갇혀버림
  } catch (error) {
    next(error);
  }
};

module.exports = { auth };
