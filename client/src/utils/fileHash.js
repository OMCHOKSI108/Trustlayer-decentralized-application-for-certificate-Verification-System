/**
 * Calculates the SHA-256 hash of a File object using the Web Crypto API.
 * This runs entirely on the client side.
 * 
 * @param {File} file - The file to hash
 * @returns {Promise<string>} - The hex string of the hash
 */
export const calculateFileHash = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
};
