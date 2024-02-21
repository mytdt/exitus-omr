declare interface GradeQuestionResult {
    questionIndex: number;
    questionVerdict: QuestionVerdict;
    markedAnswers: MarkedAnswers;
}

declare interface MarkedAnswers {
    indexes: number[]
    contours: Contour[];
}

