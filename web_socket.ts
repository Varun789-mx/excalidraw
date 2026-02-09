import next from "next";
import http from "http";
import { WebsocketManager } from "./lib/websocket/server";
import { IncomingMessage, ServerResponse } from "node:http";
import { Duplex } from "node:stream";
import { parse } from "node:url";

const dev = false;
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer(
    (req: IncomingMessage, res: ServerResponse) => {
      handle(req, res);
    },
  );

  const wsmanager = WebsocketManager.getsocket();

  wsmanager.initlisteners();

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url || "/", true);
    const urlparam = new URL(req.url || "", `http://${req.headers.host}`);
    const room = urlparam.searchParams.get("room");
    console.log("Room from url is ", room);
    if (pathname?.startsWith("/_next")) {
      app.getUpgradeHandler()(req, socket, head);
      return;
    }

    if (pathname !== "/ws") {
      socket.destroy();
      return;
    }
    wsmanager.wss.handleUpgrade(req, socket, head, (ws) => {
      if (room) {
        wsmanager.setRoom(ws, room);
      }
      wsmanager.wss.emit("connection", ws, req);
    });
  });
  const port = Number(process.env.PORT) || 3000;
  server.listen(port, () => {
    console.log(`New server is running on ${port}`);
  });
});
