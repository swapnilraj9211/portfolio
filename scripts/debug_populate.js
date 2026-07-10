
const mongoose = require("mongoose");
const { Schema, model, models } = mongoose;

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/gecv-service-portal";

// Define Minimal Schemas to avoid importing the entire project structure if complicated
const UserSchema = new Schema({}, { strict: false });
const User = models.User || model("User", UserSchema);

const ServiceRequestSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { strict: false }
);
const ServiceRequest = models.ServiceRequest || model("ServiceRequest", ServiceRequestSchema);

async function main() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Fetch one service request
    const request = await ServiceRequest.findOne({ serviceType: "Bonafide" })
      .populate("studentId", "name regNo email session semester year")
      .lean();

    if (!request) {
      console.log("No Bonafide Service Request found.");
    } else {
      console.log("Service Request found:", request._id);
      console.log("Populated Student:", request.studentId);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
