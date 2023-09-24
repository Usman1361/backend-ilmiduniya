import { Router } from "express";
import { verifyToken } from "../middleware/index.js";
import { service } from "../models/service.js";
import { uploadFile } from "../middleware/index.js";
export const servceRouter = Router();
servceRouter.post("/services", verifyToken, uploadFile, async (req, res) => {
  const { heading1, heading2, paragraph } = req.body;
  const imagePath = req.file ? req.file.path : null;

  try {
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
    // Find and remove the service by ID
    const deletedService = await service.findByIdAndDelete(serviceId);

    if (!deletedService) {
      return res.status(404).json({ message: "Service not found." });
    }

    res.status(200).json({ message: "Service deleted successfully." });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "An error occurred." });
  }
});
