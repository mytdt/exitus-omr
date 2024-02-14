import OpenCVImageDataAdapter from "../../utils/OpenCVImageDataAdapter";
import * as OpenCV from '@u4/opencv4nodejs';

export const OpenCVImageDataAdapterService = (): ImageDataAdapter => new OpenCVImageDataAdapter(OpenCV);