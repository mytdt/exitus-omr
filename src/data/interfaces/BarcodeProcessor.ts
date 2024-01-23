declare interface BarcodeProcessor {
    decode(barcodeImgSource: string): Promise<string>;
}