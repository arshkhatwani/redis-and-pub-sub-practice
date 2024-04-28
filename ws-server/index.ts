import { WebSocketServer } from "ws";
import { ProblemManager } from "./ProblemManager";

const wss = new WebSocketServer({ port: 8080 });
const problemManager = ProblemManager.getInstance();

/* 
Users connect with server and send 'problem id' as message and any updates in 'problems_done' channel related to the sent 'problem id' are sent to the connected user
*/

async function startServer() {
    wss.on("connection", async (ws) => {
        ws.on("error", console.error);

        ws.on("message", async function message(problemId: any) {
            const userProblemId = problemId.toString();
            problemManager.addUser(ws, userProblemId);
        });
    });

    console.log("WS Server started on port 8080");
}

startServer();
