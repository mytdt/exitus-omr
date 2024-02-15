
export default class PaperSheetProcessor {
    protected readonly paperSheetCornerProcessor: PaperSheetCornerProcessor;
    protected readonly questionGrader: QuestionGrader;
    protected readonly barcodeProcessor: BarcodeProcessor;
    protected readonly qrcodeProcessor: QRCodeProcessor;
    protected readonly paperSheetTemplate: PaperSheetTemplate;


    constructor(paperSheetCornerProcessor: PaperSheetCornerProcessor, questionGrader: QuestionGrader, barcodeProcessor: BarcodeProcessor, qrcodeProcessor: QRCodeProcessor, paperSheetTemplate: PaperSheetTemplate) {
        this.barcodeProcessor = barcodeProcessor;
        this.paperSheetCornerProcessor = paperSheetCornerProcessor;
        this.qrcodeProcessor = qrcodeProcessor;
        this.questionGrader = questionGrader;
        this.paperSheetTemplate = paperSheetTemplate;
    }

    processCurrentSheet(paperSheetFilePath: string) {
        const { cornerIndicatorsRegion, barcodeRegion, qrCodeRegion, answerSheet } = this.paperSheetTemplate;

        /* TODO: Validate Errors and Develop Exceptions Flow */
        const rotatedImage = this.paperSheetCornerProcessor.processPaperSheetCornerIndicators(paperSheetFilePath, cornerIndicatorsRegion)

        /* TODO: Validate Errors and Develop Exceptions Flow */
        const qrCodeMessage = this.qrcodeProcessor.decode(rotatedImage, qrCodeRegion);

        /* TODO: Validate Errors and Develop Exceptions Flow */
        const { columns, numberOfAnswersPerQuestion, type } = answerSheet;

        /* TODO: Implement full column ROI logic in order to avoid detecting errors */
        columns.forEach(({ firstRowRegion, numberOfRows }, index) => {
            for (let i = 0; i < numberOfRows; i++) {

                const currentRowRegion: Rectangle = {
                    ...firstRowRegion,
                    y: firstRowRegion.y + firstRowRegion.height * i
                }
                this.questionGrader.gradeQuestion(rotatedImage, currentRowRegion, 0);
            }
        })
    }
}