"use client"
import React, { useEffect, useRef, useState } from "react";
import { Circle, Eraser, Minus, Pen, Square, X } from "lucide-react";
import { Shape, ShapeProp } from "../../lib/General/Types";
import { isShapeHit } from "./Eraser";
import { CanvasDrawer } from "@/lib/CanvasHelpers/CanvasClass";
import { useSocket } from "../context/SocketProvider";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef({ x: 0, y: 0 });
  const [isDrawing, setDrawing] = useState(false);
  const drawerRef = useRef<CanvasDrawer | null>(null);
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
  const [CurrentShapes, setCurrentShapes] = useState<Shape[]>([]);
  const [Camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const currentPathRef = useRef<{ x: number, y: number }[]>([]);
  const EraseRef = useRef<{ x: number, y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (canvasRef.current && !drawerRef.current) {
      drawerRef.current = new CanvasDrawer(canvasRef.current);
    }
  }, []);


  function HandleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    console.log(SelectedShape,"From selected shape");
    isDrawingRef.current = true;
    setDrawing(true);
    startRef.current = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };

    if (SelectedShape === ShapeProp.line) {
      currentPathRef.current = [{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }];
    }
    if (SelectedShape === ShapeProp.eraser) {
      EraseRef.current = ({
        x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY
      })
      shape.current = {type:ShapeProp.eraser } as Shape
       console.log(EraseRef.current);
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
        Redraw(CurrentShapes, shape.current, true);
        return;
      }
    }
  }
  function ScrollToWorld(screenX: number, screenY: number) {
    const worldX = (screenX - Camera.x) / Camera.zoom;
    const worldY = (screenY - Camera.y) / Camera.zoom;
  }
  function HandleMouseUp(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawingRef.current = false;
    setDrawing(false);
    let finalShape: Shape;

    if(SelectedShape === ShapeProp.eraser) { 
      return;
    }
    if (shape.current.type === ShapeProp.FreeHandLine) {
      finalShape = {
        type: ShapeProp.FreeHandLine,
        points: [...shape.current.points]
      }
    } else {
      finalShape = { ...shape.current };
    }
    setCurrentShapes((prev) => [...prev, finalShape]);
    currentPathRef.current = [];
  }
  useEffect(() => {
    const getlocalShapes = localStorage.getItem("shapes");

    if(!getlocalShapes) { 
      localStorage.setItem("Shapes",JSON.stringify(CurrentShapes))
    }
    Redraw(CurrentShapes, null, false)
  }, [CurrentShapes])


  const Redraw = (currentShape: Shape[], shape: Shape | null, drawing: boolean) => {
    const drawer = drawerRef.current;
  if(shape) socket.sendMessage(shape.toString());
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
    }
    )

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

  const HandleDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!isDrawingRef.current) return;
    switch (shape.current.type) {
      case ShapeProp.rectangle:
        shape.current = ({
          type: ShapeProp.rectangle,
          x: startRef.current.x,
          y: startRef.current.y,
          width: e.nativeEvent.offsetX - startRef.current.x,
          height: e.nativeEvent.offsetY - startRef.current.y,
        });
        break;
      case ShapeProp.circle:
        shape.current = {
          type: ShapeProp.circle,
          x: startRef.current.x,
          y: startRef.current.y,
          radius: Math.hypot(startRef.current.x - e.nativeEvent.offsetX, startRef.current.y - e.nativeEvent.offsetY)
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
      case ShapeProp.FreeHandLine:
        shape.current.points.push({
          x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY
        })
        break;
      case ShapeProp.eraser:
        EraseRef.current = {
          x:e.nativeEvent.offsetX,
          y:e.nativeEvent.offsetY,
        }
       setCurrentShapes(prev=> 
        prev.filter(shape=> !isShapeHit(shape,EraseRef.current.x,EraseRef.current.y))
       )
       return;
    }

    Redraw(CurrentShapes, shape.current, isDrawingRef.current);
  };


  return (
    <div className="overflow-hidden inset-0 fixed">
      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={HandleMouseDown}
        onMouseUp={HandleMouseUp}
        onMouseMove={HandleDrawing}
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