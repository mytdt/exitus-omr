import * as OpenCV from '@u4/opencv4nodejs';
import { QuestionVerdict } from '../../types/QuestionVerdict';

export default abstract class OpenCVBaseQuestionGrader implements QuestionGrader {
    protected readonly openCV: typeof OpenCV;
    protected readonly imageDataAdapter: ImageDataAdapter;
    protected readonly aspectRatioTolerance: number = 0.1;
    protected readonly percentMarkedAreaTolerance: number = 0.9;
    protected readonly questionMarkHeight: number = 30;
    protected readonly questionMarkWidth: number = 30;

    constructor(openCV: typeof OpenCV, imageDataAdapter: ImageDataAdapter) {
        this.openCV = openCV;
        this.imageDataAdapter = imageDataAdapter;
    }

    gradeQuestion(imageMatrix: ImageMatrix, correctAnswerIndex: number): GradeQuestionResult {
        const openCVImage = this.imageDataAdapter.convertImageMatrixToOriginalData(imageMatrix) as OpenCV.Mat;

        /* Image processing for proper handling contour extraction  */
        const grayscaledImage = openCVImage.bgrToGray();
        const invertedImage = grayscaledImage.bitwiseNot();
        const blurredImage = invertedImage.gaussianBlur(new OpenCV.Size(3, 3), 0)
        const openCVThresholdedImage = blurredImage.threshold(0, 255, OpenCV.THRESH_BINARY | OpenCV.THRESH_OTSU);

        const thresholdedImage = this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVThresholdedImage);

        const bubbleSheetCountours = this.getQuestionContours(thresholdedImage);
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

    getQuestionContours(thresholdedImage: ImageMatrix) {
        const openCVThresholdedImage = this.imageDataAdapter.convertImageMatrixToOriginalData(thresholdedImage);

        const openCVContours = openCVThresholdedImage.findContours(OpenCV.RETR_EXTERNAL, OpenCV.CHAIN_APPROX_SIMPLE)

        const contours = openCVContours.map((currentContours: Contour) => this.imageDataAdapter.convertOriginalDataToContour(currentContours))

        return contours.filter((currentContour: Contour) => this.checkIfIsValidQuestion(currentContour))
    }

    checkIfIsValidQuestion(contour: Contour): boolean {
        const openCVContour = this.imageDataAdapter.convertContourToOriginalData(contour);

        const { width, height } = openCVContour.boundingRect();

        if (width <= this.questionMarkWidth || height <= this.questionMarkHeight) {
            return false
        };

        return true;
    }

    getPercentMarkedArea(thresholdedImage: ImageMatrix, contour: Contour): number {
        const openCVThresholdedImage = this.imageDataAdapter.convertImageMatrixToOriginalData(thresholdedImage);
        const openCVContour = this.imageDataAdapter.convertContourToOriginalData(contour);

        const { rows, cols, type } = openCVThresholdedImage;

        const mask = new this.openCV.Mat(rows, cols, type, 0);
        const contourColorVector = new this.openCV.Vec3(255, 255, 255)

        mask.drawContours([openCVContour.getPoints()], -1, new OpenCV.Vec3(255, 255, 255), { thickness: -1 });

        const openCVMaskedImage = openCVThresholdedImage.bitwiseAnd(mask);

        const totalOfMarkedPixels = openCVMaskedImage.countNonZero();

        const markedTotalArea = this.getQuestionTotalAreaFromContour(contour);

        return totalOfMarkedPixels / markedTotalArea;
    };

    getQuestionTotalAreaFromContour(contour: Contour): number {
        const { openCVContour } = this.imageDataAdapter.convertContourToOriginalData(contour);

        const { width, height } = openCVContour.boundingRect();

        return width * height;
    };

    sortQuestionContours(contours: Contour[], ascending: boolean): Contour[] {
        return contours.sort((contourA, contourB) => {
            const openCVContourA = this.imageDataAdapter.convertContourToOriginalData(contourA);
            const openCVContourB = this.imageDataAdapter.convertContourToOriginalData(contourB);

            const { x: xA } = openCVContourA.boundingRect();
            const { x: xB } = openCVContourB.boundingRect();
            if (ascending) {
                return xA - xB;
            }
            return xB - xA;
        })
    }

}
