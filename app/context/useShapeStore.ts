import { Shape, ShapeStoreprop } from "@/lib/General/Types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useShapeStore = create<ShapeStoreprop>()(
    devtools(
        persist(
            (set, get) => ({
                roomId: "Yash",
                Shapes: [],
                username: "",

                setroom: (Id: string) => {
                    set({ roomId: Id });
                    localStorage.setItem("RoomId", Id);
                },
                setShape: (shapeObj: Shape) => {
                    set((state) => ({
                        Shapes: [...state.Shapes, shapeObj],
                    }));
                },
                setUserName: (user: string) => {
                    set({ username: user })
                },
                DeleteShape: (filter: (shape: Shape) => boolean) => {
                    set((state) => ({
                        Shapes: state.Shapes.filter((shape) => !filter(shape)),
                    }))
                },
            }),
            { name: "Shape-store" }
        )
    )
);