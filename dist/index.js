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
const { User } = require("./models/User");
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
mongoose
    .connect(process.env.MONGOURL)
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
app.get("/", (req, res) => res.send("hello world!"));
app.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 회원가입할 때 필요한 정보들(req.body)을 client에서 가져오면
    // 그것들을 db에 넣어준다.
    // (mongoose)User model instance를 생성하고
    const user = new User(req.body);
    // save() : mongodb method
    // user.save() : 새로만든 User model instance를 db에 저장한다.
    yield user // user.save() : 새로만든 User model instance를 db에 저장한다.
        .save()
        .then(() => res.status(200).json({ success: true }))
        .catch((err) => res.json({ success: false, err }));
}));
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
