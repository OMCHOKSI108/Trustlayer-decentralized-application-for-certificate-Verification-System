const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // -----------------------------
    // 1️⃣ Clean existing admins
    // -----------------------------
    const deleted = await User.deleteOne({ role: "admin" });

    if (deleted.deletedCount > 0) {
      console.log(`🗑️  Removed ${deleted.deletedCount} existing admin(s)`);
    } else {
      console.log("ℹ️  No existing admin found");
    }

    // -----------------------------
    // 2️⃣ Validate ENV variables
    // -----------------------------
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Missing ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD in .env");
    }

    // -----------------------------
    // 3️⃣ Hash password
    // -----------------------------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // -----------------------------
    // 4️⃣ Create new admin
    // -----------------------------
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      password: hashedPassword,
      role: "admin",
      status: "approved",
    });

    console.log("🎉 Admin seeded successfully");
    console.log("   Email:", admin.email);

  } catch (error) {
    console.error("❌ Seed error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
};

seedAdmin();
