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

  constructor() {
    this.roomMap = new Map();
    const redisUrl = process.env.REDIS_URL || "";
    console.log(redisUrl, "redis");
    this.publisher = new Redis(redisUrl);
    this.subscriber = new Redis(redisUrl);
    this.subscriber.on("connect", () => {
      console.log("Subscriber connected to redis successfully");
    });
    this.publisher.on("connect", () => {
      console.log("publisher connected to redis successfully");
    });
    this.subscriber.on("message", (channel, message) => {
      console.log("Redis sub on");
      this.BroadCast(channel, message);
    });
    this.subscriber.on("error", (err) => {
      console.log("Error occured while connecting to the redis sub", err);
    });
    this.publisher.on("error", (err) => {
      console.log("Error occured while connecting to the redis sub", err);
    });
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

  public setRoom(ws: WebSocket, room: string) {
    this.roomMap.set(ws, room);
    console.log("Current room set");
  }
  public HandleHttpRequest = (
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

  static getsocket() {
    if (!this.Instance) {
      this.Instance = new WebsocketManager();
    }
    return this.Instance;
  }

  public initlisteners() {
    const wss = this.wss;
    wss.on("connection", (ws, req) => {
      console.log("Connection event fired");
      const url = new URL(req.url!, `http://${req.headers.host}`);
      const room = url.searchParams.get("room");
      if (!room) {
        ws.close();
        return;
      }
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
}
