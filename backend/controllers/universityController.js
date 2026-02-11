const axios = require("axios");
const UniversityData = require("../models/UniversityData");

exports.searchUniversities = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({ message: "Name query parameter is required" });
        }

        // 1. Search Local Database
        // Using regex for partial match, case-insensitive
        const localPromise = UniversityData.find({
            university: { $regex: name, $options: "i" },
        }).limit(20);

        // 2. Search Hipolabs API
        const hipolabsPromise = axios.get(`http://universities.hipolabs.com/search?name=${name}`);

        // Execute in parallel
        const [localResults, apiResponse] = await Promise.all([
            localPromise.catch(err => {
                console.error("Local DB search error:", err);
                return [];
            }),
            hipolabsPromise.catch(err => {
                console.error("Hipolabs API error:", err);
                return { data: [] };
            })
        ]);

        // Format Local Results
        const formattedLocal = localResults.map(uni => ({
            name: uni.university,
            website: uni.website,
            state: uni.state,
            address: uni.address,
            source: "Local Database (UGC)",
        }));

        // Format API Results
        const formattedApi = apiResponse.data.map(uni => ({
            name: uni.name,
            website: uni.web_pages ? uni.web_pages[0] : "",
            state: uni["state-province"],
            country: uni.country,
            source: "Hipolabs API",
        }));

        // Merge and return
        // We can prioritize local results
        const combinedResults = [...formattedLocal, ...formattedApi];

        res.status(200).json({
            count: combinedResults.length,
            results: combinedResults,
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
