declare interface ImageProcessor {
    loadImageFromSource(src: string): ImageMatrix;
    convertToGrayscale(currentImage: ImageMatrix): ImageMatrix;
    applyThreshold(currentImage: ImageMatrix, params: BinaryThresholdParameters): ImageMatrix;
    getRegionOfInterest(currentImage: ImageMatrix, rectangle: Rectangle): ImageMatrix;
    getCountoursAngularOrientation(contours: Contour[]): number[];
    getImageCenterPoint(currentImage: ImageMatrix): Point2D;
    getImageContours(currentImage: ImageMatrix): Contour[];
    rotateImageByDegrees(currentImage: ImageMatrix, params: RotateImageParameters): ImageMatrix;
}

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