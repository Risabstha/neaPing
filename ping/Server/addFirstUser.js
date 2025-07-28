import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/userModel.js";

dotenv.config();

const addFirstUser = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Check if a user already exists
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create the first user
    const hashedPassword = await bcrypt.hash("Password1@@", 10); // Replace with a secure password
    const user = new User({
      username: "admin",
      password: hashedPassword,
      role: "Admin",
    });

    await user.save();
    console.log("Admin user created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    process.exit(1);
  }
};

addFirstUser();