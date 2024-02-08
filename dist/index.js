"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 5000;
const mongoose = require("mongoose");
mongoose
    .connect("mongodb+srv://noha43:1234@cluster0.fyaoqa5.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("MongoDB connected..."))
    .catch((err) => console.log(err));
app.get("/", (req, res) => res.send("hello world!"));
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
