declare interface QuestionGrader {
    gradeQuestionColumn(currentImage: ImageMatrix, questionColumnRegion: Rectangle, numberOfAnswersPerQuestion: number, numberOfRows: number)
    gradeSingleQuestion(currentThresholdedImage: ImageMatrix, currentQuestionContours: Contour[], numberOfAnswersPerQuestion: number, currentQuestionIndex): GradeQuestionResult
    getValidQuestionContours(thresholdedAnswerSheet: ImageMatrix): Contour[];
    getPercentMarkedArea(thresholdedImage: ImageMatrix, contour: Contour): number;
    getQuestionTotalAreaFromContour(contour: Contour): number;
    sortQuestionContours(contours: Contour[], type: 'left-to-right' | 'right-to-left' | 'bottom-to-top' | 'top-to-bottom'): Contour[];
} 