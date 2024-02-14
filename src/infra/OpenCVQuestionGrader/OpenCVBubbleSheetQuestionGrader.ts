import * as OpenCV from '@u4/opencv4nodejs';
import OpenCVBaseQuestionGrader from './OpenCVBaseQuestionGrader';

export default class OpenCVBubbleSheetQuestionGrader extends OpenCVBaseQuestionGrader {
    constructor(openCV: typeof OpenCV, imageDataAdapter: ImageDataAdapter) {
        super(openCV, imageDataAdapter)
    }

    checkIfIsValidQuestion(contour: Contour): boolean {
        const openCVContour = this.imageDataAdapter.convertContourToOriginalData(contour);
        const { width, height } = openCVContour.boundingRect();
        const aspectRatio = width / height;

        if (width <= 30 || height <= 30 || aspectRatio < 1 - this.aspectRatioTolerance || aspectRatio > 1 + this.aspectRatioTolerance) {
            return false
        };

        return true;
    }

    // Area of the Circle considering its less significant dimension
    getQuestionTotalAreaFromContour(contour: Contour): number {
        const openCVContour = this.imageDataAdapter.convertContourToOriginalData(contour);
        const { width, height } = openCVContour.boundingRect();
        return Math.PI * (Math.min(width, height) / 2) * (Math.min(width, height) / 2);
    }
}
