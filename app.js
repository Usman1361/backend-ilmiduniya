import express from "express";
import cors from "cors";
import { adminRouter, authRouter, servceRouter } from "./routes/index.js";
import fileUpload from "express-fileupload";

const app = express();

app.use(express.json());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use("/upload", cors(), express.static("./upload"));
app.use("/", authRouter);
app.use("/", adminRouter);
app.use("/", servceRouter);

export default app;
