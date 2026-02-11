import { useShapeStore } from "@/app/context/useShapeStore";
import { Link, Menu, User } from "lucide-react";
import { ChangeEvent, useState } from "react"
import toast from "react-hot-toast";

export const SideBar = () => {
  const [show, setShow] = useState(false);
  const setRoomId = useShapeStore((state) => state.setroom);
  const roomId = useShapeStore((state) => state.roomId);
  const [loading, setloading] = useState(false);
  const [formData, setformData] = useState({
    roomId: "",
    username: ""
  })
  const setusername = useShapeStore((state) => state.setUserName);


  const HandleJoin = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setloading(true);
    const { name, value } = e.target;
    setformData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }))

    try {
      if (!formData.username || !formData.roomId) {
        toast.error("Invalid inputs");
        return;
      }
      const MessageObj = {
        type: "join",
        room: "ninja",
        message: "trying to connect from the frontend",
      }
      setRoomId(formData.roomId);
      setusername(formData.username);
        let ws_url = process.env.NEXT_PUBLIC_BACKEND_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");
    if (ws_url.startsWith("https://")) ws_url = ws_url.replace(/^https:\/\//, "wss://");
    else if (ws_url.startsWith("http://")) ws_url = ws_url.replace(/^http:\/\//, "ws://");

      const connection = new WebSocket(`${ws_url}`)
      connection.onopen = ()=> {
        const msgstr = JSON.stringify(MessageObj);
        connection.send(msgstr);
    }
      connection.onmessage = function (event) {
        console.log("Event Data", event.data);
      }
      setloading(false);
    } catch (error) {
      toast.error(`Error in establishing connection ${error}`);
      setloading(false);
    }


  }

  return (
    <div className="absolute w-80 h-screen overflow-hidden pl-3 p-3 gap-3" style={{ pointerEvents: "none" }}>
      <button
        className={`p-1 bg-gray-700 rounded-xl ${show ? "" : "bg-gray-800"} cursor-pointer`}
        style={{ pointerEvents: "auto" }}
        onClick={() => setShow(!show)}
      >
        <Menu size={20} />
      </button>

      {show && (
        <aside className="w-full h-3/4 flex" style={{ pointerEvents: "auto" }}>

          <div className="flex w-full flex-col p-3 bg-gray-800 rounded-2xl">
            <div className="p-2">
              <h1 className="text-gray-200 text-xs">Room Id: #{roomId}</h1>
              <label className="text-gray-400 text-xs">Username</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <User size={16} />
                <input
                  name="username"
                  value={formData.username}
                  onChange={HandleJoin}
                  placeholder="Your name"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <label className="text-gray-400 text-xs">Room ID</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <Link size={16} />
                <input
                  name="roomId"
                  value={formData.roomId}
                  placeholder="abc123"
                  onChange={HandleJoin}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <div className="w-full flex p-2 justify-center">
                <button
                  onClick={() => setShow(!show)} className="p-2 w-full flex justify-center rounded-lg text-sm font-bold bg-blue-500 focus:bg-blue-600">
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