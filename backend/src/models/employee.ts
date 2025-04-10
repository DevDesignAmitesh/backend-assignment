import { models, Schema, model } from "mongoose";
import { boolean } from "zod";

const employeeSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mobileNum: { type: Number, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: String, required: true },
    imgUrl: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const employeeModel = models.Admin || model("Employee", employeeSchema);
