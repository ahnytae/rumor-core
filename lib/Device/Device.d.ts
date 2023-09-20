import { DeviceType } from "./types";
export default class Device {
    private constraints;
    private stream;
    private videoEl;
    constructor(videoEl: HTMLVideoElement, constraints: MediaStreamConstraints);
    onToggleVideoAndAudio(deviceType: DeviceType, status: boolean): void;
    getDeviceEnumerate(): Promise<MediaDeviceInfo[] | undefined>;
    attachStreamToLocalVideo(newConstraints?: MediaStreamConstraints): Promise<void>;
    remoteAttachStreamToVideo(remoteVideoEl: HTMLVideoElement): void;
    onOffDeviceHandler(type: DeviceType, status: boolean): Promise<void>;
    onChangeDevice(deviceId: string, type: DeviceType): Promise<void>;
    private onMediaTrackSender;
    private removeDuplicatedDeviceList;
    get getStream(): MediaStream | null;
}
