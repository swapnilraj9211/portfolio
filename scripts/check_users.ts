import mongoose from "mongoose";
import User from "../models/User";
import connectToDatabase from "../lib/db";
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkUsers() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI not found");
    console.log("Attempting to connect to:", uri.substring(0, 20) + "...");
    
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to database");
    
    const users = await User.find({});
    console.log(`Found ${users.length} users`);
    if (users.length === 0) console.log("Database is empty!");
    
    users.forEach(u => console.log(`- ${u.role}: ${u.email || u.regNo}`));
    process.exit(0);
  } catch (error) {
    console.error("Check failed:", error);
    process.exit(1);
  }
}

checkUsers();
