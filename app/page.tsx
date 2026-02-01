"use client"
import { SideBar } from "@/components/Sidebar";
import Canvas from "./Canvas/canvas";
import { useEffect } from "react";

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
    <div className="relative w-screen h-screen">

      <Canvas />


      <div className="absolute inset-0 z-10 pointer-events-none">
        <SideBar />
      </div>
    </div>
  );
}
