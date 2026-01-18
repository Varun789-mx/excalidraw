import { Shape, ShapeProp } from "../lib/Types";

const hitRect = (rect: { x: number, y: number, width: number, height: number }, points: { x: number, y: number }, radius: number) => {
    return (
        points.x >= rect.x - radius &&
        points.x <= rect.x + rect.width + radius &&
        points.y >= rect.y - radius &&
        points.y <= rect.y + rect.height + radius
    )
}

const hitCircle = (circle: { x: number, y: number, radius: number }, points: { x: number, y: number }, radius: number) => {
    const dx = points.x - circle.x;
    const dy = points.y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= circle.radius + radius;
}
export const isShapeHit = (
    startX: number,
    startY: number,
    shapes: Shape,
) => {
    const ERASER_RADIUS = 10;
    switch (shapes.type) {
        case ShapeProp.rectangle:
            return hitRect(shapes, { x: startX, y: startY }, ERASER_RADIUS);
            break;
        case ShapeProp.circle:
            return hitCircle(shapes, { x: startX, y: startY }, ERASER_RADIUS);
    }
}
