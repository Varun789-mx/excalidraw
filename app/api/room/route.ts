import { GetSocket } from "@/lib/websocket/websocketHook";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { roomId, userId, message } = await req.json();
        if (!roomId || !userId || !message) {
            return NextResponse.json({
                error: "room id or userid is required",
            }, { status: 400 })
        }
        const wss = GetSocket();
        return NextResponse.json({
            success: true,
            message: roomId,
            wsurl: `ws://localhost:5000/?room=${roomId}`
        })
    } catch (error) {
        console.log(`error in api route`, error);
        return NextResponse.json({
            error: "Failed to create room"
        }, { status: 500 })
    }
} 