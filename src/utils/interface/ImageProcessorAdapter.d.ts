declare interface ImageProcessorAdapter {
    convertOriginalDataToImageMatrix(originalData: T): ImageMatrix;
    convertImageMatrixToOriginalData(imageMatrix: ImageMatrix): T;
}