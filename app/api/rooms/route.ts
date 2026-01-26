import { GetSocket } from "@/lib/websocket/websocketHook";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { roomId, userId, message } = await req.json();
    if (!roomId || !userId || !message) return;
    const wss = GetSocket();
    return NextResponse.json({
        message: roomId,
        url: `ws://localhost:5000/?room=`
    })
} 