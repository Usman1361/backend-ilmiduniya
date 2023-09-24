import { Schema, model } from "mongoose";

const serviceSchema = new Schema(
  {
    image: String,
    heading1: String,
    heading2: String,
    paragraph: String,
  },
  {
    timestamps: true,
  }
);

export const service = model("Service", serviceSchema);
