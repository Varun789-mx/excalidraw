import { WebsocketManager } from "./server";

let wss: WebsocketManager | null;

export function GetSocket() {
    if (!wss) {
        console.log(`Initializing websocket server`);

        wss = WebsocketManager.getsocket();
        wss.initlisteners();
        wss.listen(5000);
    }
    return wss;
}

