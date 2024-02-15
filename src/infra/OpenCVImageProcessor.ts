import * as OpenCV from "@u4/opencv4nodejs";

export default class OpenCVImageProcessor implements ImageProcessor {
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


    createMaskFromImage(currentImage: ImageMatrix, fillValue?: number | number[]): ImageMatrix {
        const openCVImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage);

        const { rows, cols, type } = openCVImage;

        const openCVMask = new this.openCV.Mat(rows, cols, type, 0);

        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVMask);
    }

    convertToGrayscale(currentImage: ImageMatrix): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const openCVGrayscaledImage = openCVConvertedCurrentImage.bgrToGray();
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVGrayscaledImage);
    }

    drawContoursInImage(currentImage: ImageMatrix, contours: Contour[]): ImageMatrix {
        const openCVImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const openCVContoursPoints = contours.map((currentContour: Contour) => (this.imageDataAdapter.convertContourToOriginalData(currentContour) as OpenCV.Contour).getPoints())
        openCVImage.drawContours(openCVContoursPoints, -1, new OpenCV.Vec3(255, 255, 255), { thickness: -1 })
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVImage);
    }

    applyBitwiseNot(currentImage: ImageMatrix): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const openCVBitwisedImage = openCVConvertedCurrentImage.bitwiseNot();
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVBitwisedImage);
    }

    applyBitwiseAnd(currentImage: ImageMatrix, mask: ImageMatrix): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const openCVMask = this.imageDataAdapter.convertImageMatrixToOriginalData(mask);
        const openCVBitwisedImage = openCVConvertedCurrentImage.bitwiseAnd(openCVMask);
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVBitwisedImage);
    }

    /* TODO: Create Proper internal types */
    applyGaussianBlur(currentImage: ImageMatrix, options?: {}): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const openCVBlurredImage = openCVConvertedCurrentImage.gaussianBlur(new OpenCV.Size(3, 3), 0)
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(openCVBlurredImage);
    }


    applyThreshold(currentImage: ImageMatrix, { thresholdNumber, maximumValue, type }: ThresholdParameters): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const thresholdedImage = openCVConvertedCurrentImage.threshold(thresholdNumber, maximumValue, type)

        return this.imageDataAdapter.convertOriginalDataToImageMatrix(thresholdedImage)
    }

    getImageContours(currentImage: ImageMatrix, params: ImageContourAlgorithmParameters): Contour[] {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;

        const openCVContour = openCVConvertedCurrentImage.findContours(params.mode, params.method);

        const contours = openCVContour.map((currentOpenCVContour: OpenCV.Contour) => this.imageDataAdapter.convertOriginalDataToContour(currentOpenCVContour));
        return contours;
    }

    getBoundingRectangleOfContour(contour: Contour): Rectangle {
        const openCVContour = this.imageDataAdapter.convertContourToOriginalData(contour) as OpenCV.Contour;
        return openCVContour.boundingRect();
    }

    getRegionOfInterest(currentImage: ImageMatrix, { x, y, width, height }: Rectangle): ImageMatrix {
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;

        const openCVRectangle = new this.openCV.Rect(x, y, width, height);

        const ROI = openCVConvertedCurrentImage.getRegion(openCVRectangle).copyTo(openCVConvertedCurrentImage);
        this.openCV.imshowWait('zaa', ROI);
        return this.imageDataAdapter.convertOriginalDataToImageMatrix(ROI)
    }

    rotateImageByDegrees(currentImage: ImageMatrix, { centerPoint, angle }: RotateImageParameters) {
        const openCVPoint2D = new this.openCV.Point2(centerPoint.x, centerPoint.y);
        /* TODO: Write util function to receive sorted angles array and then rotate it from its array median angle*/
        const openCVConvertedCurrentImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage) as OpenCV.Mat;
        const rotationMatrix = this.openCV.getRotationMatrix2D(openCVPoint2D, angle - 90);
        const rotatedImage = openCVConvertedCurrentImage.warpAffine(rotationMatrix)

        return this.imageDataAdapter.convertOriginalDataToImageMatrix(rotatedImage)
    }

    getImageCenterPoint(currentImage: ImageMatrix): Point2D {
        return new this.openCV.Point2(Math.floor(currentImage.columns / 2), Math.floor(currentImage.rows / 2));
    }

    getCountoursAngularOrientation(contours: Contour[]): number[] {

        const openCVContours = contours.map((currentContour: Contour) => this.imageDataAdapter.convertContourToOriginalData(currentContour));
        const cornerIndicatorsRotatedRectangles = openCVContours.map((currentContour) => currentContour.minAreaRect())

        const rectanglesAngles = cornerIndicatorsRotatedRectangles.map(({ angle, size }) => {
            if (size.width > size.height) {
                return 90 + angle;
            }
            return angle;
        })

        return rectanglesAngles
    }

    getNonZeroPixelsinImage(currentImage: ImageMatrix): number {
        const openCVImage = this.imageDataAdapter.convertImageMatrixToOriginalData(currentImage);
        return openCVImage.countNonZero()
    }
}
