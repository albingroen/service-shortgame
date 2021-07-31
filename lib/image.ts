import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
});

export const uploadImage = async (image: any) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({}, cloudinaryDone).end(image);

    function cloudinaryDone(error: any, result: any) {
      if (error) {
        return reject(error);
      }
      return resolve(result.secure_url);
    }
  });
};
