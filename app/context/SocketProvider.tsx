"use client"
import { ISOCKETTYPE } from "@/lib/General/Types";
import React, { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"
import { useShapeStore } from "./useShapeStore";

export const SocketContext = React.createContext<ISOCKETTYPE | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error("Socket is not available ");
    return state;
}
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const roomId = useShapeStore((state) => state.roomId);
    const SocketRef = useRef<WebSocket | null>(null);
    const SetShape = useShapeStore((state) => state.setShape);
    const sendMessage = useCallback((msg: string) => {
        if (SocketRef && SocketRef.current?.readyState === 1) {
            SocketRef.current.send(msg);
        }
    }, [])
    const RcdMessage = useCallback((msg: { message: string }) => {
        const ShapeData = JSON.parse(msg.message);
        SetShape(ShapeData);
    }, [])
    useEffect(() => {
        const room = roomId;
        if (!SocketRef.current) {
            SocketRef.current = new WebSocket(`ws://192.168.1.22:5000?room=${room}`);
        }
        SocketRef.current.onopen = () => {
            console.log('Web socket connected');
        }
        SocketRef.current.onmessage = function (event) {
            const message = JSON.parse(event.data);
            RcdMessage(message);
        }
    }, [])
    return (
        <SocketContext.Provider value={{ sendMessage, RcdMessage }}>{children}</SocketContext.Provider>
    )
}