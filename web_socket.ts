    import next from "next"
    import http from "http"

    import { WebsocketManager } from "./lib/websocket/server"
    import { url } from "inspector";

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
            const urlparam = new URL(req.url || "", `http://${req.headers.host}`);
            const room = urlparam.searchParams.get("room");
            console.log("Room from url is ", room)
            wsmanager.wss.handleUpgrade(req, socket, head, (ws) => {
                if (room) {
                    wsmanager.setRoom(ws, room);
                }
                wsmanager.wss.emit("connection", ws, req);
            })
        })
        const port = Number(process.env.PORT) || 3000;
        server.listen(port, () => {
            console.log(`New server is running on ${port}`)
        })

    })