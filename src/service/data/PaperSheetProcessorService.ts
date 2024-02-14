import PaperSheetProcessor from "../../data/PaperSheetProcessor";
import { JsqrQRCodeProcessorService } from "../infra/JsqrQRCodeProcessorService";
import { OpenCVQuestionGraderService } from "../infra/OpenCVQuestionGraderService";
import { PaperSheetCornerProcessorService } from "../infra/PaperSheetCornerProcessorService";
import { QuaggaBarcodeProcessorService } from "../infra/QuaggaBarcodeProcessorService";


export const PaperSheetProcessorService = (paperSheetTemplate: PaperSheetTemplate) => new PaperSheetProcessor(
    PaperSheetCornerProcessorService(),
    OpenCVQuestionGraderService(),
    QuaggaBarcodeProcessorService(),
    JsqrQRCodeProcessorService(),
    paperSheetTemplate,
)