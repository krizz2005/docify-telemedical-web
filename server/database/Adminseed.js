const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./User"); // adjust if User.js path is different

const MONGO_URI = "MONGO_URI=mongodb+srv://Intelliexam:Krishnanda2005@cluster0.d6m5vvk.mongodb.net/Docify"; // update if needed

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = new User({
      name: "Super Admin",
      email: "admin@docify.com",  // ✅ match with login email
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("✅ Admin created successfully!");
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
  }
}

createAdmin();
