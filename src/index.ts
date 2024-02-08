import express, { Request, Response, NextFunction } from "express";
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://noha43:1234@cluster0.fyaoqa5.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected..."))
  .catch((err: Error) => console.log(err));

app.get("/", (req: Request, res: Response) => res.send("hello world!"));

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
