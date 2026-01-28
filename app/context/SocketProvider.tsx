"use client"
import { ISOCKETTYPE, Shape } from "@/lib/General/Types";
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
    const [ServerMsg, setServerMsg] = useState("");
    const sendMessage = useCallback((msg: string) => {
        if (SocketRef && SocketRef.current?.readyState === 1) {
            SocketRef.current.send(msg);
        }
    }, [])
    const RcdMessage = useCallback((msg:string)=> { 
        const message = JSON.parse(msg);
        
        console.log(message,"From rcd");

    },[])
    useEffect(() => {
        const room = roomId;
        if (!SocketRef.current) {
            SocketRef.current = new WebSocket(`ws://localhost:5000?room=${room}`);
        }
        SocketRef.current.onopen = () => {
            console.log('Web socket connected');
        }
        SocketRef.current.onmessage = function (event) {
           RcdMessage(event.data);
        }
    }, [])
    return (
        <SocketContext.Provider value={{ sendMessage ,RcdMessage}}>{children}</SocketContext.Provider>
    )
}