import * as OpenCV from "@u4/opencv4nodejs";

export default class OpenCVAdapter {
    protected readonly openCV;

    constructor(openCV: typeof OpenCV) {
        this.openCV = openCV;
    }
}