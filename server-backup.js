const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

app.post("/tako-webhook", (req, res) => {
    console.log("\n=== WEBHOOK TAKO MASUK ===");
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).json({
        success: true
    });
});

app.get("/", (req, res) => {
    res.send("Gembug Webhook aktif!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Gembug Webhook berjalan di http://localhost:${PORT}`);
});