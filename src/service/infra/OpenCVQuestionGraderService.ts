import OpenCVBubbleSheetQuestionGrader from "../../infra/OpenCVQuestionGrader/OpenCVBubbleSheetQuestionGrader";
import { OpenCVImageDataAdapterService } from "../utils/OpenCVImageDataAdapterService";
import * as OpenCV from '@u4/opencv4nodejs'

export const OpenCVQuestionGraderService = () => new OpenCVBubbleSheetQuestionGrader(OpenCV, OpenCVImageDataAdapterService());