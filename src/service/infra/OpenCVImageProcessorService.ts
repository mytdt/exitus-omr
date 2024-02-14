import * as OpenCV from '@u4/opencv4nodejs';
import { OpenCVImageDataAdapterService } from '../utils/OpenCVImageDataAdapterService';
import OpenCVImageProcessor from '../../infra/OpenCVImageProcessor';

export const OpenCVImageProcessorService = (): ImageProcessor => new OpenCVImageProcessor(OpenCV, OpenCVImageDataAdapterService())