import jsQR, { QRCode } from "jsqr";
import jpeg from 'jpeg-js';

export default class JsqrQRCodeProcessor implements QRCodeProcessor {
    protected readonly jsqr: typeof jsQR;
    protected readonly imageDataAdapter: ImageDataAdapter;

    constructor(jsqr: typeof jsQR, imageDataAdapter: ImageDataAdapter) {
        this.jsqr = jsqr;
        this.imageDataAdapter = imageDataAdapter;
    }

    decode(qrCodeImg: ImageMatrix): string {
        const encodedImage = this.imageDataAdapter.encodeImageMatrixToBuffer(qrCodeImg, { fileExtension: '.jpg' })
        const jpgData = jpeg.decode(encodedImage, { useTArray: true });
        const qrArray = new Uint8ClampedArray(jpgData.data.buffer);
        const qrCodeDecodeResult: QRCode = this.jsqr(qrArray, jpgData.width, jpgData.height);
        return qrCodeDecodeResult.data;
    }
}

