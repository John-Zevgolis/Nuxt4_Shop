import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: any) => {
  const base64Image = `data:${file.type};base64,${file.data.toString(
    'base64',
  )}`;

  const uploadResponse = await cloudinary.uploader.upload(base64Image, {
    folder: 'shop',
  });

  return uploadResponse.secure_url;
};
