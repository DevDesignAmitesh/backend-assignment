import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";
dotenv.config();

// Run once during startup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Upload function
export const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<string | null> => {
  return new Promise((resolve, _) => {
    if (!file) return resolve(null);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "backend-assignment" },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary upload error:", error);
          return resolve(null);
        }
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
