import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";

import Signaling from "../Signaling/Signaling";
import { CanvasStyles } from "./types";

export default class Motion {
  private static instance: Motion | null;
  private static detector: poseDetection.PoseDetector;

  private static requestAnimationId: number;
  private static DEFAULT_FILL_STYLE = "Red";
  private static DEFAULT_STORKE_STYLE = "Green";
  private static DEFAULT_LINE_WIDTH = 3;

  private static ctx: CanvasRenderingContext2D;
  private static videoWidth: number;
  private static videoHeight: number;

  private static drawVideoEl: HTMLVideoElement;

  private constructor(canvasEl: HTMLCanvasElement, drawVideoEl: HTMLVideoElement, options?: CanvasStyles) {
    Motion.ctx = canvasEl.getContext("2d") as CanvasRenderingContext2D;
    Motion.videoWidth = canvasEl.width;
    Motion.videoHeight = canvasEl.height;

    Motion.ctx.fillStyle = options?.fillStyle || Motion.DEFAULT_FILL_STYLE;
    Motion.ctx.strokeStyle = options?.strokeStyle || Motion.DEFAULT_STORKE_STYLE;
    Motion.ctx.lineWidth = options?.lineWidth || Motion.DEFAULT_LINE_WIDTH;

    Motion.drawVideoEl = drawVideoEl;

    (async () => {
      Motion.detector = await Motion.createDetector();
    })();
  }

  static motionCreate(canvasEl: HTMLCanvasElement, drawVideoEl: HTMLVideoElement, options?: CanvasStyles): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.instance) {
        Motion.instance = new Motion(canvasEl, drawVideoEl, options);
        resolve();
        return;
      }
      console.error("%c   already Instance", "color: red");
      reject();
    });
  }

  static get getInstanceOrNull() {
    if (Motion.instance) {
      return Motion.instance;
    }
    console.error("%c   empty Instance", "color: red");
    return null;
  }

  static async motionStart() {
    Motion.renderLines();
    Motion.requestAnimationId = requestAnimationFrame(() => Motion.motionStart());
  }

  static motionStop() {
    tf.dispose();
    Motion.clearCtx();
    Motion.ctx.clearRect(0, 0, 680, 480);
    cancelAnimationFrame(Motion.requestAnimationId);
    // Motion.instance = null;
    Signaling.emitEvent("stop-motion");
  }

  /**
   * @param Motion 켠 상대의 poses 데이터
   * @description Event 클래스에서 socket.on("pose") 데이터 받아와 추가.
   */
  static async pushRemotePoses(poses: poseDetection.Pose[]) {
    Motion.draw(Motion.drawVideoEl, poses);
  }

  private static async createDetector() {
    // Todo: 없어도 되는지 테스트 해보기
    await tf.ready();

    const modelType = poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING;
    const modelConfig = {
      modelType,
      inputResolution: { width: Motion.videoWidth, height: Motion.videoHeight },
    };
    return poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, modelConfig);
  }

  /** 본인 Pose 데이터 */
  private static async renderLines() {
    if (Motion.instance && Motion.drawVideoEl) {
      const poses = await Motion.detector?.estimatePoses(Motion.drawVideoEl);
      Motion.draw(Motion.drawVideoEl, poses);
      Signaling.emitEvent("pose", poses);
    }
  }

  private static checkEmptyPosesAndDraw(poses: any) {
    if (poses && Object.keys(poses).length > 0) {
      Motion.drawResults(poses);
    }
  }

  private static draw(video: HTMLVideoElement, poses: any) {
    Motion.drawCtx(video);
    Motion.checkEmptyPosesAndDraw(poses);
  }

  private static drawCtx(video: HTMLVideoElement) {
    if (video) {
      Motion.ctx.drawImage(video, 0, 0, 680, 480);
    }
  }

  private static clearCtx() {
    Motion.ctx.clearRect(0, 0, Motion.videoWidth, Motion.videoHeight);
  }

  private static drawResults(poses: poseDetection.Pose[]) {
    for (const pose of poses) {
      Motion.drawResult(pose);
    }
  }

  private static drawResult(pose: poseDetection.Pose) {
    if (pose.keypoints != null) {
      Motion.drawKeypoints(pose.keypoints);
      Motion.drawSkeleton(pose.keypoints);
    }
  }

  private static drawKeypoints(keypoints: poseDetection.Keypoint[]) {
    const keypointInd = poseDetection.util.getKeypointIndexBySide(poseDetection.SupportedModels.MoveNet);

    for (const i of keypointInd.middle) {
      Motion.drawKeypoint(keypoints[i]);
    }

    for (const i of keypointInd.left) {
      Motion.drawKeypoint(keypoints[i]);
    }

    for (const i of keypointInd.right) {
      Motion.drawKeypoint(keypoints[i]);
    }
  }

  private static drawKeypoint(keypoint: poseDetection.Keypoint) {
    const score = keypoint.score != null ? keypoint.score : 1;

    if (score >= 0.5) {
      const circle = new Path2D();
      circle.arc(keypoint.x, keypoint.y, 10, 0, 2 * Math.PI);
      Motion.ctx.fill(circle);
      Motion.ctx.stroke(circle);
    }
  }

  private static drawSkeleton(keypoints: poseDetection.Keypoint[]) {
    poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.MoveNet).forEach(([i, j]) => {
      const kp1 = keypoints[i];
      const kp2 = keypoints[j];

      const score1 = kp1.score != null ? kp1.score : 1;
      const score2 = kp2.score != null ? kp2.score : 1;
      const scoreThreshold = 0.5;

      if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
        Motion.ctx.beginPath();
        Motion.ctx.moveTo(kp1.x, kp1.y);
        Motion.ctx.lineTo(kp2.x, kp2.y);
        Motion.ctx.stroke();
      }
    });
  }
}
