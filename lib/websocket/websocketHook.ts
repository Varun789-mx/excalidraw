import { WebsocketManager } from "./server";

let wss: WebsocketManager | null;
let PORT = process.env.WS_PORT || 5000;
export function GetSocket() {

    // if (!wss) {
    //     console.log(`Initializing websocket server`);
    //     console.log(PORT, "current port no ");
    //     wss = WebsocketManager.getsocket();
    //     wss.initlisteners();
    //     wss.listen(Number(PORT));
    // }
    // return wss;
}

