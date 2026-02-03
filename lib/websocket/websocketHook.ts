import { WebsocketManager } from "./server";

let wss: WebsocketManager | null;
let PORT =  5000;
export function GetSocket() {

    if (!wss) {
        console.log(`Initializing websocket server`);

        wss = WebsocketManager.getsocket();
        wss.initlisteners();
        wss.listen(Number(PORT));
    }
    return wss;
}

