import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    password: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

export const user = model("LoginData", userSchema);
