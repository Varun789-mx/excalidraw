"use client";
import { ISOCKETTYPE, Shape } from "@/lib/General/Types";
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
  const username = useShapeStore((state) => state.username);
  const SocketRef = useRef<WebSocket | null>(null);
  const SetShape = useShapeStore((state) => state.setShape);
  const sendMessage: ISOCKETTYPE["sendMessage"] = useCallback((msg: string) => {
    if (SocketRef && SocketRef.current?.readyState === 1) {
      SocketRef.current.send(msg);
    }
  }, []);
  const RcdMessage = useCallback(
    (msg: { content: Shape }) => {
      const ShapeData = msg.content as Shape;
      SetShape(ShapeData);
    },
    [SetShape],
  );
  const ConnectSocket = (roomId: string, username: string) => {
    if (!roomId || !username) {
      SocketRef.current?.close();
    }
    if (
      (SocketRef.current &&
        SocketRef.current.readyState === WebSocket.CONNECTING) ||
      (SocketRef.current && SocketRef.current.readyState === WebSocket.OPEN)
    )
      return;
    let ws_url =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    if (ws_url.startsWith("https://"))
      ws_url = ws_url.replace(/^https:\/\//, "wss://");
    else if (ws_url.startsWith("http://"))
      ws_url = ws_url.replace(/^http:\/\//, "ws://");

    SocketRef.current = new WebSocket(`${ws_url}`);
    SocketRef.current.onopen = () => {
      if (roomId && username) {
        const InitialMessage = {
          type: "join",
          room: roomId,
          message: "Hello guys from frontend",
        };
        SocketRef.current?.send(JSON.stringify(InitialMessage));
      }
    };
    SocketRef.current.onmessage = function (event) {
      const message = JSON.parse(event.data);
      RcdMessage(message);
    };
    SocketRef.current.onclose = () => {
      console.log("web socket closed");
      console.log("Trying to reconnect attempt");
      setTimeout(ConnectSocket, 3000);
    };
  };

  useEffect(() => {
    ConnectSocket(roomId, username);
    if (!SocketRef.current) return;

    SocketRef.current.onmessage = function (event) {
      const message = JSON.parse(event.data);
      if (message.type !== "message" && !message.content) return;
      RcdMessage(message);
    };
    SocketRef.current.onclose = () => {
      console.log("web socket closed");
    };

    return () => {
      SocketRef.current?.close();
    };
  }, [roomId, RcdMessage]);
  return (
    <SocketContext.Provider value={{ sendMessage, RcdMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
