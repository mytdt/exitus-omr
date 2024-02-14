declare interface PaperSheetCornerProcessor {
    processPaperSheetCornerIndicators(paperSheetImagePath: string, cornerIndicatorsRegion: Rectangle): ImageMatrix;
    locatePaperSheetCornerIndicators(paperSheetImagePath: string, cornerIndicatorsRegion: Rectangle): Contour[]
    rotatePaperSheetAfterCornerIndicators(paperSheetImagePath: string, cornerIndicatorsContours: Contour[]): ImageMatrix;
}