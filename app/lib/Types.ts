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
export type Shape = |
{
    type: ShapeProp.rectangle;
    x: number;
    y: number;
    width: number;
    height: number;
    radius?: number
} | {
    type: ShapeProp.circle;
    x: number;
    y: number;
    radius: number;
} | {
    type: ShapeProp.FreeHandLine;
    points: { x: number; y: number }[];
} | {
    type: ShapeProp.line;
    x: number;
    y: number;
    endX: number;
    endY: number;
}
