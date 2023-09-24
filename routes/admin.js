import { Router } from "express";
// import { dbConnection } from "../index.js";
import { JWT_SECRET } from "../config/app.js";
import { verifyToken } from "../middleware/index.js";
import jwt from "jsonwebtoken";
import { user } from "../models/user.js";
export const adminRouter = Router();
adminRouter.get("/admin", verifyToken, async (req, res) => {
  try {
    const admins = await user.find();
    res.status(200).json({ data: admins });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
});

// Create a new admin
adminRouter.post("/admin", verifyToken, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const admin = new user({ name, email, password });
    await admin.save();
    res.json({ message: "Admin created successfully." });
  } catch (error) {
    console.error("Error Creating Admin.", error);
    res.status(500).json({ error: "Error Creating Admin.." });
  }
});

// Admin login (authentication)
adminRouter.post("/adminLogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await user.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    const token = jwt.sign({ admin }, JWT_SECRET, {
      expiresIn: "90m",
    });
    res.status(200).json({
      status: true,
      data: {
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete an admin by ID
adminRouter.delete("/admin/:id", verifyToken, async (req, res) => {
  const id = req.params.id;
  try {
    const result = await user.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Admin not found." });
    }
    res.status(200).json({ message: "Admin deleted successfully." });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "An error occurred while deleting admin." });
  }
});
