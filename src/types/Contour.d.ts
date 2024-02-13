declare interface Contour {
    numberOfPoints: number;
    area: number;
    isConvex: boolean;
    hierarchy: Vector4D;
    points: Point2D[];
}