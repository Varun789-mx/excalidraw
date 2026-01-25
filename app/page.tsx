"use client"
import Canvas from "./Canvas/canvas";
import { useCallback, useEffect } from "react";

export default function Home() {
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(`https://localhost:3000/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roomId: "113",
        userId: "14511",
        message: "ninja hattori"
      })
    })
    const answer = await response.json();
    console.log(answer);
  };
  fetchData();
}, []);
  return (
    <div>
      <Canvas />
    </div>
  );
}
