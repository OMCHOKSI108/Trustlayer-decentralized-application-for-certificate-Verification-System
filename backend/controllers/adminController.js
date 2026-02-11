const User = require("../models/User");
const Certificate = require("../models/Certificate");
const Verification = require("../models/Verification");

// ===============================
// Get all users (Admin only)
// ===============================
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Get pending universities
// ===============================
const getPendingUniversities = async (req, res) => {
  try {
    const pending = await User.find({
      role: "university",
      status: "pending",
    })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(pending);
  } catch (error) {
    console.error("getPendingUniversities error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Approve / Reject University
// ===============================
const updateUniversityStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "university") {
      return res.status(400).json({ message: "User is not a university" });
    }

    user.status = status;
    await user.save();

    res.json({ message: `University ${status} successfully`, user });
  } catch (error) {
    console.error("updateUniversityStatus error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Delete user
// ===============================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot delete admin" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Admin dashboard stats
// ===============================
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalUniversities = await User.countDocuments({ role: "university" });
    const pendingUniversities = await User.countDocuments({
      role: "university",
      status: "pending",
    });
    const totalCertificates = await Certificate.countDocuments();
    const totalVerifications = await Verification.countDocuments();
    const revokedCertificates = await Certificate.countDocuments({
      revoked: true,
    });

    res.json({
      totalUsers,
      totalUniversities,
      pendingUniversities,
      totalCertificates,
      totalVerifications,
      revokedCertificates,
    });
  } catch (error) {
    console.error("getAdminStats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// Recalculate Trust Scores
// ===============================
const recalculateTrustScores = async (req, res) => {
  try {
    const stats = await Certificate.aggregate([
      {
        $group: {
          _id: "$issuedBy",
          totalIssued: { $sum: 1 },
          revokedCount: {
            $sum: { $cond: ["$revoked", 1, 0] },
          },
        },
      },
    ]);

    const updates = stats.map(async (stat) => {
      let score = 100 - 5 * stat.revokedCount + stat.totalIssued;

      await User.findByIdAndUpdate(stat._id, {
        trustScore: score,
      });
    });

    await Promise.all(updates);

    res.json({
      message: "Trust scores updated successfully",
      count: stats.length,
    });
  } catch (error) {
    console.error("Trust score update error:", error);
    res.status(500).json({
      message: "Failed to recalculate trust scores",
    });
  }
};

// ===============================
// EXPORTS (ONLY ONCE)
// ===============================
module.exports = {
  getAllUsers,
  getPendingUniversities,
  updateUniversityStatus,
  deleteUser,
  getAdminStats,
  recalculateTrustScores,
};
