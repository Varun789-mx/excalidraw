import { Link, Menu, User } from "lucide-react";
import { useState } from "react"

export const SideBar = () => {
  const [show, setshow] = useState(false);
  const [hovered, sethovered] = useState(false);
  return (
    <div className="absolute w-80 h-screen overflow-hidden pl-3 p-3 gap-3" style={{ pointerEvents: "none" }}>
      <button className={`p-1  bg-gray-700 rounded-xl ${show ? "bg-gray-800 " : ""} cursor-pointer`}
        style={{ pointerEvents: "auto" }}
        onClick={() => setshow(!show)}><Menu /></button>
      <aside hidden={show} className="w-full h-3/4 flex " style={{
        pointerEvents: hovered ? "auto" : "none"
      }}
        onMouseEnter={() => sethovered(true)}
        onMouseLeave={() => sethovered(false)}
      >
        <div className="flex w-full flex-col p-3  bg-gray-800 rounded-2xl">
          <form className="p-2 ">
            <label className="text-gray-400 text-xs ">Username</label>
            <div className="flex  items-center  gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <User size={16} />
              <input placeholder="Your name" className="bg-transparent outline-none text-sm w-full" />
            </div>
            <label className="text-gray-400 text-xs ">Room ID</label>
            <div className="flex  items-center  gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
              <Link size={16} />
              <input placeholder="abc123" className="bg-transparent outline-none text-sm w-full" />
            </div>
          </form>
        </div>
      </aside >
    </div >
  )
} 