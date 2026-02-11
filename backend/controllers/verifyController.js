const crypto = require("crypto");
const Verification = require("../models/Verification");
const User = require("../models/User");
const Certificate = require("../models/Certificate");
const { getContract } = require("../config/blockchain");
const { generateHashFromBuffer, hashToBytes32 } = require("../utils/hashGenerator");

// Verify a certificate — BLOCKCHAIN IS THE SOURCE OF TRUTH
const verifyCertificate = async (req, res) => {
  try {
    const file = req.file;
    const { fileHash } = req.body;

    if (!file && !fileHash) {
      return res.status(400).json({ message: "Certificate file or hash is required" });
    }

    // Step 1: Get Hash (either from file buffer or direct input)
    let uploadedHash;
    if (file) {
      uploadedHash = generateHashFromBuffer(file.buffer);
    } else {
      uploadedHash = fileHash;
    }

    const bytes32Hash = "0x" + uploadedHash;

    let verificationResult;
    let details = {};

    // Step 2: Query blockchain DIRECTLY by hash — this is the decentralized verification
    const contract = getContract();
    if (!contract) {
      return res.status(500).json({ message: "Blockchain connection unavailable. Please try again later." });
    }

    try {
      const result = await contract.verifyCertificateByHash(bytes32Hash);
      const certId = result[0];
      const issuer = result[1];
      const timestamp = Number(result[2]);
      const exists = result[3];
      const revoked = result[4];

      if (!exists) {
        verificationResult = "not_found";
        details.message = "This certificate was NOT found on the blockchain. It was never issued or is a forgery.";
      } else if (revoked) {
        verificationResult = "revoked";
        details.message = "This certificate has been REVOKED by the issuing authority.";
        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      } else {
        // Check DB for extra details like expiry (since blockchain might not have it)
        const dbCert = await Certificate.findOne({ certId }); // Blockchain gives us certId

        if (dbCert && (dbCert.isExpired || (dbCert.expiryDate && new Date(dbCert.expiryDate) < new Date()))) {
          verificationResult = "expired";
          details.message = "Certificate has EXPIRED.";
        } else {
          verificationResult = "authentic";
          details.message = "Certificate is AUTHENTIC. Verified on blockchain.";
        }

        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      }
    } catch (err) {
      console.error("Blockchain verification error:", err);
      return res.status(500).json({ message: "Blockchain query failed: " + err.message });
    }

    // Step 3: Log verification attempt (minimal — just hash + result)
    await Verification.create({
      fileHash: uploadedHash,
      verifiedBy: req.user._id,
      result: verificationResult,
    });

    res.json({
      result: verificationResult,
      details,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ message: "Verification failed: " + error.message });
  }
};

// Public verification by hash (no auth required, expects hash in body)
const verifyPublic = async (req, res) => {
  try {
    const { fileHash } = req.body;

    if (!fileHash) {
      return res.status(400).json({ message: "File hash is required" });
    }

    const bytes32Hash = "0x" + fileHash;
    let verificationResult;
    let details = {};

    const contract = getContract();
    if (!contract) {
      return res.status(500).json({ message: "Blockchain connection unavailable" });
    }

    try {
      const result = await contract.verifyCertificateByHash(bytes32Hash);
      const certId = result[0];
      const issuer = result[1];
      const timestamp = Number(result[2]);
      const exists = result[3];
      const revoked = result[4];

      if (!exists) {
        verificationResult = "not_found";
        details.message = "Certificate not found on blockchain.";
      } else if (revoked) {
        verificationResult = "revoked";
        details.message = "Certificate has been REVOKED.";
        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      } else {
        // Check DB for extra details like expiry
        const dbCert = await Certificate.findOne({ certId });

        if (dbCert && (dbCert.isExpired || (dbCert.expiryDate && new Date(dbCert.expiryDate) < new Date()))) {
          verificationResult = "expired";
          details.message = "Certificate has EXPIRED.";
        } else {
          verificationResult = "authentic";
          details.message = "Certificate is AUTHENTIC.";
        }

        details.certId = certId;
        details.issuerAddress = issuer;
        details.blockchainTimestamp = new Date(timestamp * 1000);
      }
    } catch (err) {
      console.error("Blockchain error:", err);
      return res.status(500).json({ message: "Blockchain verification failed" });
    }

    // Optional: Log public verification? Skipping for now to avoid User validation issues if VerifiedBy is required

    res.json({
      result: verificationResult,
      details,
    });

  } catch (error) {
    console.error("Public verification error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get verification history (filtered by role)
const getVerificationHistory = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "user") {
      query = { verifiedBy: req.user._id };
    }
    // admin sees all

    const verifications = await Verification.find(query)
      .populate("verifiedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(verifications);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get list of approved universities for verification dropdown
const getUniversities = async (req, res) => {
  try {
    const universities = await User.find(
      { role: "university", status: "approved" },
      { name: 1, organization: 1, _id: 1 }
    ).sort({ organization: 1 });

    res.json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    res.status(500).json({ message: "Failed to fetch universities" });
  }
};

// Public verification by Cert ID (for QR codes)
const verifyCertificateByIdPublic = async (req, res) => {
  try {
    const { certId } = req.params;

    // Check DB first
    const cert = await Certificate.findOne({ certId }).populate("issuedBy", "name organization");

    if (!cert) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    // Check blockchain to ensure it's not revoked
    const contract = getContract();
    if (!contract) return res.status(500).json({ message: "Blockchain unavailable" });

    // We need the hash to verify on blockchain if we want to be strict, 
    // but contract.verifyCertificateByHash takes hash.
    // Does contract have verify by ID? 
    // The user's Solidity might not index by ID?
    // User said: "contract.verifyCertificateByHash(bytes32Hash)"
    // Typically smart contracts map Hash -> Info. Only hash is guaranteed unique/indexed often.
    // But our DB has the hash.
    const bytes32Hash = hashToBytes32(cert.sha256Hash);
    // We need usage of hashToBytes32 here but we didn't import it in verifyController.
    // We can just add "0x" if it isn't waiting.
    // Wait, usually hash is hex string.

    // Let's rely on DB state + Blockchain check
    // If we have hash in DB, we can check blockchain status.

    let blockchainResult;
    try {
      const result = await contract.verifyCertificateByHash("0x" + cert.sha256Hash);
      const revoked = result[4];
      const exists = result[3];

      if (!exists) blockchainResult = "not_found";
      else if (revoked) blockchainResult = "revoked";
      else blockchainResult = "authentic";

    } catch (e) {
      console.error("Blockchain check failed", e);
      blockchainResult = "unknown";
    }

    let status = "authentic";
    if (cert.revoked || blockchainResult === "revoked") status = "revoked";
    if (cert.isExpired || (cert.expiryDate && new Date(cert.expiryDate) < new Date())) status = "expired";
    if (blockchainResult === "not_found") status = "invalid_on_blockchain";

    res.json({
      certId: cert.certId,
      issuedBy: cert.issuedBy,
      studentName: cert.studentName || "N/A",
      issueDate: cert.createdAt,
      expiryDate: cert.expiryDate,
      status: status,
      blockchainStatus: blockchainResult
    });

  } catch (error) {
    console.error("Public ID Verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { verifyCertificate, getVerificationHistory, getUniversities, verifyPublic, verifyCertificateByIdPublic };
