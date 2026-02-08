import { IncomingMessage } from "http";
import { Duplex } from "stream";
import WebSocket, { WebSocketServer } from "ws";
import http from "http";
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
    this.roomMap = new Map();
    const redisUrl = process.env.REDIS_URL || "";
    console.log(redisUrl, "redis");
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
    this.subscriber.on("message", (channel, message) => {
      console.log("Redis sub on")
      this.BroadCast(channel, message);
    });
    this.server = http.createServer(this.HandleHttpRequest);
    this.server.on("upgrade", this.HandleUpgrade);
    this.wss = new WebSocketServer({ noServer: true });
  }
  private BroadCast(userChannel: string, message: string) {
    console.log(userChannel, message);
    this.roomMap.forEach((channelName, ws) => {
      if (channelName === userChannel && ws.readyState === WebSocket.OPEN) {
        console.log(message, "User message");
        console.log(userChannel, "User channel");
        ws.send(message);
      }
    });
  }

  private HandleHttpRequest = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => {
    res.writeHead(200);
    res.end("Web Socket running");
  };

  private async Subscribe(room: string) {
    if (this.SubscriptionSet.has(room)) return;
    await this.subscriber.subscribe(room);
    this.SubscriptionSet.add(room);
    console.log(`Subscribed to ${room}`);
  }

  private HandleUpgrade = (
    request: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ) => {
    const urlparams = new URL(
      request.url || "",
      `http://${request.headers.host}`,
    );
    const room = urlparams.searchParams.get("room");
    console.log("the room is ", room);
    this.wss.handleUpgrade(request, socket, head, (ws) => {
      if (room) this.roomMap.set(ws, room);
      console.log(room, "Current room");
      this.wss.emit("connection", ws, request);
    });
  };

  static getsocket() {
    if (!this.Instance) {
      this.Instance = new WebsocketManager();
    }
    return this.Instance;
  }

  public initlisteners() {
    const wss = this.wss;
    wss.on("connection", (ws) => {
      console.log("Connection event fired");
      const room = this.roomMap.get(ws);
      if (room) {
        this.Subscribe(room);
      }
      ws.on("error", console.error);
      ws.on("message", async (message) => {
        if (!room) return;
        try {
          console.log(message.toString(), "The msg");
          this.publisher.publish(
            room,
            JSON.stringify({
              message: message.toString(),
              timeStamp: Date.now(),
            }),
          );
          console.log(message.toString(), "we got something ");
          count++;
          console.log("Msg count", count);
        } catch (error) {
          console.log(`Error in publishing message ${error}`);
        }
      });
      ws.on("close", (code, reason) => {
        console.log(`connection has been closed ${code} because of ${reason}`);
        this.roomMap.delete(ws);
      });
    });
  }

  public listen(port: number) {
    this.server.listen(port, () => {
      console.log(
        `server is running on ${process.env.NEXT_PUBLIC_BACKEND_URL}`,
      );
    });
  }
}
