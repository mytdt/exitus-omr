import jsQR, { QRCode } from "jsqr";
import jpeg from 'jpeg-js';

export default class JsqrQRCodeProcessor implements QRCodeProcessor {
    protected readonly jsqr: typeof jsQR;
    protected readonly imageDataAdapter: ImageDataAdapter;
    protected readonly imageProcessor: ImageProcessor;

    constructor(jsqr: typeof jsQR, imageDataAdapter: ImageDataAdapter, imageProcessor: ImageProcessor) {
        this.jsqr = jsqr;
        this.imageDataAdapter = imageDataAdapter;
        this.imageProcessor = imageProcessor;
    }

    decode(paperSheetRotatedImage: ImageMatrix, qrCodeRegion: Rectangle): string {
        const qrCodeROI = this.imageProcessor.getRegionOfInterest(paperSheetRotatedImage, qrCodeRegion);

        const encodedImage = this.imageDataAdapter.encodeImageMatrixToBuffer(qrCodeROI, { fileExtension: '.jpg' })

        const jpgData = jpeg.decode(encodedImage, { useTArray: true });
        const qrArray = new Uint8ClampedArray(jpgData.data.buffer);
        const qrCodeDecodeResult: QRCode = this.jsqr(qrArray, jpgData.width, jpgData.height);

        return qrCodeDecodeResult.data;
    }
}

