import next from "next"
import http from "http"

import { WebsocketManager } from "./lib/websocket/server"

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = http.createServer((req, res) => {
        handle(req, res);
    })

    const wsmanager = WebsocketManager.getsocket();

    wsmanager.initlisteners();

    server.on("upgrade", (req, socket, head) => {
        wsmanager.wss.handleUpgrade(req, socket, head, (ws) => {
            wsmanager.wss.emit("connection", ws, req);
        })
    })

    const port = Number(process.env.PORT) || 3000;
    server.listen(port, () => {
        console.log(`New server is running on ${port}`)
    })

})