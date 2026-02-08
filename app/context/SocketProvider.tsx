  "use client";
  import { ISOCKETTYPE } from "@/lib/General/Types";
  import React, {
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
  } from "react";
  import { useShapeStore } from "./useShapeStore";

  export const SocketContext = React.createContext<ISOCKETTYPE | null>(null);

  export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) throw new Error("Socket is not available ");
    return state;
  };
  export const SocketProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const roomId = useShapeStore((state) => state.roomId);
    const SocketRef = useRef<WebSocket | null>(null);
    const SetShape = useShapeStore((state) => state.setShape);
    const sendMessage: ISOCKETTYPE["sendMessage"] = useCallback((msg: string) => {
      if (SocketRef && SocketRef.current?.readyState === 1) {
        console.log(msg, "send message")
        SocketRef.current.send(msg);
      }
    }, []);
    const RcdMessage = useCallback(
      (msg: { message: string }) => {
        const ShapeData = JSON.parse(msg.message);
        console.log("Msg rcd", ShapeData);
        SetShape(ShapeData);
      },
      [SetShape],
    );
    useEffect(() => {
      if (!roomId) return;

      SocketRef.current?.close();

      // Resolve backend URL (env or fallback to current origin) and normalize to ws/wss
      let ws_url = process.env.NEXT_PUBLIC_BACKEND_URL ||
        (typeof window !== "undefined" ? window.location.origin : "");
      if (ws_url.startsWith("https://")) ws_url = ws_url.replace(/^https:\/\//, "wss://");
      else if (ws_url.startsWith("http://")) ws_url = ws_url.replace(/^http:\/\//, "ws://");

    
      SocketRef.current = new WebSocket(`wss://${process.env.NEXT_PUBLIC_BACKEND_URL}/?room=${roomId}`);
      SocketRef.current.onopen = () => {
        console.log("Web socket connected");
      };
      SocketRef.current.onmessage = function (event) {
        const message = JSON.parse(event.data);
        RcdMessage(message);
      };
      SocketRef.current.onclose = () => {
        console.log("web socket closed");
      };

      return () => {
        SocketRef.current?.close();
      };
    }, [roomId]);
    return (
      <SocketContext.Provider value={{ sendMessage, RcdMessage }}>
        {children}
      </SocketContext.Provider>
    );
  };
