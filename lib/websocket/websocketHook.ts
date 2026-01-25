import { Websocket } from "./server";

let wss: Websocket | null;

export function GetSocket() {
    if (!wss) {
        wss = new Websocket();
        wss.initlisteners();
        wss.listen(5000);
    }
    return wss;
}
