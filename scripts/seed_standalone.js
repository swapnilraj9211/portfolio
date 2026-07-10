const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  role: { type: String, required: true },
  regNo: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  mobile: String
}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seed() {
  const uri = process.env.MONGO_URI;
  console.log("Connecting to:", uri.split('@')[1]);

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected!");
    
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    const users = [
      {
        name: "Student User",
        email: "student@gec.ac.in",
        role: "student",
        regNo: "21105152003",
        password: hashedPassword,
        mobile: "9876543210"
      },
      {
        name: "Faculty User",
        email: "faculty@gec.ac.in",
        role: "faculty",
        password: hashedPassword,
        mobile: "9876543211"
      },
      {
        name: "Academics User",
        email: "academics@gec.ac.in",
        role: "academics",
        password: hashedPassword,
        mobile: "9876543212"
      },
    ];

    for (const user of users) {
      // Check query: regNo for student, email for others
      let query = {};
      if (user.role === 'student') query = { regNo: user.regNo };
      else query = { email: user.email };

      const existingUser = await User.findOne(query);
      if (!existingUser) {
        await User.create(user);
        console.log(`✅ Created: ${user.role}`);
      } else {
        console.log(`⚠️ Exists: ${user.role}`);
        // Update password just in case
        existingUser.password = hashedPassword;
        existingUser.role = user.role; // Ensure role is correct
        await existingUser.save();
        console.log(`   Updated password/role for ${user.role}`);
      }
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

seed();
