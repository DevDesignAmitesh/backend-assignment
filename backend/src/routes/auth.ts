import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Router } from "express";
import dotenv from "dotenv";
dotenv.config();

const authRouter = Router();

authRouter.get("/isAuth", (req: Request, res: Response): any => {
  const token = req.cookies.token; // get the token from the cookies

  if (!token) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!); // verify it
    return res.status(200).json({
      isAuthenticated: true,
      message: "authenticated",
      username: (decoded as any).username,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ isAuthenticated: false, message: "Invalid token" });
  }
});

export default authRouter;
