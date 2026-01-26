import { IncomingMessage } from "http";
import { Duplex } from "stream";
import WebSocket, { WebSocketServer } from "ws";
import http from "http"
import Redis from "ioredis";

export const pub = new Redis();
export const sub = new Redis()


export class Websocket {
    //    Here we created varibles and pub and sub with their respective types
    public wss: WebSocketServer;
    private roomMap: Map<WebSocket, string>;
    private SubscriptionSet = new Set<string>();
    private server: http.Server;


    constructor() {
        //we initialize their values the server part is bit confusing
        this.wss = new WebSocketServer({ noServer: true });
        this.roomMap = new Map();
        sub.on('message', (channel, message) => {
            this.BroadCast(channel, message);
        })
        this.server = http.createServer(this.HandleHttpRequest);
        this.server.on('upgrade', this.HandleUpgrade);
    }

    public publish(channelName: string, message: string) {
        pub.publish(channelName, message)
    }
    private BroadCast(userChannel: string, message: string) {
        this.roomMap.forEach((channelName, ws) => {
            if (channelName === userChannel && ws.readyState === 1) {
                ws.send(message);
            }
        })
    }
    private HandleHttpRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
        res.writeHead(200);
        res.end('Web Socket running');
    }

    public Subscribe(room: string) {
        if (this.SubscriptionSet.has(room)) return;
        sub.subscribe(room);
        this.SubscriptionSet.add(room);
        console.log(`Subscribed to ${room}`);
    }
    //this function upgrades the connnection to websocket from http
    private HandleUpgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
        const urlparams = new URL(request.url || "", `http://${request.headers.host}`);
        const room = urlparams.searchParams.get("room");
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            if (room) this.roomMap.set(ws, room);
            this.wss.emit('connection', ws, request);
        })
    }

    //this function returns the websocket instance
    getsocket() {
        return this.wss;
    }

    //this shows the message
    public initlisteners() {
        const wss = this.wss;
        wss.on('connection', (ws) => {
            const room = this.roomMap.get(ws);
            if (room) {
                sub.subscribe(room);
            }
            ws.on('error', console.error);
            ws.on('message', async (message) => {
                if (!room) return;
                try {
                    await pub.publish(room, JSON.stringify({
                        message: message.toString(),
                        timeStamp: Date.now(),
                    }))
                } catch (error) {
                    console.log(`Error in publishing message ${error}`);
                }

            })
            ws.on('close', (code, reason) => {
                console.log(`connection has been closed ${code} because of ${reason}`);
            })
        })
    }
    //it listens on port
    public listen(port: number) {
        this.server.listen(port, () => {
            console.log(`server is running on ws://localhost:${port}`);
        })
    }
}