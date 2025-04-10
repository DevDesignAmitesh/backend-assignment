import { models, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    password: { type: String, required: true },
    username: { type: String, required: true },
  },
  { timestamps: true }
);

export const userModel = models.User || model("User", userSchema);
