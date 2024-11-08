// utils/imageUtils.ts
import sharp from "sharp";

// Validate if the file is of acceptable image type
const isValidImageType = (file: File): boolean => {
  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  return validTypes.includes(file.type);
};

// Reduce quality and crop images using Sharp
export const reduceImageQualityAndCrop = async (
  file: File | string,
  quality: number = 70, // Quality as percentage (1-100)
  width: number = 800, // Default width for cropping
  height: number = 800 // Default height for cropping
): Promise<string> => {
  // If the file is a URL, return it as is
  if (typeof file === "string") {
    return file;
  }

  // Validate the image file type
  if (!isValidImageType(file)) {
    throw new Error("Invalid image type. Only PNG, JPG, and JPEG are accepted.");
  }

  // If the file is a File object, process it with Sharp
  const buffer = await file.arrayBuffer();
  const processedImageBuffer = await sharp(Buffer.from(buffer))
    .resize(width, height)
    .jpeg({ quality }) // Set quality for JPEG
    .toBuffer();

  // Convert the processed image buffer to a Data URL
  const dataUrl = `data:image/jpeg;base64,${processedImageBuffer.toString("base64")}`;
  return dataUrl;
};
