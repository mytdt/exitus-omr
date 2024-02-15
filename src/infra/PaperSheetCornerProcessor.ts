import * as OpenCV from "@u4/opencv4nodejs";

export default class PaperSheetCornerProcessor implements PaperSheetCornerProcessor {
    protected readonly imageProcessor: ImageProcessor;

    constructor(imageProcessor: ImageProcessor) {
        this.imageProcessor = imageProcessor;
    }

    processPaperSheetCornerIndicators(paperSheetImagePath: string, cornerIndicatorsRegion: Rectangle) {
        /* TODO: Create Validations */

        const paperSheetCornerIndicators = this.locatePaperSheetCornerIndicators(paperSheetImagePath, cornerIndicatorsRegion);

        const processedImage = this.rotatePaperSheetAfterCornerIndicators(paperSheetImagePath, paperSheetCornerIndicators)

        return processedImage;
    }

    locatePaperSheetCornerIndicators(paperSheetImagePath: string, cornerIndicatorsRegion: Rectangle): Contour[] {
        const paperSheetImage = this.imageProcessor.loadImageFromSource(paperSheetImagePath);
        const grayscaledImage = this.imageProcessor.convertToGrayscale(paperSheetImage);
        const thresholdedImage = this.imageProcessor.applyThreshold(grayscaledImage, { thresholdNumber: 128, maximumValue: 255, type: OpenCV.THRESH_BINARY })

        const cornerIndicatorsROI = this.imageProcessor.getRegionOfInterest(thresholdedImage, cornerIndicatorsRegion);

        return this.imageProcessor.getImageContours(cornerIndicatorsROI, { mode: OpenCV.RETR_TREE, method: OpenCV.CHAIN_APPROX_SIMPLE });
    }

    rotatePaperSheetAfterCornerIndicators(paperSheetImagePath: string, cornerIndicatorsContours: Contour[]): ImageMatrix {
        const paperSheetImage = this.imageProcessor.loadImageFromSource(paperSheetImagePath);
        /* TODO: Create utils function to handle median of array of numbers to select angle */
        const angle: number = this.imageProcessor.getCountoursAngularOrientation(cornerIndicatorsContours)[1];
        const centerPoint: Point2D = this.imageProcessor.getImageCenterPoint(paperSheetImage);

        return this.imageProcessor.rotateImageByDegrees(paperSheetImage, { angle, centerPoint })
    }

}
