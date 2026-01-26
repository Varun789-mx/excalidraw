"use client"
import Canvas from "./Canvas/canvas";
import {  useEffect } from "react";

export default function Home() {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/rooms`, {
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
    }
    catch (error) {
      console.log(`Error in fetching`)
    }
  }
  useEffect(() => {
    fetchData();
  }, []);


  return (
    <div>
      <Canvas />
    </div>
  );
}
