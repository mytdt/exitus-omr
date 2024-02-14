import JsqrQRCodeProcessor from '../../infra/JsqrQRCodeProcessor';
import jsQR from "jsqr";
import { OpenCVImageDataAdapterService } from '../utils/OpenCVImageDataAdapterService';


export const JsqrQRCodeProcessorService = (): QRCodeProcessor => new JsqrQRCodeProcessor(jsQR, OpenCVImageDataAdapterService())