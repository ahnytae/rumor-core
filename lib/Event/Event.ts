import * as poseDetection from "@tensorflow-models/pose-detection";
import Signaling from "../Signaling/Signaling";
import Motion from "../Motion/Motion";
import Room from "../Room/Room";

export default class Event {
  private static isStartMotion = false;
  private constructor() {}

  // Todo: 이벤트 등록을 위한 메서드 인데 안에 관련 로직 들어가는게 맞을까?
  static async register() {
    // remote 방 입장 정보
    Signaling.onEvent("Room-Info", (data: any) => {
      console.log("$$$ remote Join", data);
      Room.updateRemoteRoomJoinInfo = data;
    });

    Signaling.onEvent("pose", (poses: poseDetection.Pose[]) => {
      if (!Event.isStartMotion) {
        const remoteCanvalEl = document.getElementById("remoteCanvas") as HTMLCanvasElement;
        const remoteVideoEl = document.getElementById("remoteVideo") as HTMLVideoElement;

        Motion.motionCreate(remoteCanvalEl, remoteVideoEl);
        Event.isStartMotion = true;
      }

      Motion.pushRemotePoses(poses as poseDetection.Pose[]);
    });

    Signaling.onEvent("stop-motion", () => {
      Motion.motionStop();
      // Event.isStartMotion = false;
    });
  }
}
