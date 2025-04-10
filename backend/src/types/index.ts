import { z } from "zod";

export const loginTypes = z.object({
  username: z.string().min(3),
  password: z.string().min(3),
});

export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  mobileNum: z.number().refine((val) => val.toString().length === 10, {
    message: "Mobile Number should be 10 digits only",
  }),
  designation: z.string().min(1, "Designation is required"),
  gender: z.string().min(1, "Gender is required"),
  course: z.string().min(1, "Course is required"),
  imgUrl: z.string().url(),
});
