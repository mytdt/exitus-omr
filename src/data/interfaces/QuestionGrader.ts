declare interface QuestionGrader {
    gradeQuestion(imageMatrix: ImageMatrix, correctAnswerIndex: number): GradeQuestionResult;
    getQuestionContours(thresholdedImage: ImageMatrix): Contour;
    checkIfIsValidQuestion(contour: Contour): boolean;
    getPercentMarkedArea(thresholdedImage: ImageMatrix, contour: Contour): number;
    getQuestionTotalAreaFromContour(contour: Contour): number;
    sortQuestionContours(contours: Contour[], ascending: boolean): Contour[];
}