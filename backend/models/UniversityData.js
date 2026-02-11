const mongoose = require("mongoose");

const universityDataSchema = new mongoose.Schema({
    sNo: {
        type: Number,
    },
    university: {
        type: String,
        required: true,
        index: true, // For faster search
    },
    address: {
        type: String,
    },
    state: {
        type: String,
    },
    website: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create text index for search
universityDataSchema.index({ university: "text" });

const UniversityData = mongoose.model("UniversityData", universityDataSchema);

module.exports = UniversityData;
