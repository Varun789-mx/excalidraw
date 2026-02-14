import { useShapeStore } from "@/app/context/useShapeStore";
import { Link, Menu, User } from "lucide-react";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";

export const SideBar = () => {
  const [show, setShow] = useState(false);
  const setRoomId = useShapeStore((state) => state.setroom);
  const roomId = useShapeStore((state) => state.roomId);
  const [loading, setloading] = useState(false);
  const [connected, setconnected] = useState(false);
  const [formData, setformData] = useState({
    roomId: "",
    username: "",
  });
  const setusername = useShapeStore((state) => state.setUserName);
  const HandleForm = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setloading(true);
    const { name, value } = e.target;
    setformData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };

  const HandleJoin = async () => {
    setloading(true);
    try {
      if (!formData.username || !formData.roomId) {
        toast.error("Invalid inputs");
        return;
      }
      setRoomId(formData.roomId);
      setusername(formData.username);
      setconnected(true);
      setloading(false);
    } catch (error) {
      toast.error(`Error in establishing connection ${error}`);
      setloading(false);
      setconnected(false);
    }
  };

  return (
    <div
      className="absolute w-80 h-screen overflow-hidden pl-3 p-3 gap-3"
      style={{ pointerEvents: "none" }}
    >
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
              <h1 className="text-gray-200 text-xs">
                {connected ? "Connected" : "Disconnected"}
              </h1>
              <label className="text-gray-400 text-xs">Username</label>
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-3 py-2">
                <User size={16} />
                <input
                  name="username"
                  value={formData.username}
                  onChange={HandleForm}
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
                  onChange={HandleForm}
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              <div className="w-full flex p-2 justify-center">
                <button
                  onClick={() => {setShow(!show);
                     HandleJoin()}}
                  className="p-2 w-full flex justify-center rounded-lg text-sm font-bold bg-blue-500 focus:bg-blue-600"
                >
                  Create/Join Room
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
