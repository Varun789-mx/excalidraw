import http from "http";
//create a websocket server for getting data and sending it to the redis 
const redisClient = createClient({ url: process.env.REDIS_URL ?? "redis://127.0.0.1:6379" });
redisClient.on("error", (error) => console.error("Redis error:", err));
redisClient.connect().catch((Error) => console.error("Redis connect failed:", err));

const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws) => {
    ws.on("message", async (message) => {
        const payload = typeof message === "string" ? message : message.toString();
        try {
            await redisClient.publish("excalidraw:updates", payload);
        } catch (err) {
            console.error("Failed to publish to redis:", err);
        }
    });

    ws.send(JSON.stringify({ type: "connected" }));
});

export function attachWebsocketServer(server: any) {
    server.on("upgrade", (req: any, socket: any, head: any) => {
        wss.handleUpgrade(req, socket, head, (ws) => {
            wss.emit("connection", ws, req);
        });
    });
}

export { wss, redisClient };
async function init() {
    
}