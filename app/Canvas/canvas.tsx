"use client"
import React, { useEffect, useRef, useState } from "react";
import { Circle, Eraser, Minus, Pen, Square, X } from "lucide-react";
import { Shape, ShapeProp } from "../../lib/General/Types";
import { isShapeHit } from "./Eraser";
import { CanvasDrawer } from "@/lib/CanvasHelpers/CanvasClass";
import { useSocket } from "../context/SocketProvider";
import { useShapeStore } from "../context/useShapeStore";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const [isDrawing, setDrawing] = useState(false);
  const drawerRef = useRef<CanvasDrawer | null>(null);
  const UserName = useShapeStore((state) => state.username);
  const shape = useRef<Shape>({
    type: ShapeProp.rectangle,
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [SelectedShape, setSelectedShape] = useState<ShapeProp>(ShapeProp.rectangle);
  const isDrawingRef = useRef(false);
  const socket = useSocket();
  const Shapes = useShapeStore((state) => state.Shapes);
  const SetShapes = useShapeStore((state) => state.setShape);
  const DeleteShapes = useShapeStore((state) => state.DeleteShape);
  const [Camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const currentPathRef = useRef<{ x: number, y: number }[]>([]);
  const EraseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current && !drawerRef.current) {
      drawerRef.current = new CanvasDrawer(canvasRef.current);
    }
  }, []);

  useEffect(() => {
    Redraw(Shapes, null, false);
  }, [Shapes]);


  function GetCanvasCords(e: React.PointerEvent<HTMLCanvasElement>) {
    const rec = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rec.left,
      y: e.clientY - rec.top,
    }
  }

  function HandleMouseDown(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawingRef.current = true;
    setDrawing(true);
    const {x,y} = GetCanvasCords(e);
    startRef.current = { x: x, y: y };

    if (SelectedShape === ShapeProp.line) {
      currentPathRef.current = [{ x: x, y:y }];
    }
    if (SelectedShape === ShapeProp.eraser) {
      EraseRef.current = ({
        x: x, y: y
      })
      shape.current = { type: ShapeProp.eraser } as Shape
      return;
    }
    switch (SelectedShape) {
      case ShapeProp.rectangle:
        shape.current = ({
          type: ShapeProp.rectangle,
          x: startRef.current.x,
          y: startRef.current.y,
          width: 0,
          height: 0,
        });
        break;

      case ShapeProp.circle:
        shape.current = {
          type: ShapeProp.circle,
          x: startRef.current.x,
          y: startRef.current.y,
          radius: 0,
        }
        break;
      case ShapeProp.line:
        shape.current = {
          type: ShapeProp.line,
          x: startRef.current.x,
          y: startRef.current.y,
          endX: e.nativeEvent.offsetX,
          endY: e.nativeEvent.offsetY,
        }
        break;
      case ShapeProp.FreeHandLine: {
        shape.current = {
          type: ShapeProp.FreeHandLine,
          points: [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }],
        }
        Redraw(Shapes, shape.current, true);
        return;
      }
    }
  }
  function ScrollToWorld(screenX: number, screenY: number) {
    const worldX = (screenX - Camera.x) / Camera.zoom;
    const worldY = (screenY - Camera.y) / Camera.zoom;
  }
  function HandleMouseUp(e: React.PointerEvent<HTMLCanvasElement>) {
    isDrawingRef.current = false;
    setDrawing(false);
    let finalShape: Shape;

    if (SelectedShape === ShapeProp.eraser) {
      return;
    }
    if (shape.current.type === ShapeProp.FreeHandLine) {
      finalShape = {
        type: ShapeProp.FreeHandLine,
        points: [...shape.current.points]
      }
    }
    else if (shape.current.type === ShapeProp.rectangle) {
      const rect = shape.current as any;
      const x = Math.min(rect.x, rect.x + rect.width);
      const y = Math.min(rect.y, rect.y + rect.height);
      const width = Math.abs(rect.width);
      const height = Math.abs(rect.height);
      finalShape = { ...shape.current, x, y, width, height } as Shape;
    }
    else if (shape.current.type === ShapeProp.circle) {
      const circle = shape.current as any;
      finalShape = { ...shape.current, radius: Math.abs(circle.radius) } as Shape;
    }
    else if (shape.current.type === ShapeProp.line) {
      const line = shape.current as any;
      const x = line.x;
      const y = line.y;
      const endX = line.endX;
      const endY = line.endY;
      finalShape = { ...shape.current, x, y, endX, endY } as Shape;
    }
    else {
      finalShape = { ...shape.current };
    }
    finalShape.owner = UserName;
    console.log(UserName, "From username");
    SetShapes(finalShape);
    socket.sendMessage(JSON.stringify(finalShape));
    currentPathRef.current = [];
  }

  const Redraw = (currentShape: Shape[], shape: Shape | null, drawing: boolean) => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    drawer.clear();
    currentShape.forEach((s) => {
      switch (s.type) {
        case ShapeProp.rectangle:
          drawer.CreateRectangle(
            s.x,
            s.y,
            s.width,
            s.height,
            true
          );
          break;
        case ShapeProp.circle:
          drawer.CreateCircle(s.x, s.y, s.radius);
          break;
        case ShapeProp.FreeHandLine:
          if (s.points && s.points.length > 1) {
            drawer.CreateFreehandLine(s.points, { x: 0, y: 0, zoom: 1 });
          }
          break;
        case ShapeProp.line:
          drawer.CreateLine(s.x, s.y, s.endX, s.endY);
          break;
      }
    })

    if (drawing && shape) {
      switch (shape.type) {
        case ShapeProp.rectangle:
          drawer.CreateRectangle(
            shape.x,
            shape.y,
            shape.width,
            shape.height,
            true
          );
          break;
        case ShapeProp.circle:
          drawer.CreateCircle(shape.x, shape.y, shape.radius);
          break;
        case ShapeProp.FreeHandLine:
          if (shape.points && shape.points.length > 1) {
            drawer.CreateFreehandLine(shape.points, { x: 0, y: 0, zoom: 1 });
          }
          break;
        case ShapeProp.line:
          drawer.CreateLine(shape.x, shape.y, shape.endX, shape.endY);
          break;
      }
    }
  };
  const HandleDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isDrawingRef.current) return;
    const {x,y} = GetCanvasCords(e);
    switch (shape.current.type) {
      case ShapeProp.rectangle:
        shape.current = ({
          type: ShapeProp.rectangle,
          x: startRef.current.x,
          y: startRef.current.y,
          width: x - startRef.current.x,
          height: y - startRef.current.y,
        });
        break;
      case ShapeProp.circle:
        shape.current = {
          type: ShapeProp.circle,
          x: startRef.current.x,
          y: startRef.current.y,
          radius: Math.hypot(startRef.current.x - x, startRef.current.y - y)
        }
        break;
      case ShapeProp.line:
        shape.current = {
          type: ShapeProp.line,
          x: startRef.current.x,
          y: startRef.current.y,
          endX:x,
          endY: y,
        }
        break;
      case ShapeProp.FreeHandLine:
        shape.current.points.push({
          x:x, y: y
        })
        break;
      case ShapeProp.eraser:
        EraseRef.current = {
          x: x,
          y: y,
        }
        DeleteShapes((shape) => isShapeHit(shape, x, y));
        break;

      default: false;
    }
    Redraw(Shapes, shape.current, isDrawingRef.current);
  };
  return (
    <div className=" overflow-hidden flex-1 inset-0  touch-none">
      <canvas
        ref={canvasRef}
        id="canvas"
        onPointerDown={HandleMouseDown}
        onPointerUp={HandleMouseUp}
        onPointerMove={HandleDrawing}
        className={`bg-gray-900  w-screen h-screen ${isDrawing ? "cursor-crosshair" : "cursor-default"} `}
      />
      <div className="absolute top-4 left-1/2 -translate-x-1/2  bg-blend-saturation border border-gray-700 rounded-2xl">
        <div className="flex gap-4  rounded-lg shadow-lg p-2">
          <button onClick={() => setSelectedShape(ShapeProp.rectangle)} className={` p-2 ${SelectedShape === ShapeProp.rectangle ? "bg-blue-700 rounded-lg" : ""}`}>
            <Square />
          </button>
          <button onClick={() => setSelectedShape(ShapeProp.circle)} className={` p-2 ${SelectedShape === ShapeProp.circle ? "bg-blue-700 rounded-lg" : ""}`}>
            <Circle />
          </button>
          <button onClick={() => setSelectedShape(ShapeProp.line)} className={` p-2 ${SelectedShape === ShapeProp.line ? "bg-blue-700 rounded-lg" : ""}`}>
            <Minus />
          </button>
          <button onClick={() => setSelectedShape(ShapeProp.FreeHandLine)} className={` p-2 ${SelectedShape === ShapeProp.FreeHandLine ? "bg-blue-700 rounded-lg" : ""}`}>
            <Pen />
          </button>
          <button onClick={() => setSelectedShape(ShapeProp.eraser)} className={` p-2 ${SelectedShape === ShapeProp.eraser ? "bg-blue-700 rounded-lg" : ""}`}>
            <Eraser />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Canvas;