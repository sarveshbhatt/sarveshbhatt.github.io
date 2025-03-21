const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

const GSMA_API_URL = "https://api.gsma.com/device-check/v1/imei";
const GSMA_API_KEY = "YOUR_GSMA_API_KEY"; // Replace with your GSMA API key

async function checkIMEIStatus(imeiList) {
    const results = [];

    for (const imei of imeiList) {
        try {
            const response = await axios.get(`${GSMA_API_URL}/${imei}`, {
                headers: { Authorization: `Bearer ${GSMA_API_KEY}` },
            });
            results.push({
                imei,
                status: response.data.status || "Unknown",
                carrier: response.data.carrier || "Unknown",
            });
        } catch (error) {
            results.push({ imei, status: "Error", carrier: "N/A" });
        }
    }
    return results;
}

app.post("/api/check-imei", async (req, res) => {
    const { imeis } = req.body;
    if (!imeis || imeis.length === 0) return res.status(400).json({ error: "No IMEIs provided" });

    const results = await checkIMEIStatus(imeis.slice(0, 9000));
    res.json(results);
});

app.listen(3000, () => console.log("Server running on port 3000"));
