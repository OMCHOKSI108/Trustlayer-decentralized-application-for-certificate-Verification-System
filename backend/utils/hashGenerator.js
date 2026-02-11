const crypto = require("crypto");

/**
 * Generates SHA-256 hash from a buffer.
 * @param {Buffer} buffer - The file buffer.
 * @returns {string} - The hex string of the hash.
 */
const generateHashFromBuffer = (buffer) => {
  return crypto.createHash("sha256").update(buffer).digest("hex");
};

const hashToBytes32 = (hexHash) => {
  return "0x" + hexHash;
};

module.exports = { generateHashFromBuffer, hashToBytes32 };
