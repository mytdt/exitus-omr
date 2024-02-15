declare interface QuestionGrader {
    gradeQuestion(currentImage: ImageMatrix, answerSheetRegion: Rectangle, correctAnswerIndex: number): GradeQuestionResult;
    getValidQuestionContours(thresholdedAnswerSheet: ImageMatrix): Contour[];
    getPercentMarkedArea(thresholdedImage: ImageMatrix, contour: Contour): number;
    getQuestionTotalAreaFromContour(contour: Contour): number;
    sortQuestionContours(contours: Contour[], ascending: boolean): Contour[];
}