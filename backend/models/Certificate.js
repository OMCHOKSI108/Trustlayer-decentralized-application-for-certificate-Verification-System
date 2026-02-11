const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
  {
    certId: {
      type: String,
      required: true,
      unique: true,
      unique: true,
    },
    studentName: {
      type: String,
      required: false, // Optional for compat with old data, but req for new
    },
    sha256Hash: {
      type: String,
      required: true,
    },
    txHash: {
      type: String,
      required: true,
    },
    blockNumber: {
      type: Number,
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revoked: {
      type: Boolean,
      default: false,
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    isExpired: {
      type: Boolean,
      default: false,
    },
    qrCode: {
      type: String, // Base64 Data URL
    },
  },
  { timestamps: true }
);

// Pre-save middleware to check expiry
certificateSchema.pre("save", function (next) {
  if (this.expiryDate && this.expiryDate < new Date()) {
    this.isExpired = true;
  }
  next();
});

module.exports = mongoose.model("Certificate", certificateSchema);
