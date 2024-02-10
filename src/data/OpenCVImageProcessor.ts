import * as OpenCV from "@u4/opencv4nodejs";

class OpenCVImageProcessor implements ImageProcessor {
    protected readonly openCV: typeof OpenCV;
    protected readonly imageDataAdapter: ImageDataAdapter;

    constructor(openCV: typeof OpenCV, imageDataAdapter: ImageDataAdapter) {
        this.openCV = openCV;
        this.imageDataAdapter = imageDataAdapter;
    }

    loadImageFromSource(src: string): ImageMatrix {
        try {
            const openCVImage = this.openCV.imread(src);
            return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVImage)
        }
        catch (err) {
            throw new Error(err.message);
        }
    };

    convertToGrayscale(currentImage: ImageMatrix): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const openCVGrayscaledImage = openCVConvertedCurrentImage.bgrToGray();
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVGrayscaledImage);
    }

    applyBinaryThreshold(currentImage: ImageMatrix, { thresholdNumber, maximumValue, type }: BinaryThresholdParameters): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const thresholdedImage = openCVConvertedCurrentImage.threshold(thresholdNumber, maximumValue, type)
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(thresholdedImage)
    }

    getRegionOfInterest(currentImage: ImageMatrix, { x, y, width, height }: Rectangle): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;

        const openCVRectangle = new this.openCV.Rect(x, y, width, height);

        const ROI = openCVConvertedCurrentImage.getRegion(openCVRectangle);

        return this.imageDataAdapter.convertOriginalDataToImageMatrix(ROI)
    }

    rotateImageByDegrees(currentImage: ImageMatrix, { centerPoint, angle }: RotateImageParameters) {
        const openCVPoint2D = new this.openCV.Point2(centerPoint.x, centerPoint.y);
        /* TODO: Write util function to receive sorted angles array and then rotate it from its array median angle*/
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const rotationMatrix = this.openCV.getRotationMatrix2D(openCVPoint2D, angle);
        const rotatedImage = openCVConvertedCurrentImage.warpAffine(rotationMatrix)
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(rotatedImage)
    }

    getImageCenterPoint(currentImage: ImageMatrix): Point2D {
        return new cv.Point2(Math.floor(currentImage.rows / 2), Math.floor(currentImage.columns / 2));
    }

    getRectanglesAngularOrientation(currentImage: ImageMatrix): number[] {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        openCVConvertedCurrentImage.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);
        const cornerIndicatorsRotatedRectangles = cornerIndicatorsCountours.map((currentContour) => currentContour.minAreaRect())
        const rectanglesAngles = cornerIndicatorsRotatedRectangles.map(({ angle, size }) => {
            if (size.width > size.height) {
                return 90 + angle;
            }
            return angle;
        })

        return rectanglesAngles
    }
}

module.exports = OpenCVImageProcessor;