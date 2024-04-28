import { createClient, RedisClientType } from "redis";
import WebSocket from "ws";

export class ProblemManager {
    private static instance: ProblemManager;
    private redisClient: RedisClientType;
    private userProblems: Map<string, WebSocket>;

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
        this.userProblems = new Map();
        this.subscribeToProblems();
    }

    public static getInstance(): ProblemManager {
        if (!this.instance) {
            this.instance = new ProblemManager();
        }
        return this.instance;
    }

    public addUser(user: WebSocket, problemId: string) {
        this.userProblems.set(problemId, user);
        console.log(`User added with problem id: ${problemId}`);
    }

    private subscribeToProblems() {
        this.redisClient.subscribe("problems_done", (message: string) => {
            const data = JSON.parse(message);
            const problemId = data.problemId;

            if (problemId && this.userProblems.has(problemId)) {
                const ws = this.userProblems.get(problemId);
                ws?.send(message);
                console.log(
                    "Sent problem update to client with problem id:",
                    problemId
                );
            }
        });
        console.log("Subscribed to problems_done channel");
    }
}
