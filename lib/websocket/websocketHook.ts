import { WebsocketManager } from "./server";

let wss: WebsocketManager | null;

export function GetSocket() {
    if (!wss) {
        wss = new WebsocketManager();
        wss.initlisteners();
        wss.listen(5000);
    }
    return wss;
}

