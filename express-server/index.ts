import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on("error", (err) => console.log("Redis Client Error", err));

app.get("/", (req, res) => {
    res.json({ hello: "world" });
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
