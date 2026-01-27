"use client"
import { ISOCKETTYPE } from "@/lib/General/Types";
import React, { ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react"

export const SocketContext = React.createContext<ISOCKETTYPE | null>(null);

export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error("Socket is not available ");
    return state;
}
export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const SockerRef = useRef<WebSocket | null>(null);
    const [ServerMsg, setServerMsg] = useState("");
    const sendMessage = useCallback((msg: string) => {
        if (SockerRef && SockerRef.current?.readyState === 1) {
            SockerRef.current.send(msg);
            console.log(msg,"from send");
        }
    }, [])
    useEffect(() => {
        const room = localStorage.getItem("roomId");
        if (!SockerRef.current) {
            SockerRef.current = new WebSocket(`ws://localhost:5000?room=${room}`);
        }
        SockerRef.current.onopen = () => {
            console.log('Web socket connected');
        }
        SockerRef.current.onmessage = function (event) {
            const { message } = event.data;
            setServerMsg(message);
            console.log(ServerMsg);
        }
    }, [])
    return (
        <SocketContext.Provider value={{ sendMessage }}>{children}</SocketContext.Provider>
    )
}