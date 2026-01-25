import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { WebSocketServer } from "ws";
import http from "http"
import Redis from "ioredis";

export class Websocket {
    // here we create a wss for websocket sever and roomap for saving rooms in memory and subscriptions in memory
    //idk if static is better or just private variable
    public wss: WebSocketServer;
    private roomMap: Map<Websocket, string>;
    private SubscriptionSet = new Set<string>();
    private server: http.Server;
    private pub: Redis;
    private sub: Redis;

    constructor() {
        //we initialize their values the server part is bit confusing
        this.wss = new WebSocketServer({ noServer: true });
        this.roomMap = new Map();
        this.pub = new Redis();
        this.sub = new Redis();
        this.server = http.createServer(this.HandleHttpRequest);
        this.server.on('upgrade', this.HandleUpgrade);
    }

    private HandleHttpRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
        res.writeHead(200);
        res.end('Web Socket running');
    }
    //this function upgrades the connnection to websocket from http
    private HandleUpgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
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
            ws.on('error', console.error);
            ws.on('message', message => {
                console.log(message);
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