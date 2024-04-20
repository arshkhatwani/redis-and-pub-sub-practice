import express from "express";
import { createClient } from "redis";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/", (req, res) => {
    res.json({ hello: "world" });
});

app.post("/submit", async (req, res) => {
    try {
        const { code, language, problemId } = req.body;

        await client.lPush(
            "problems",
            JSON.stringify({ code, language, problemId })
        );

        res.send("Submission received!");
    } catch (error) {
        console.error("Unable to process submission", error);
        res.status(500).json({ message: "Submission failed!" });
    }
});

async function startServer() {
    try {
        await client.connect();

        app.listen(3000, () => {
            console.log("Server is running on PORT 3000");
        });
    } catch (error) {
        console.error("Failed to connect to redis", error);
    }
}

startServer();
