import { Router } from "express";
import { user } from "../models/index.js";
import { BCRYPT_SALT, JWT_SECRET } from "../config/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/sign-up", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    const exsitUser = await user.exists({ email });

    if (exsitUser) {
      return res.status(404).json({
        status: false,
        message: "User already register",
      });
    }

    const hashPassword = bcrypt.hashSync(password, Number(BCRYPT_SALT));
    await user.create({
      name,
      password: hashPassword,
      email,
    });
    res.status(200).json({
      status: true,
      message: "user Create Succefully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Try Again",
    });
  }
});

authRouter.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    const found = await user.findOne({ email });

    if (!found) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const token = jwt.sign({ _id: found?._id }, JWT_SECRET, {
      expiresIn: "90m",
    });

    res.status(200).json({
      status: true,
      data: {
        userId: found?._id,
        email: found?.email,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: false,
      message: "Try Again",
    });
  }
});
