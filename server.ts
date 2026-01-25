import { IncomingMessage, request } from "http";
import Redis from "ioredis";
import { Duplex } from "stream";
import http from "http"
import { WebSocketServer } from "ws";
import { subscribe } from "diagnostics_channel";

const PORT = 5000;
const pub = new Redis();
const sub = new Redis();
const wss = new WebSocketServer({ noServer: true });
const roomMap = new Map<WebSocket, string>;
const SubscriptionSet = new set<string>();


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
const brodcast = (message: string, userchannel: string) => {
    roomMap.forEach((channel, ws) => {
        if (channel === userchannel && ws.readyState === 1) {
            ws.send(message);
        }
    })
}

const initRedis = () => {
    try {
        roomMap.forEach(async (room) => {
            await sub.subscribe(room);
            console.log("Subscribe to room", room);
            console.log("Current channel", room);
        })
    } catch (error) {
        console.log(``)
    }
}
const Subscribe= async(room:string)=> { 
    if(subs)
}

const init = () => {
    const server = http.createServer((req, res) => {
        res.writeHead(200);
        res.end('Web socket server running');
    })
    server.on('upgrade', (request, socket, head) => {
        HandleUpgrade(request, socket, head);
    })
    sub.on('connection',async(ws)=>{
        const room = roomMap.get(ws);
        if(room) {
            subscribe(room);
        }
    })
    sub.on('message', (channel, message) => {
        if(!room) return;

        brodcast(message, channel);
    })


    initListener();
    server.listen(PORT, () => {
        console.log(`Server is running ws://localhost:${PORT}`);
    })
}

init();