declare interface ImageProcessor {
    loadImageFromSource(src: string): ImageMatrix;
    convertToGrayscale(currentImage: ImageMatrix): ImageMatrix;
    applyBinaryThreshold(currentImage: ImageMatrix, params: BinaryThresholdParameters): ImageMatrix;
    getRegionOfInterest(currentImage: ImageMatrix, rectangle: Rectangle): ImageMatrix;
    getRectanglesAngularOrientation(currentImage: ImageMatrix): number[];
    getImageCenterPoint(currentImage: ImageMatrix): Point2D;
    rotateImageByDegrees(currentImage: ImageMatrix, params: RotateImageParameters): ImageMatrix;
}