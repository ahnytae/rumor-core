import { DeviceType } from "../Device/types";
export default class Signaling {
    private static ws;
    private static instance;
    private static STUN_URL;
    private static peerConnection;
    private static roomName;
    private constructor();
    static emitEvent(event: string, ...args: any): void;
    static onEvent(event: string, callbackFn: (...args: any) => any): void;
    static offEvent(event: string): void;
    static createInstance(): void;
    static get getInstance(): Signaling | null;
    static leaveSocket(): void;
    static connectSocket(): void;
    static remoteAttachStreamToVideo(remoteVideoEl: HTMLVideoElement, stream: MediaStream): void;
    static deviceSender(type: DeviceType, mediaStreamTrack: MediaStreamTrack): void;
    private static createPeerConnection;
}
