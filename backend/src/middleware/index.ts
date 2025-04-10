import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const middleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  // getting the token from cookies
  const token = req.cookies.token;

  // confirming the token
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // verifying the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
