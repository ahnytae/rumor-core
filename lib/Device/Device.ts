import Signaling from "../Signaling/Signaling";
import { DeviceType } from "./types";

export default class Device {
  private constraints: MediaStreamConstraints | { video: false; audio: false };
  private stream: MediaStream | null;
  private videoEl: HTMLVideoElement;

  constructor(videoEl: HTMLVideoElement, constraints: MediaStreamConstraints) {
    this.stream = null;
    this.videoEl = videoEl;
    this.constraints = constraints;
  }

  // Todo: local device on/off ==> 장치설정에 필요할듯
  onToggleVideoAndAudio(deviceType: DeviceType, status: boolean) {
    const tracks = this.stream?.getTracks();

    if (deviceType === "video") {
      try {
        const videoTrack = tracks?.find((track) => track.kind === "video");
        if (videoTrack) {
          videoTrack.enabled = status;
        }
      } catch {
        console.error("%c   failed switch video", "color: red");
      }
      return;
    }
    // audio
    try {
      const audioTrack = tracks?.find((track) => track.kind === "audio");
      console.log(audioTrack);

      if (audioTrack) {
        audioTrack.enabled = status;
      }
    } catch {
      console.error("%c   failed mute audio", "color: red");
    }
  }

  async getDeviceEnumerate(): Promise<MediaDeviceInfo[] | undefined> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      // return this.removeDuplicatedDeviceList(devices);
      return devices;
    } catch (e) {
      if (e instanceof DOMException) {
        console.error("DOMException occurred:", e.name, e.message);
      }
      console.error("An error occurred:", e);
    }
  }

  async attachStreamToLocalVideo(newConstraints?: MediaStreamConstraints): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia(newConstraints || this.constraints);
      this.videoEl.srcObject = this.stream;
    } catch (e) {
      if (e instanceof DOMException) {
        console.error("DOMException occurred:", e.name, e.message);
        return;
      }
      console.error("An error occurred:", e);
    }
  }

  remoteAttachStreamToVideo(remoteVideoEl: HTMLVideoElement) {
    if (!this.stream) {
      console.error("invalid stream");
      return;
    }
    Signaling.remoteAttachStreamToVideo(remoteVideoEl, this.stream);
  }

  async onOffDeviceHandler(type: DeviceType, status: boolean) {
    if (type === "video") {
      this.stream?.getVideoTracks().forEach((videoTrack: MediaStreamTrack) => (videoTrack.enabled = status));
      return;
    }
    this.stream?.getAudioTracks().forEach((audioTrack: MediaStreamTrack) => (audioTrack.enabled = status));
  }

  async onChangeDevice(deviceId: string, type: DeviceType) {
    const pickVideoOrAudioConstraints = type === "video" ? { video: { deviceId: { exact: deviceId } } } : { audio: { deviceId: { exact: deviceId } } };
    this.constraints = { ...this.constraints, ...pickVideoOrAudioConstraints };
    await this.attachStreamToLocalVideo(this.constraints);
    this.onMediaTrackSender(type); // sender 이용한 remote 변경
  }

  private onMediaTrackSender(type: DeviceType) {
    if (!this.stream) return;

    if (type === "video") {
      const [videoTrack] = this.stream.getVideoTracks();
      Signaling.deviceSender("video", videoTrack);
      return;
    }
    //auido
    const [audioTrack] = this.stream.getAudioTracks();
    Signaling.deviceSender("audio", audioTrack);
  }

  // Todo: 의미있게 장치중복 제거 찾아보기 --> video, audioinput, audiooutput으로 필터하기
  private removeDuplicatedDeviceList(devices: MediaDeviceInfo[]) {
    const uniqueDevices: MediaDeviceInfo[] = [];
    const deviceIdsSeen: Set<string> = new Set();

    for (const device of devices) {
      if (!deviceIdsSeen.has(device.kind)) {
        uniqueDevices.push(device);
        deviceIdsSeen.add(device.kind);
      }
    }

    return uniqueDevices;
  }

  get getStream() {
    return this.stream;
  }
}
