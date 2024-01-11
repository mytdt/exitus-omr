/* Load OpenCV */
const cv = require('@u4/opencv4nodejs');
/* Load Template File */
const paperTemplate = require('../template.json');

const {cornerIndicators, barcode, qrcode} = paperTemplate;

const papersheet = cv.imread('./assets/img.jpg');

/* Load Image Window for better display */
cv.namedWindow('image', cv.WINDOW_NORMAL);
cv.resizeWindow('image', 1080, 720);

// show image
cv.imshow('image', papersheet);
cv.waitKey();
 
// Convert to grayscale 
const papersheetGrayscaled = papersheet.bgrToGray(); 
// Apply binary thresholding 
const papersheetThresholded = papersheetGrayscaled.threshold(128, 255, cv.THRESH_BINARY);

// Corner Indicators Processement

const cornerIndicatorsROI = new cv.Rect(cornerIndicators.x, cornerIndicators.y, cornerIndicators.width, cornerIndicators.height);

const cornerIndicatorsRegion = papersheetThresholded.getRegion(cornerIndicatorsROI)
const cornerIndicatorsCountours = cornerIndicatorsRegion.findContours(cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

const offsetCornerIndicators = new cv.Point2(cornerIndicators.x, cornerIndicators.y);
const cornerIndicatorsRectangles = cornerIndicatorsCountours.map((currentContour) => currentContour.approxPolyDP( 0.01 * currentContour.arcLength(true), true));

// Extração do ângulo de rotação da folha
const cornerIndicatorsRotatedRectangles = cornerIndicatorsCountours.map((currentContour) => currentContour.minAreaRect())
const rectanglesAngles = cornerIndicatorsRotatedRectangles.map(({angle, size}) => {
    if(size.width > size.height){
        return 90 + angle;
    }
    return angle;
})

// Ponto central da imagem analisada
const centerPoint = new cv.Point2(Math.floor(papersheet.rows/2), Math.floor(papersheet.cols/2));

// Geração da papersheetriz de rotação com base na folha
const rotationPapersheetMatrix = cv.getRotationMatrix2D(centerPoint, rectanglesAngles[1] - 90);

// Geração de imagem rotacionada com base no ângulo
const rotatedPapersheet = papersheet.warpAffine(rotationPapersheetMatrix);

const rotatedPapersheetImage = cv.imwrite('./assets/img2.jpg', rotatedPapersheet)

// Conversão para grayscale
const rotatedPapersheetGrayscaled = rotatedPapersheet.bgrToGray(); 
// Aplicação de binary thresholding na imagem rotacionada
const rotatedPapersheetThresholded = rotatedPapersheetGrayscaled.threshold(128, 255, cv.THRESH_BINARY);

//const contours = papersheetThresholded.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE, point);

//console.log(contours);
//const [contours, any] = cv2.findContours(papersheetThresholded, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) 
// console.log(contours)

const barcodeROI = new cv.Rect(barcode.x, barcode.y, barcode.width, barcode.height)
const barcodeRegion = rotatedPapersheetThresholded.getRegion(barcodeROI)
//const barcodeRegionContours = barcodeRegion.findContours(cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
const barcodeImg = cv.imwrite('./assets/barcode.jpg', barcodeRegion);

const Quagga = require('quagga').default;

Quagga.decodeSingle({
    src: './assets/barcode.jpg',
    multiple: false,
    numOfWorkers: 0,  // Needs to be 0 when used within node
    inputStream: {
        size: 1200  // restrict input-size to be 800px in width (long-side)
    },
    decoder: {
        readers: ["code_128_reader"] // List of active readers
    },
    locate: true,
    patchSize: 'x-large',
    halfSample: true,
}, (result) => {
    if(result.codeResult) {
        console.log("result", result.codeResult.code);
    } else {
        console.log("not detected");
    }
});


const jsQR = require('jsqr');

const qrCodeROI = new cv.Rect(qrcode.x, qrcode.y, qrcode.width, qrcode.height);

const qrCodeRegion = rotatedPapersheetThresholded.getRegion(qrCodeROI);

/* TODO: Create a handler for generated QRCode images, in order to use jsQR library for QrCode reading */


// const ImageData = require('@canvas/image-data')

// const imgData = new ImageData(
//     new Uint8ClampedArray(qrCodeRegion.copyTo(qrCodeNewMatrix).getData()),
//     qrCodeRegion.copyTo(qrCodeNewMatrix).cols,
//     qrCodeRegion.copyTo(qrCodeNewMatrix).rows
// );

// const code = jsQR(im);

cv.imshow('image',qrCodeRegion )
cv.waitKey();

//const barcodeRegionRectangles = barcodeRegionContours.map((currentContour) => currentContour.approxPolyDP( 0.01 * currentContour.arcLength(true), true));

//const colorVector = new cv.Vec3(0, 255, 0)
const countoursColorVector = new cv.Vec3(0, 255, 0)
papersheet.drawContours(cornerIndicatorsRectangles, -1, countoursColorVector, {thickness: 3, offset: offsetCornerIndicators})


cv.imshow('image', papersheet) 
cv.waitKey();

// rotatedPapersheet.drawContours(barcodeRegionRectangles, -1, countoursColorVector, {thickness: 3, offset: new cv.Point2(barcode.x, barcode.y)})
// cv.imshow('image', rotatedPapersheet) 
// cv.waitKey();

//console.log(contours)
// Filter contours  
// const rects = [] 
// for contour in contours: 
    // # Approxipapersheete the contour to a polygon 
    // polygon = cv2.approxPolyDP(contour, 0.01 * cv2.arcLength(contour, True), True) 
 
    // # Check if the polygon has 4 sides and the aspect ratio is close to 1 
    // if len(polygon) == 4 and abs(1 - cv2.contourArea(polygon) / (cv2.boundingRect(polygon)[2] * cv2.boundingRect(polygon)[3])) < 0.1: 
    //     rects.append(polygon) 
 
// # Draw rectangles 
// for rect in rects: 
//     cv2.drawContours(image, [rect], 0, (0, 255, 0), 2) 
 
// # Show the result 
cv.destroyAllWindows() 