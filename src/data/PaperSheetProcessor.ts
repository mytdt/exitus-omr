
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

        const answeredQuestionsByColumn = columns.map(({ region, numberOfRows }) => {
            return this.questionGrader.gradeQuestionColumn(rotatedImage, region, numberOfAnswersPerQuestion, numberOfRows);
        });

        const answeredQuestions = answeredQuestionsByColumn.reduce((previousProcessedAnswerColumn, currentAnswerColumn, index) => {
            const currentProcessedAnswerColumn = currentAnswerColumn.map(({ questionIndex, ...rest }: GradeQuestionResult) => {
                const lastQuestionIndex = previousProcessedAnswerColumn.length;
                return {
                    questionIndex: questionIndex + lastQuestionIndex,
                    ...rest
                }
            })


            return [...previousProcessedAnswerColumn, ...currentProcessedAnswerColumn]
        }, [])
    }
}