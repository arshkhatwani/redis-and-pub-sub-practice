import { createClient } from "redis";

const client = createClient();

async function processSubmission(submission: string) {
    const { problemId, language, code } = JSON.parse(submission);

    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${language}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Finished processing for problem id: ${problemId}`);
}

async function startWorker() {
    try {
        await client.connect();

        while (true) {
            try {
                console.log("Looking for submissions");
                const submission = await client.brPop("problems", 0);

                // @ts-ignore
                await processSubmission(submission.element);
            } catch (err) {
                console.error("Error processing submission", err);
            }
        }
    } catch (error) {
        console.error("Failed to connect to redis", error);
    }
}

startWorker();
