declare interface PaperSheetTemplate {
    cornerIndicatorsRegion: Rectangle;
    barcodeRegion: Rectangle;
    qrCodeRegion: Rectangle;
    answerSheet: AnswerSheetTemplate;
}

declare interface AnswerSheetTemplate {
    type: 'bubble' | 'rectangle',
    numberOfAnswersPerQuestion: number;
    columns: {
        region: Rectangle;
        numberOfRows: number;
    }[]
}