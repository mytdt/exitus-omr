import JsqrQRCodeProcessor from '../../infra/JsqrQRCodeProcessor';
import jsQR from "jsqr";
import { OpenCVImageDataAdapterService } from '../utils/OpenCVImageDataAdapterService';
import { OpenCVImageProcessorService } from './OpenCVImageProcessorService';


export const JsqrQRCodeProcessorService = (): QRCodeProcessor => new JsqrQRCodeProcessor(jsQR, OpenCVImageDataAdapterService(), OpenCVImageProcessorService())