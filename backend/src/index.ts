import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDb } from "./db";
import userRouter from "./routes/user";
import authRouter from "./routes/auth";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://employee-hub-green.vercel.app",
    credentials: true,
  })
);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

main();

async function main() {
  await connectToDb();
  app.listen(PORT, () => {
    console.log("server is running on", PORT);
  });
}
