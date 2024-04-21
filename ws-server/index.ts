import { WebSocketServer } from "ws";
import { createClient } from "redis";

const wss = new WebSocketServer({ port: 8080 });
const client = createClient();

/* 
Users connect with server and send 'problem id' as message and any updates in 'problems_done' channel related to the sent 'problem id' are sent to the connected user
*/

async function startServer() {
    await client.connect();

    wss.on("connection", async (ws) => {
        let userProblemId: string | null = null;

        ws.on("error", console.error);

        ws.on("message", async function message(problemId: any) {
            console.log("received:", problemId.toString());
            userProblemId = problemId.toString();
        });

        await client.subscribe("problems_done", (message: string) => {
            const data = JSON.parse(message);

            if (ws.readyState === ws.OPEN && data.problemId === userProblemId) {
                ws.send(message);
                console.log(
                    "Sent problem update to client with problem id:",
                    userProblemId
                );
            }
        });
    });

    console.log("WS Server started on port 8080");
}

startServer();
