import { useShapeStore } from "@/app/context/useShapeStore";
import { Link, Menu, User } from "lucide-react";
import { useState } from "react"

export const SideBar = () => {
  const [show, setShow] = useState(false);
  const setRoomId = useShapeStore((state) => state.setroom);
  const setusername = useShapeStore((state) => state.setUserName);

  return (
    <div className="absolute w-80 h-screen overflow-hidden pl-3 p-3 gap-3" style={{ pointerEvents: "none" }}>
      <button
        className={`p-1 bg-gray-700 rounded-xl ${show ? "bg-gray-800" : ""} cursor-pointer`}
        style={{ pointerEvents: "auto" }}
        onClick={() => setShow(!show)}
      >
        <Menu size={20} />
      </button>

      {show && (
        <aside className="w-full h-3/4 flex" style={{ pointerEvents: "auto" }}>
          <div className="flex w-full flex-col p-3 bg-gray-800 rounded-2xl">
            <div className="p-2">
              <label className="text-gray-400 text-xs">Username</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <User size={16} />
                <input
                  onChange={(e) => setusername(e.target.value)}
                  placeholder="Your name"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <label className="text-gray-400 text-xs">Room ID</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <Link size={16} />
                <input
                  placeholder="abc123"
                  onChange={(e) => setRoomId(e.target.value)}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <div className="w-full flex p-2 justify-center">
                <button className="p-2 w-full flex justify-center rounded-lg text-sm font-bold bg-blue-500 focus:bg-blue-600">
                  Create/Join Room
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}