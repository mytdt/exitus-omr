import * as OpenCV from '@u4/opencv4nodejs';
import { QuestionVerdict } from '../../types/QuestionVerdict';

export default abstract class OpenCVBaseQuestionGrader implements QuestionGrader {
    protected readonly openCV: typeof OpenCV;
    protected readonly imageDataAdapter: ImageDataAdapter;
    protected readonly imageProcessor: ImageProcessor;
    protected readonly aspectRatioTolerance: number = 0.1;
    protected readonly percentMarkedAreaTolerance: number = 0.9;
    protected readonly questionMarkHeight: number = 30;
    protected readonly questionMarkWidth: number = 30;

    constructor(openCV: typeof OpenCV, imageDataAdapter: ImageDataAdapter, imageProcessor: ImageProcessor) {
        this.openCV = openCV;
        this.imageDataAdapter = imageDataAdapter;
        this.imageProcessor = imageProcessor;
    }

    gradeQuestion(currentImage: ImageMatrix, answerSheetRegion: Rectangle, correctAnswerIndex: number): GradeQuestionResult {
        const answerROI = this.imageProcessor.getRegionOfInterest(currentImage, answerSheetRegion);

        /* Image processing for proper handling contour extraction  */
        const grayscaledImage = this.imageProcessor.convertToGrayscale(answerROI);
        const invertedImage = this.imageProcessor.applyBitwiseNot(grayscaledImage);
        const blurredImage = this.imageProcessor.applyGaussianBlur(invertedImage);
        const thresholdedImage = this.imageProcessor.applyThreshold(blurredImage, { thresholdNumber: 0, maximumValue: 255, type: OpenCV.THRESH_BINARY | OpenCV.THRESH_OTSU })

        const bubbleSheetCountours = this.getValidQuestionContours(thresholdedImage);
        const sortedContours = this.sortQuestionContours(bubbleSheetCountours, true);

        const checkIfCorrectAnswerWasMarked = this.getPercentMarkedArea(thresholdedImage, sortedContours[correctAnswerIndex]) >= 0.9;

        const markedAnswers = sortedContours.filter((currentContour) => {
            const percentMarkedArea = this.getPercentMarkedArea(thresholdedImage, currentContour);
            return percentMarkedArea >= this.percentMarkedAreaTolerance;
        })

        //const markedAnswers: Contour[] = markedAnswerArrays.map((currentContour: Contour) => this.imageDataAdapter.convertOriginalDataToContour(currentContour))

        if (markedAnswers.length > 1) {
            return {
                questionVerdict: QuestionVerdict.SCRIBBLED,
                markedAnswers
            }
        }
        if (markedAnswers.length === 0) {
            return {
                questionVerdict: QuestionVerdict.UNANSWERED,
                markedAnswers
            }
        }
        return {
            questionVerdict: checkIfCorrectAnswerWasMarked ? QuestionVerdict.CORRECT : QuestionVerdict.INCORRECT,
            markedAnswers
        }

    }

    getValidQuestionContours(thresholdedAnswerSheet: ImageMatrix) {
        const contours = this.imageProcessor.getImageContours(thresholdedAnswerSheet, { mode: OpenCV.RETR_EXTERNAL, method: OpenCV.CHAIN_APPROX_SIMPLE });

        const validContours = contours.filter((currentContour: Contour) => {
            const { width, height } = this.imageProcessor.getBoundingRectangleOfContour(currentContour);

            if (width <= this.questionMarkWidth || height <= this.questionMarkHeight) {
                return false
            };

            return true;
        })

        return validContours
    }

    getPercentMarkedArea(thresholdedAnswerSheet: ImageMatrix, contour: Contour): number {
        const mask = this.imageProcessor.createMaskFromImage(thresholdedAnswerSheet, 0);

        const maskWithContours = this.imageProcessor.drawContoursInImage(mask, [contour]);

        const maskedImage = this.imageProcessor.applyBitwiseAnd(thresholdedAnswerSheet, maskWithContours);

        const totalOfMarkedPixels = this.imageProcessor.getNonZeroPixelsinImage(maskedImage);

        const markedTotalArea = this.getQuestionTotalAreaFromContour(contour);

        return totalOfMarkedPixels / markedTotalArea;
    };

    getQuestionTotalAreaFromContour(contour: Contour): number {
        const { width, height } = this.imageProcessor.getBoundingRectangleOfContour(contour)
        return width * height;
    };

    sortQuestionContours(contours: Contour[], ascending: boolean): Contour[] {
        return contours.sort((contourA, contourB) => {
            const { x: xA } = this.imageProcessor.getBoundingRectangleOfContour(contourA)
            const { x: xB } = this.imageProcessor.getBoundingRectangleOfContour(contourB)

            if (ascending) {
                return xA - xB;
            }
            return xB - xA;
        })
    }
}
