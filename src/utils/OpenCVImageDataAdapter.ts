import * as OpenCV from '@u4/opencv4nodejs';

class OpenCVImageDataAdapter implements ImageDataAdapter {
    protected readonly openCV: typeof OpenCV;

    constructor(openCV: typeof OpenCV) {
        this.openCV = openCV;
    }

    convertOriginalDataToImageMatrix(originalData): ImageMatrix {
        const { dims: dimensions, step: steps, elemSize: elementSize, cols: columns, ...rest } = originalData;
        return {
            dimensions,
            steps,
            elementSize,
            columns,
            ...rest,
            data: originalData.getData()
        }
    }

    convertImageMatrixToOriginalData(imageMatrix: ImageMatrix) {
        const { columns: cols, rows, type, data } = imageMatrix;
        const originalData = new OpenCV.Mat(data, rows, cols, type)
        return originalData;
    }

    convertImageMatrixToUInt8ClampedArray(imageMatrix: ImageMatrix): Uint8ClampedArray {
        const openCVImage = this.convertImageMatrixToOriginalData(imageMatrix);
        const encodedImage = this.openCV.imencode('.jpg', openCVImage);
        console.log(encodedImage)
        return new Uint8ClampedArray(encodedImage);
    }

    encodeImageMatrixToBuffer(imageMatrix: ImageMatrix, { fileExtension, flags }: EncodeImageMatrixToBufferParams): Buffer {
        const originalData = this.convertImageMatrixToOriginalData(imageMatrix);
        console.log(fileExtension)
        return this.openCV.imencode(fileExtension, originalData, flags || [])
    }

}

module.exports = OpenCVImageDataAdapter;