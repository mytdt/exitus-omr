import * as OpenCV from '@u4/opencv4nodejs';

class OpenCVImageProcessorAdapter implements ImageProcessorAdapter {
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
        const { columns: cols, rows, type, data, ...rest } = imageMatrix;
        const originalData = new OpenCV.Mat(data, rows, cols, type)
        return originalData;
    }
}

module.exports = OpenCVImageProcessorAdapter;