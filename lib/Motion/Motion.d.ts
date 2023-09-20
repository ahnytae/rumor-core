import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import { CanvasStyles } from "./types";
export default class Motion {
    private static instance;
    private static detector;
    private static requestAnimationId;
    private static DEFAULT_FILL_STYLE;
    private static DEFAULT_STORKE_STYLE;
    private static DEFAULT_LINE_WIDTH;
    private static ctx;
    private static videoWidth;
    private static videoHeight;
    private static drawVideoEl;
    private constructor();
    static motionCreate(canvasEl: HTMLCanvasElement, drawVideoEl: HTMLVideoElement, options?: CanvasStyles): Promise<void>;
    static get getInstanceOrNull(): Motion | null;
    static motionStart(): Promise<void>;
    static motionStop(): void;
    /**
     * @param Motion 켠 상대의 poses 데이터
     * @description Event 클래스에서 socket.on("pose") 데이터 받아와 추가.
     */
    static pushRemotePoses(poses: poseDetection.Pose[]): Promise<void>;
    private static createDetector;
    /** 본인 Pose 데이터 */
    private static renderLines;
    private static checkEmptyPosesAndDraw;
    private static draw;
    private static drawCtx;
    private static clearCtx;
    private static drawResults;
    private static drawResult;
    private static drawKeypoints;
    private static drawKeypoint;
    private static drawSkeleton;
}
