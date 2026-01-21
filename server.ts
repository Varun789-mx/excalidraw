import { IncomingMessage, request } from "http";
import Redis from "ioredis";
import { Duplex } from "stream";
import http from "http"
import { WebSocketServer } from "ws";

const PORT = 5000;
const pub = new Redis();
const sub = new Redis();
const wss = new WebSocketServer({ noServer: true });


const HandleUpgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    const urlParams = new URL(request.url || "", `http://${request.headers.host}`);
    const room = urlParams.searchParams.get("room");
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    })
}

const initListener = () => {
    wss.on('connection', async (ws) => {
        ws.on('error', console.error);
        ws.on('message', async (message) => {
            console.log(message.toString());
            ws.send(message.toString());
        })
        ws.on('close', async () => {
            console.log('Disconnected');
        })
    })
}


const init = () => {
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Web socket server running');
    })

    server.on('upgrade', (request, socket, head) => {
        HandleUpgrade(request, socket, head);
    })
    initListener();
    server.listen(PORT, () => {
        console.log(`Server is running ws://localhost:${PORT}`);
    })
}

init();