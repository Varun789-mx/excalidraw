"use client"
import { SideBar } from "@/components/Sidebar";
import Canvas from "./Canvas/canvas";

export default function Home() {

  return (
    <div className="relative w-screen h-screen">

      <Canvas />
      <div className="absolute inset-0 z-10 pointer-events-none">
        <SideBar />
      </div>
    </div>
  );
}
