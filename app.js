import express from "express";
import cors from "cors";
import { adminRouter, authRouter, servceRouter } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/upload", cors(), express.static("./upload"));
app.use("/", authRouter);
app.use("/", adminRouter);
app.use("/", servceRouter);

export default app;
