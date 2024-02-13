import express, { Request, Response, NextFunction } from "express";
import env from "dotenv";

const app = express();
const port = 5000;

const mongoose = require("mongoose");
const { User } = require("./models/User");

env.config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.MONGOURL)
  .then(() => console.log("MongoDB connected..."))
  .catch((err: Error) => console.log(err));

app.get("/", (req: Request, res: Response) => res.send("hello world!"));
app.post("/register", async (req: Request, res: Response) => {
  // 회원가입할 때 필요한 정보들(req.body)을 client에서 가져오면
  // 그것들을 db에 넣어준다.
  // (mongoose)User model instance를 생성하고
  const user = new User(req.body);
  // save() : mongodb method
  // user.save() : 새로만든 User model instance를 db에 저장한다.

  await user // user.save() : 새로만든 User model instance를 db에 저장한다.
    .save()
    .then(() => res.status(200).json({ success: true }))
    .catch((err: Error) => res.json({ success: false, err }));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
