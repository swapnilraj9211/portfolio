const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, required: true },
  regNo: { type: String, unique: true, sparse: true },
  password: { type: String, required: true }
}, { strict: false }); // Strict false to read whatever is there

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function check() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
      console.error("No MONGO_URI found");
      process.exit(1);
  }
  console.log("Connecting to:", uri.split('@')[1]); // Masked

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected!");
    
    const users = await User.find({});
    console.log(`User count: ${users.length}`);
    users.forEach(u => console.log(`- ${u.role}: ${u.email || u.regNo}`));
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

check();
