const OpenCVImageProcessorAdapter = require('./utils/OpenCVImageProcessorAdapter');

const opencv = require('@u4/opencv4nodejs');

const img = opencv.imread('./assets/img.jpg');

const imageProcessor = new OpenCVImageProcessorAdapter(opencv)

const imgMatrix = imageProcessor.convertOriginalDataToImageMatrix(img);
const originalImage = imageProcessor.convertImageMatrixToOriginalData(imgMatrix)


const Quagga = require('@ericblade/quagga2').default;

const QuaggaBarcodeProcessor = require('./data/QuaggaBarcodeProcessor');

const proc = new QuaggaBarcodeProcessor(Quagga);
