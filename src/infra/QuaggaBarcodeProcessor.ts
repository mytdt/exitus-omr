import { QuaggaJSStatic } from '@ericblade/quagga2';

export default class QuaggaBarcodeProcessor implements BarcodeProcessor {
    protected readonly quagga: QuaggaJSStatic;

    constructor(quagga: QuaggaJSStatic) {
        this.quagga = quagga;
    }

    async decode(barcodeImgSource: string): Promise<string> {
        try {
            const response = await this.quagga.decodeSingle({
                src: barcodeImgSource,
                numOfWorkers: 0,  // Needs to be 0 when used within node
                inputStream: {
                    size: 1200
                },
                decoder: {
                    readers: ["code_128_reader"], // List of active readers
                    multiple: false
                },
                locate: true, // Will auto detect barcode within the img
                locator: {
                    patchSize: 'medium',
                    halfSample: true,
                }
            })
            if (response.codeResult) {
                return response.codeResult.code;
            }
        }
        catch (error) {
            console.error(error.message);
        }
    }
}
