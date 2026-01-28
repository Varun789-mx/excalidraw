import { IncomingMessage } from "http";
import { Duplex } from "stream";
import WebSocket, { WebSocketServer } from "ws";
import http from "http"
import Redis from "ioredis";

let count = 0;
export class WebsocketManager {
    private static Instance: WebsocketManager;
    public wss: WebSocketServer;
    private publisher: Redis;
    private subscriber: Redis;
    private roomMap: Map<WebSocket, string>;
    private SubscriptionSet = new Set<string>();
    private server: http.Server;

    constructor() {
        //we initialize their values the server part is bit confusing
        this.roomMap = new Map();
        this.publisher = new Redis();
        this.subscriber = new Redis();
        this.subscriber.on('message', (channel, message) => {
            this.BroadCast(channel, message);
        })
        this.server = http.createServer(this.HandleHttpRequest);
        this.server.on('upgrade', this.HandleUpgrade);
        this.wss = new WebSocketServer({ noServer: true });
    }

    public publish(channelName: string, message: string) {
        this.publisher.publish(channelName, message)
    }
    private BroadCast(userChannel: string, message: string) {
        console.log(userChannel, message);
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
        this.subscriber.subscribe(room);
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
            console.log(request.url, "request url")
        })
    }
    static getsocket() {
        if (!this.Instance) {
            this.Instance = new WebsocketManager()
        }
        return this.Instance;
    }

    //this shows the message
    public initlisteners() {
        const wss = this.wss;
        wss.on('connection', (ws) => {
            const room = this.roomMap.get(ws);
            if (room) {
                this.subscriber.subscribe(room);
            }
            ws.on('error', console.error);
            ws.on('message', async message => {
                if (!room) return;
                try {
                    await this.publisher.publish(room, JSON.stringify({
                        message: message.toString(),
                        timeStamp: Date.now(),
                    }))
                    console.log(message.toString(), "from client msg ");
                    count++;
                    console.log("Msg count", count);
                } catch (error) {
                    console.log(`Error in publishing message ${error}`);
                }

            })
            ws.on('close', (code, reason) => {
                console.log(`connection has been closed ${code} because of ${reason}`);
                this.SubscriptionSet
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