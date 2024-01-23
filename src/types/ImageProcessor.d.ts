declare interface BinaryThresholdParameters {
    thresholdNumber: number;
    maximumValue: number;
    type: number;
}

declare interface RotateImageParameters {
    centerPoint: Point2D,
    angle: number
}

declare interface GetRegionOfInterestParams {
    rectangle: Rectangle;
}