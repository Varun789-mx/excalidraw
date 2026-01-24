import { IncomingMessage } from "http";
import { Duplex } from "stream";
import { WebSocketServer } from "ws";
import http from "http"

class Websocket {
    private wss: WebSocketServer;
    private roomMap: Map<Websocket, string>;
    private SubscriptionSet = new Set<string>();
    private server: http.Server;

    constructor() {
        this.wss = new WebSocketServer({ noServer: true });
        this.roomMap = new Map();
        this.server = http.createServer();
    }

    private HandlehttpRequest = (req: http.IncomingMessage, res: http.ServerResponse) => {
        res.writeHead(200);
        res.end('Web Socket running');
    }

    private HandleUpgrade(request: IncomingMessage, socket: Duplex, head: Buffer) {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
            ws.emit('connection', ws, request);
        })
    }

    getsocket() {
        
        return this.wss;
    }


}