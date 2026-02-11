const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const Certificate = require("../models/Certificate");
const { generateHashFromBuffer, hashToBytes32 } = require("../utils/hashGenerator");
const { getContract } = require("../config/blockchain");

// Issue a new certificate (University only)
const issueCertificate = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Certificate file is required" });
    }

    // Generate unique certificate ID
    const certId = "CERT-" + uuidv4().slice(0, 8).toUpperCase();

    // Generate SHA-256 hash from the ACTUAL file buffer
    const sha256Hash = generateHashFromBuffer(file.buffer);

    // Store hash on blockchain
    const contract = getContract();
    if (!contract) {
      return res.status(500).json({ message: "Blockchain connection failed" });
    }

    const bytes32Hash = hashToBytes32(sha256Hash);
    const tx = await contract.issueCertificate(certId, bytes32Hash);
    const receipt = await tx.wait();

    // Generate QR Code
    const QRCode = require("qrcode");
    const verificationUrl = `${process.env.CLIENT_URL}/public-verify/${certId}`;
    const qrImage = await QRCode.toDataURL(verificationUrl);

    // Save minimal record to MongoDB
    const certificate = await Certificate.create({
      certId,
      sha256Hash,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      issuedBy: req.user._id,
      qrCode: qrImage,
      expiryDate: req.body.expiryDate || null,
    });

    res.status(201).json({
      message: "Certificate issued successfully",
      certificate: {
        certId: certificate.certId,
        txHash: certificate.txHash,
        qrCode: certificate.qrCode,
      },
    });
  } catch (error) {
    console.error("Issue certificate error:", error);
    if (error.message?.includes("Certificate already exists")) {
      return res.status(400).json({ message: "Certificate ID already exists on blockchain" });
    }
    res.status(500).json({ message: "Failed to issue certificate: " + error.message });
  }
};

// Get certificates (filtered by role)
const getCertificates = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "university") {
      query = { issuedBy: req.user._id };
    } else if (req.user.role === "user") {
      return res.status(403).json({ message: "Access denied" });
    }
    // admin: no filter

    const certificates = await Certificate.find(query)
      .populate("issuedBy", "name email organization")
      .sort({ createdAt: -1 });

    res.json(certificates);
  } catch (error) {
    console.error("Get certificates error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single certificate by certId
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certId: req.params.certId })
      .populate("issuedBy", "name email organization");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // University can only see their own
    if (req.user.role === "university" && certificate.issuedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Revoke certificate
const revokeCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certId: req.params.certId });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // University can only revoke their own
    if (req.user.role === "university" && certificate.issuedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to revoke this certificate" });
    }

    // Revoke on blockchain
    const contract = getContract();
    if (contract) {
      try {
        const tx = await contract.revokeCertificate(req.params.certId);
        await tx.wait();
      } catch (blockchainError) {
        console.error("Blockchain revoke error:", blockchainError);
      }
    }

    certificate.revoked = true;
    await certificate.save();

    res.json({ message: "Certificate revoked successfully" });
  } catch (error) {
    console.error("Revoke error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get stats for dashboard
const getStats = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "university") {
      query = { issuedBy: req.user._id };
    }

    const total = await Certificate.countDocuments(query);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Certificate.countDocuments({
      ...query,
      createdAt: { $gte: today },
    });
    const revokedCount = await Certificate.countDocuments({ ...query, revoked: true });

    // Check for expired stats
    // Note: isExpired might not be updated if it's just based on date and not a cron job.
    // relying on expiryDate < Date.now() OR isExpired = true
    const expiredCount = await Certificate.countDocuments({
      ...query,
      $or: [
        { isExpired: true },
        { expiryDate: { $lt: new Date() } }
      ]
    });

    res.json({ total, today: todayCount, revoked: revokedCount, expired: expiredCount });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk issue certificates from CSV
const bulkIssue = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required" });
  }

  const results = [];
  const errors = [];
  const csv = require("csv-parser");
  const stream = require("stream");
  const QRCode = require("qrcode");

  const bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);

  try {
    const contract = getContract();
    if (!contract) throw new Error("Blockchain connection failed");

    const processRow = async (row) => {
      try {
        // Expected columns: studentName, courseName, studentEmail, (optional) expiryDate
        // We generate a unique certId for each
        const certId = "CERT-" + uuidv4().slice(0, 8).toUpperCase();

        // Generate a hash based on the content (since we don't have individual files)
        // In a real bulk issue, we might generate a PDF here. base64 -> hash
        // For now, we hash the stringified row data as a proxy for the 'document content'
        const contentToHash = JSON.stringify(row) + certId;
        const sha256Hash = crypto.createHash("sha256").update(contentToHash).digest("hex");
        const bytes32Hash = hashToBytes32(sha256Hash);

        // Blockchain TX
        const tx = await contract.issueCertificate(certId, bytes32Hash);
        const receipt = await tx.wait();

        // QR Code
        const verificationUrl = `${process.env.CLIENT_URL}/public-verify/${certId}`;
        const qrImage = await QRCode.toDataURL(verificationUrl);

        // DB Save
        await Certificate.create({
          certId,
          sha256Hash,
          txHash: receipt.hash,
          blockNumber: receipt.blockNumber,
          issuedBy: req.user._id,
          qrCode: qrImage,
          expiryDate: row.expiryDate || null,
          studentName: row.studentName,
        });

        results.push({ certId, studentName: row.studentName, status: "issued" });
      } catch (err) {
        console.error("Row error:", err);
        errors.push({ row, error: err.message });
      }
    };

    const rows = [];
    bufferStream
      .pipe(csv())
      .on("data", (data) => rows.push(data))
      .on("end", async () => {
        // Process sequentially to manage nonce/concurrency if needed, 
        // though await inside loop handles it generally.
        for (const row of rows) {
          await processRow(row);
        }

        res.json({
          message: "Bulk processing completed",
          total: rows.length,
          successful: results.length,
          failed: errors.length,
          results,
          errors,
        });
      })
      .on("error", (err) => {
        res.status(500).json({ message: "CSV parsing error" });
      });

  } catch (error) {
    console.error("Bulk issue error:", error);
    res.status(500).json({ message: "Bulk issue functionality failed" });
  }
};

module.exports = {
  issueCertificate,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  getStats,
  bulkIssue,
};
