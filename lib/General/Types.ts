export enum FileType {
    file = "file",
    folder = "folder",
}
export interface FileNode {
    name: string;
    type: FileType.file;
    content: string;
}
export interface FolderNode {
    name: string;
    type: FileType.folder;
    items: FileStructureType[];
}
export type FileStructureType = FolderNode | FileNode;

export interface CodeChangeType {
    type: 'insert' | 'delete' | 'replace';
    content: string;
    position: number;
    length?: number;
}

export enum ShapeProp {
    circle = "Circle",
    rectangle = "Rectangle",
    line = "Line",
    FreeHandLine = 'freeHandline',
    ellipse = "Ellipse",
    eraser = "Eraser",
}

export interface ShapeStoreprop {
    roomId: string,
    Shapes: Shape[],
    username: string,

    setroom: (id: string) => void;
    setShape: (shapeObj: Shape) => void;
    setUserName: (username: string) => void;
    DeleteShape: (filter: (shape: Shape) => boolean) => void;
}

export interface ISOCKETTYPE {
    sendMessage: (msg: string) => void;
    RcdMessage: (msg: { message: string }) => void;
}
export type Shape = |
{
    type: ShapeProp.rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    owner?: string,
    radius?: number
} | {
    type: ShapeProp.circle;
    x: number;
    y: number;
    owner?: string,
    radius: number;
} | {
    type: ShapeProp.FreeHandLine;
    points: { x: number; y: number }[];
    owner?: string,
} | {
    type: ShapeProp.line;
    x: number;
    y: number;
    endX: number;
    endY: number;
    owner?: string,
} | {
    type: ShapeProp.eraser,
    x: number,
    y: number,
    owner?: string,
}

