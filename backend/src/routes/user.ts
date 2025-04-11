import { Router, Request, Response } from "express";
import { employeeSchema, loginTypes } from "../types";
import { hash } from "bcrypt";
import { userModel } from "../models/user";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../imageUpload";
import { employeeModel } from "../models/employee";
import { middleware } from "../middleware";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

const userRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });

// user can login
userRouter.post("/login", async (req: Request, res: Response): Promise<any> => {
  // validating the data send by the user
  const result = loginTypes.safeParse(req.body);
  if (!result.success) {
    return res.status(404).json({ message: result.error });
  }

  // hashing the password
  const hashedPassword = await hash(result.data.password, 5);

  // creating the user
  try {
    await userModel.create({
      username: result.data.username,
      password: hashedPassword,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ message: "something went wrong while creating user" });
  }

  // generating the token
  const token = jwt.sign(
    { username: result.data.username },
    process.env.JWT_SECRET!
  );

  // setting in the cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days age
  });

  return res.status(200).json({ message: "login successfull" }); // successfull
});

// get all the employees
userRouter.get(
  "/employee/bulk",
  middleware,
  async (req: Request, res: Response): Promise<any> => {
    const filter = (req.query.filter as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = (req.query.order as string) === "desc" ? -1 : 1;

    const skip = (page - 1) * limit;

    try {
      const query = filter
        ? {
            $or: [
              { name: { $regex: filter, $options: "i" } },
              { email: { $regex: filter, $options: "i" } },
              { designation: { $regex: filter, $options: "i" } },
              { course: { $regex: filter, $options: "i" } },
            ],
          }
        : {};

      const [employees, totalCount] = await Promise.all([
        employeeModel
          .find(query)
          .sort({ [sortBy]: order })
          .skip(skip)
          .limit(limit),
        employeeModel.countDocuments(query),
      ]);

      res.status(200).json({
        employees,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employees", error });
    }
  }
);

// get one employee
userRouter.get(
  "/employee/:id",
  middleware,
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // get the employee id from the params

    try {
      const employee = await employeeModel.findById(id); // find the employee

      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.status(200).json(employee);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch employee", error });
    }
  }
);

// user can create an employee
userRouter.post(
  "/create",
  middleware,
  upload.single("imgUrl"), // handles multipart/form-data with an image field
  async (req: Request, res: Response): Promise<any> => {
    const { file, body } = req;

    // validate presence of file
    if (!file) {
      return res.status(400).json({ message: "Please upload a file." });
    }

    // Upload to cloudinary first
    const hostedImageUrl = await uploadToCloudinary(
      file as Express.Multer.File
    );
    if (!hostedImageUrl) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // Validate data
    const parsedBody = {
      ...body,
      mobileNum: Number(body.mobileNum),
      imgUrl: hostedImageUrl, // now this is a URL string
    };

    const result = employeeSchema.safeParse(parsedBody);
    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    // Create employee
    try {
      await employeeModel.create(result.data);
      return res.status(200).json({ message: "Employee created successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Something went wrong while creating employee" });
    }
  }
);

// user can update an employee
userRouter.put(
  "/update/:id",
  middleware,
  upload.single("imgUrl"), // allow image upload on update too
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { file, body } = req;

    if (!id) {
      return res.status(400).json({ message: "Employee ID not found" });
    }

    let hostedImageUrl = body.imgUrl;

    // If a new image is uploaded, upload it to Cloudinary
    if (file) {
      hostedImageUrl = await uploadToCloudinary(file as Express.Multer.File);
      if (!hostedImageUrl) {
        return res.status(500).json({ message: "Image upload failed" });
      }
    }

    // Validate updated data
    const parsedBody = {
      ...body,
      mobileNum: Number(body.mobileNum),
      imgUrl: hostedImageUrl, // use either old or new URL
    };

    const result = employeeSchema.safeParse(parsedBody);
    if (!result.success) {
      return res.status(400).json({ message: result.error });
    }

    // Update the employee
    try {
      await employeeModel.findByIdAndUpdate(id, result.data, { new: true });
      return res.status(200).json({ message: "Employee updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error updating employee" });
    }
  }
);

// user can update the status of employee
userRouter.put("/employee/status/:id", middleware, async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  console.log(id, active);

  try {
    const updatedEmployee = await employeeModel.findByIdAndUpdate(
      id,
      { active },
      { new: true }
    );
    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: "Failed to update status", error: err });
  }
});

// user can delete an employee
userRouter.delete(
  "/delete/:id",
  middleware,
  async (req: Request, res: Response): Promise<any> => {
    // getting the employee id from the params
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "employee id not found" });
    }

    // deleting the employee
    try {
      await employeeModel.findByIdAndDelete(id);
    } catch (error) {
      return res
        .status(400)
        .json({ message: "something went wrong while deleting employee" });
    }

    // successfull
    return res.status(200).json({ message: "employee deleted successfully" });
  }
);

// user can logout
userRouter.post("/logout", (_, res: Response): any => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});

export default userRouter;
