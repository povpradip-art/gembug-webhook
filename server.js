const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());

const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_URL;

// =========================
// GEMBUG SOUNDBOARD CONFIG
// =========================

const GEMBUG_SOUNDS = {
    "7a4157be-0667-4522-9a69-fb275a5121e1": {
        name: "PUSH-UP",
        quantity: 5,
        unit: "reps",
        isFinalBoss: false
    },
    "4180a320-eee6-4a5b-bdde-7c55cf5fa10f": {
        name: "SQUAT",
        quantity: 5,
        unit: "reps",
        isFinalBoss: false
    },
    "0b841f6e-112d-494c-b382-49874bd8f2e8": {
        name: "BICEP CURL",
        quantity: 5,
        unit: "reps each side",
        isFinalBoss: false
    },
    "1562e3a9-14fc-4b8d-87be-6f5f42b169df": {
        name: "BAND ROW",
        quantity: 5,
        unit: "reps",
        isFinalBoss: false
    },
    "504deb56-caa8-49ee-b44a-afdf4543fe82": {
        name: "DEAD HANG",
        quantity: 25,
        unit: "seconds",
        isFinalBoss: false
    },
    "4c055010-e522-4308-9c68-828703f582b9": {
        name: "FINAL BOSS",
        quantity: 25, // 25 reps per gerakan (Push Up, Squat, Bicep Curl, Band Row)
        unit: "reps per workout",
        isFinalBoss: true
    }
};

// =========================
// WEBHOOK TAKO
// =========================

app.post("/tako-webhook", async (req, res) => {
    console.log("\n=== WEBHOOK TAKO MASUK ===");
    console.log(JSON.stringify(req.body, null, 2));

    const data = req.body;

    // Hanya proses soundboard sukses
    if (data.type !== "soundboard" || data.status !== "success") {
        console.log("Bukan soundboard sukses. Diabaikan.");
        return res.status(200).json({ success: true, ignored: true });
    }

    const soundId = data.soundboardSoundId;

    // Cek apakah soundboard Gembug
    const workout = GEMBUG_SOUNDS[soundId];

    if (!workout) {
        console.log("Soundboard bukan Gembug. Diabaikan.");
        return res.status(200).json({ success: true, ignored: true });
    }

    console.log("GEMBUG:", workout.name);
    console.log("QUANTITY:", workout.quantity);
    console.log("UNIT:", workout.unit);

    // =========================
    // KIRIM KE GOOGLE SHEETS
    // =========================

    try {
        const response = await fetch(GOOGLE_SHEETS_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: data.id || "",
                timestamp: data.createdAt || new Date().toISOString(),
                donor: data.gifterName || "Anonymous",
                soundboard: workout.name,
                soundId: soundId,
                nominal: data.amount || 0,
                status: "LIVE",
                quantity: workout.quantity,
                unit: workout.unit,
                isFinalBoss: workout.isFinalBoss
            }),
            redirect: "follow" // Memastikan Node fetch mengikuti redirect dari Google Apps Script
        });

        const result = await response.text();
        console.log("Google Sheets Response:", result);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Gagal kirim ke Google Sheets:", error);
        res.status(500).json({
            success: false,
            error: error.toString()
        });
    }
});

// =========================
// TEST SERVER
// =========================

app.get("/", (req, res) => {
    res.send("Gembug Webhook aktif!");
});

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Gembug Webhook berjalan di http://localhost:${PORT}`);
});