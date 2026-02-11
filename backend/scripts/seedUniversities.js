const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UniversityData = require("../models/UniversityData");

dotenv.config({ path: path.join(__dirname, "../.env") });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected for seeding");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

const seedUniversities = async () => {
    await connectDB();

    const results = [];
    const csvPath = path.join(__dirname, "../university_dataset/UGC Universities.csv");

    fs.createReadStream(csvPath)
        .pipe(csv())
        .on("data", (data) => {
            // Clean keys (remove potential whitespace)
            const cleanData = {};
            Object.keys(data).forEach((key) => {
                cleanData[key.trim()] = data[key] ? data[key].trim() : "";
            });

            // Skip if University name is empty or header row artifact
            if (!cleanData["University"] && !cleanData["Name"]) return;

            results.push({
                sNo: cleanData["S.No"] || cleanData[""] || 0, // Handle the first empty column header if present
                university: cleanData["University"] || cleanData["Name"],
                address: cleanData["Address"],
                state: cleanData["State"],
                website: cleanData["Website"],
            });
        })
        .on("end", async () => {
            try {
                console.log(`Parsed ${results.length} universities from CSV.`);

                // Clear existing data to avoid duplicates
                await UniversityData.deleteMany({});
                console.log("Cleared existing university data.");

                // Insert new data
                await UniversityData.insertMany(results);
                console.log("University data - Seeded Successfully!");

                process.exit();
            } catch (error) {
                console.error("Error seeding data:", error);
                process.exit(1);
            }
        });
};

seedUniversities();
