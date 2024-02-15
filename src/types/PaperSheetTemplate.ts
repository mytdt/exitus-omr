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
        firstRowRegion: Rectangle;
        numberOfRows: number;
    }[]
}