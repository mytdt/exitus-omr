import { OpenCVImageProcessorService } from './OpenCVImageProcessorService';
import PaperSheetCornerProcessor from '../../infra/PaperSheetCornerProcessor';

export const PaperSheetCornerProcessorService = (): PaperSheetCornerProcessor => new PaperSheetCornerProcessor(OpenCVImageProcessorService());