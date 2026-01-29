import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,

  Plus,
  LogOut,
  ChevronFirst,
  ChevronLast,
  Dot,
  Ellipsis,
  Delete,
  Trash2,
} from "lucide-react";

export default function SideChatBar({
  SideBar,
  setSideBar,
}: {
  SideBar: boolean;
  setSideBar: Dispatch<SetStateAction<boolean>>;
}) {
  const Theme = true;
  const [ShowDelete, setShowDelete] = useState(false);
 
  const [ShowChats, setShowChats] = useState(true);
  const [isFooterOpen, setisFooterOpen] = useState(true);
  return (
    <aside
      className={`h-screen border-r border-gray-800 ${
        SideBar ? "w-full md:w-60" : "w-0"
      } `}
    >
      <nav
        className={`h-full flex flex-col overflow-hidden border-gray-800 shadow-sm  ${
          SideBar ? "w-full md:w-60" : "w-0"
        } `}
      >
        <div className={`p-4 border-b border-gray-800  `}>
          <div className="flex items-center justify-between mb-4">

            <button
              onClick={() => setSideBar(!SideBar)}
              className=" p-2 hover:bg-gray-700  text-white rounded-lg"
            >
              {SideBar ? (
                <ChevronFirst className="w-5 h-5" />
              ) : (
                <ChevronLast className="w-5 h-5" />
              )}
            </button>
          </div>
         
          
        </div>
        <div className={`flex-1 overflow-hidden p-2  duration-200 w-full`}>
          <button
            className="w-full text-gray-500 flex justify-start"
            onClick={() => {
              setShowChats(!ShowChats);
            }}
          >
            Chats {ShowChats ? <ChevronDown /> : <ChevronRight />}
          </button>
          <div
            className={`w-60 h-[80%] border border-gray-800 p-2 overflow-y-auto flex-1 space-y-2 pr-2 ${
              Theme ? "bg-[#181818]" : "bg-white"
            } `}
          >
                    <div className="flex p-1 overflow-y-auto cursor-pointer justify-between items-center hover:bg-gray-700 rounded-lg ">
                  
                      <div className="flex items-center gap-5">
           
        <footer className={`overflow-hidden transition-all w-full`}>
        </footer>
      </nav>
    </aside>
  );
}