import { Shape, ShapeProp } from "../../lib/General/Types";

const hitRect = (rect: { x: number, y: number, width: number, height: number }, points: { x: number, y: number }, radius: number) => {
    // Handle negative dimensions by normalizing
    const x1 = Math.min(rect.x, rect.x + rect.width);
    const x2 = Math.max(rect.x, rect.x + rect.width);
    const y1 = Math.min(rect.y, rect.y + rect.height);
    const y2 = Math.max(rect.y, rect.y + rect.height);
    
    return (
        points.x >= x1 - radius &&
        points.x <= x2 + radius &&
        points.y >= y1 - radius &&
        points.y <= y2 + radius
    )
}

const hitCircle = (circle: { x: number, y: number, radius: number }, points: { x: number, y: number }, radius: number) => {
    const dx = points.x - circle.x;
    const dy = points.y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const circleRadius = Math.abs(circle.radius);
    return distance <= circleRadius + radius;
}

const hitFreeHandline = (line: { x: number, y: number }[], point: { x: number, y: number }, radius: number) => {
    return line.some(p => {
        const dx = p.x - point.x;
        const dy = p.y - point.y;
        return Math.sqrt(dx * dx + dy * dy) <= radius;
    })
}
const hitLine = (line: { x: number, y: number, endX: number, endY: number }, points: { x: number, y: number }, radius: number) => {
    const numPoints = 50;
    
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = line.x + t * (line.endX - line.x);
        const y = line.y + t * (line.endY - line.y);
        
        const dx = points.x - x;
        const dy = points.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= radius) {
            return true;
        }
    }
    return false;
}
export const isShapeHit = (
    shapes: Shape,
    startX: number,
    startY: number,
) => {
    const ERASER_RADIUS = 15;
    switch (shapes.type) {
        case ShapeProp.rectangle:
            return hitRect(shapes, { x: startX, y: startY }, ERASER_RADIUS);
        case ShapeProp.circle:
            return hitCircle(shapes, { x: startX, y: startY }, ERASER_RADIUS);
        case ShapeProp.FreeHandLine:
            return hitFreeHandline(shapes.points, { x: startX, y: startY }, ERASER_RADIUS);
        case ShapeProp.line:
            return hitLine({ x: shapes.x, y: shapes.y, endX: shapes.endX, endY: shapes.endY }, { x: startX, y: startY }, ERASER_RADIUS);
        case ShapeProp.eraser:
            return false;
        default:
            return false;
    }
}
