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
  const roomId = useShapeStore((state) => state.getRoom());
  const username = useShapeStore((state) => state.getUserName());
  const hasJoined = useRef(false);
  const SocketRef = useRef<WebSocket | null>(null);
  const SetShape = useShapeStore((state) => state.setShape);
  const sendMessage: ISOCKETTYPE["sendMessage"] = useCallback(
    (msg: string) => {
      if (
        SocketRef?.current?.readyState === WebSocket.OPEN &&
        hasJoined.current
      ) {
        const payload = {
          type: "message",
          content: JSON.parse(msg),
          sender: username,
        };
        SocketRef.current.send(JSON.stringify(payload));
      } else {
        console.log("Socket not ready or connection is not established");
      }
    },
    [username],
  );
  const RcdMessage = useCallback(
    (msg: { content: Shape }) => {
      const ShapeData = msg.content as Shape;
      SetShape(ShapeData);
    },
    [SetShape],
  );
  const ConnectSocket = useCallback(() => {
    if (!roomId || !username) {
      SocketRef.current?.close();
    }
    if (
      (SocketRef.current &&
        SocketRef.current.readyState === WebSocket.CONNECTING) ||
      (SocketRef.current && SocketRef.current.readyState === WebSocket.OPEN)
    ) {
      return;
    }
    let ws_url =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    if (ws_url.startsWith("https://"))
      ws_url = ws_url.replace(/^https:\/\//, "wss://");
    else if (ws_url.startsWith("http://"))
      ws_url = ws_url.replace(/^http:\/\//, "ws://");

    const socket = new WebSocket(ws_url);
    SocketRef.current = socket;
    hasJoined.current = false;
    SocketRef.current.onopen = () => {
      console.log("Current roomId: ", roomId);
      if (roomId && username) {
        const InitialMessage = {
          type: "join",
          room: roomId,
          message: "Hello guys from frontend",
        };
        console.log("InitialMessage: send", InitialMessage);
        SocketRef.current?.send(JSON.stringify(InitialMessage));
        hasJoined.current = true;
      }
    };
    SocketRef.current.onmessage = function (event) {
      const message = JSON.parse(event.data);
      if (message.type === "Error") {
        if (roomId && username) {
          const InitialMessage = {
            type: "join",
            room: roomId,
            message: "Hello guys from frontend",
          };
          SocketRef.current?.send(JSON.stringify(InitialMessage));
          console.log("Initialmessage send");
        }
      }
      RcdMessage(message);
    };
    SocketRef.current.onclose = () => {
      console.log("web socket closed");
      console.log("Trying to reconnect attempt");
      hasJoined.current = false;

      setTimeout(() => {
        ConnectSocket();
      }, 3000);
    };
  }, [roomId, username, hasJoined]);

  useEffect(() => {
    ConnectSocket();

    return () => {
      if (SocketRef.current?.readyState === WebSocket.OPEN) {
        SocketRef.current?.close();
      }
    };
  }, [roomId, username]);
  return (
    <SocketContext.Provider value={{ sendMessage, RcdMessage }}>
      {children}
    </SocketContext.Provider>
  );
};
