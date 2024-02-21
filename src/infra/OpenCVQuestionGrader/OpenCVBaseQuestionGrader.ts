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
    protected readonly questionPositionOffsetTolerance: number = 5;

    constructor(openCV: typeof OpenCV, imageDataAdapter: ImageDataAdapter, imageProcessor: ImageProcessor) {
        this.openCV = openCV;
        this.imageDataAdapter = imageDataAdapter;
        this.imageProcessor = imageProcessor;
    }

    gradeQuestionColumn(currentImage: ImageMatrix, questionColumnRegion: Rectangle, numberOfAnswersPerQuestion: number, numberOfRows: number) {
        const questionColumnRegionOfInterest = this.imageProcessor.getRegionOfInterest(currentImage, questionColumnRegion);

        const grayscaledImage = this.imageProcessor.convertToGrayscale(questionColumnRegionOfInterest);
        const invertedImage = this.imageProcessor.applyBitwiseNot(grayscaledImage);
        const blurredImage = this.imageProcessor.applyGaussianBlur(invertedImage);
        const thresholdedImage = this.imageProcessor.applyThreshold(blurredImage, { thresholdNumber: 0, maximumValue: 255, type: OpenCV.THRESH_BINARY | OpenCV.THRESH_OTSU })

        const bubbleSheetCountours = this.getValidQuestionContours(thresholdedImage);

        //const imageWithContours = this.imageProcessor.drawContoursInImage(questionColumnRegionOfInterest, bubbleSheetCountours);
        //OpenCV.imshowWait('aaa', this.imageDataAdapter.convertImageMatrixToOriginalData(imageWithContours))

        const sortedContoursTopToBottom = this.sortQuestionContours(bubbleSheetCountours, 'top-to-bottom');

        const contoursDividedByQuestions = this.getContoursDividedByQuestions(sortedContoursTopToBottom);

        /* TODO: Validate if contoursDividedByQuestions has numberOfRows and do error handling of it */

        const sortedContoursDividedByQuestions = contoursDividedByQuestions.map((currentQuestionContours: Contour[]) => this.sortQuestionContours(currentQuestionContours, 'left-to-right'))

        const questionsGradeResult = sortedContoursDividedByQuestions.map((currentQuestionContours: Contour[], index: number) => this.gradeSingleQuestion(thresholdedImage, currentQuestionContours, numberOfAnswersPerQuestion, index))

        return questionsGradeResult;
    }

    gradeSingleQuestion(currentThresholdedImage: ImageMatrix, currentQuestionContours: Contour[], numberOfAnswersPerQuestion: number, currentQuestionIndex: number): GradeQuestionResult {
        /* TODO: Rewrite proper Validation process */
        if (currentQuestionContours.length !== numberOfAnswersPerQuestion) {
            console.error('Question without right number of answers detected!');
        }


        const markedAnswers = currentQuestionContours.reduce(({ indexes, contours }, currentContour, index) => {
            const percentMarkedArea = this.getPercentMarkedArea(currentThresholdedImage, currentContour);
            if (percentMarkedArea >= this.percentMarkedAreaTolerance) {
                return {
                    indexes: [...indexes, index],
                    contours: [...contours, currentContour]
                }
            }
            return { indexes, contours };

        }, { indexes: [], contours: [] })


        if (markedAnswers.indexes.length > 2) {
            return {
                questionIndex: currentQuestionIndex,
                questionVerdict: QuestionVerdict.SCRIBBLED,
                markedAnswers
            }
        }
        if (markedAnswers.indexes.length === 0) {
            return {
                questionIndex: currentQuestionIndex,
                questionVerdict: QuestionVerdict.UNANSWERED,
                markedAnswers
            }
        }
        return {
            questionIndex: currentQuestionIndex,
            questionVerdict: QuestionVerdict.ANSWERED,
            markedAnswers: markedAnswers
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

    getContoursDividedByQuestions(contours: Contour[]): Contour[][] {

        const contoursDividedByQuestions = [[contours[0]]];

        for (let i = 1; i < contours.length; i++) {
            const { y: currentY } = this.imageProcessor.getBoundingRectangleOfContour(contours[i])
            const { y: previousY } = this.imageProcessor.getBoundingRectangleOfContour(contours[i - 1]);

            if (Math.abs(currentY - previousY) <= this.questionPositionOffsetTolerance) {
                contoursDividedByQuestions[contoursDividedByQuestions.length - 1].push(contours[i]);
            }
            else {
                contoursDividedByQuestions.push([contours[i]])
            }
        }


        return contoursDividedByQuestions;
    }

    sortQuestionContours(contours: Contour[], type): Contour[] {
        return contours.sort((contourA, contourB) => {
            const { x: xA, y: yA } = this.imageProcessor.getBoundingRectangleOfContour(contourA)
            const { x: xB, y: yB } = this.imageProcessor.getBoundingRectangleOfContour(contourB)

            switch (type) {
                case 'left-to-right':
                    return xA - xB;
                case 'right-to-left':
                    return xB - xA;
                case 'bottom-to-top':
                    return yB - yA;
                case 'top-to-bottom':
                    return yA - yB
            }
        })
    }
}
