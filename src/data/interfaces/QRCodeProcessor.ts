declare interface QRCodeProcessor {
    decode(qrCodeImg: ImageMatrix): string;
}