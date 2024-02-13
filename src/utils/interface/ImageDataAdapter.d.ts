declare interface ImageDataAdapter {
    convertOriginalDataToImageMatrix(originalData: T): ImageMatrix;
    convertImageMatrixToOriginalData(imageMatrix: ImageMatrix): T;
    convertImageMatrixToUInt8ClampedArray(originalData: ImageMatrix): Uint8ClampedArray;
    encodeImageMatrixToBuffer(imageMatrix: ImageMatrix, params: EncodeImageMatrixToBufferParams): Buffer
    convertContourToOriginalData(contour: Contour): T;
    convertOriginalDataToContour(originalData: T): Contour;
}

declare interface EncodeImageMatrixToBufferParams {
    fileExtension: string;
    flags?: number[];
}