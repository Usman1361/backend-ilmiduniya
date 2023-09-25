import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import { service } from "../models/service.js";
import { v2 as cloudinary } from "cloudinary";
export const servceRouter = Router();

cloudinary.config({
  cloud_name: "dlavswv9v",
  api_key: "917486666464596",
  api_secret: "d2sqp3d-OCV3B0L0OaP23B9MYCA",
});
servceRouter.post("/services", verifyToken, async (req, res) => {
  const { heading1, heading2, paragraph } = req.body;
  const file = req.files.image;

  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath);

    if (!result) {
      return res
        .status(500)
        .json({ message: "Failed to upload image to Cloudinary." });
    }

    const imagePath = result.url;

    const newService = new service({
      heading1,
      heading2,
      paragraph,
      image: imagePath,
    });

    await newService.save();

    res.status(200).json({ message: "Data sent successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});

servceRouter.get("/services", async (req, res) => {
  try {
    const services = await service.find();
    res.status(200).json({ data: services });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});
servceRouter.delete("/services/:id", verifyToken, async (req, res) => {
  const serviceId = req.params.id;

  try {
    // Find the service by ID
    const existingService = await service.findById(serviceId);

    if (!existingService) {
      return res.status(404).json({ message: "Service not found." });
    }

    // Delete the image from Cloudinary
    const imagePath = existingService.image;
    const urlArray = imagePath.split("/");
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split(".")[0];
    if (imagePath) {
      const cloudinaryResult = await cloudinary.uploader.destroy(imageName);

      if (cloudinaryResult.result !== "ok") {
        console.error(
          "Error deleting image from Cloudinary:",
          cloudinaryResult
        );
      }
    }

    // Delete the service from the database using deleteOne
    await existingService.deleteOne();

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});
