declare interface ImageProcessor {
    loadImageFromSource(src: string): ImageMatrix;
    createMaskFromImage(currentImage: ImageMatrix, fillValue?: number | number[]): ImageMatrix;
    convertToGrayscale(currentImage: ImageMatrix): ImageMatrix;
    applyThreshold(currentImage: ImageMatrix, params: ThresholdParameters): ImageMatrix;
    applyGaussianBlur(currentImage: ImageMatrix, options?: {}): ImageMatrix;
    applyBitwiseNot(currentImage: ImageMatrix): ImageMatrix
    applyBitwiseAnd(currentImage: ImageMatrix, mask: ImageMatrix): ImageMatrix
    getRegionOfInterest(currentImage: ImageMatrix, rectangle: Rectangle): ImageMatrix;
    getCountoursAngularOrientation(contours: Contour[]): number[];
    getImageCenterPoint(currentImage: ImageMatrix): Point2D;
    getImageContours(currentImage: ImageMatrix, params?: ImageContourAlgorithmParameters): Contour[];
    getNonZeroPixelsinImage(currentImage: ImageMatrix): number
    getBoundingRectangleOfContour(contour: Contour): Rectangle;
    rotateImageByDegrees(currentImage: ImageMatrix, params: RotateImageParameters): ImageMatrix;
    drawContoursInImage(currentImage: ImageMatrix, contours: Contour[]): ImageMatrix
}

declare interface ThresholdParameters {
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

declare interface ImageContourAlgorithmParameters {
    mode: number;
    method: number;
    offset?: Point2D;
}