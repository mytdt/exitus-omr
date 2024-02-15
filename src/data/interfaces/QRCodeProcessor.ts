declare interface QRCodeProcessor {
    decode(paperSheetFilePath: ImageMatrix, qrCodeRegion: Rectangle): string;
}