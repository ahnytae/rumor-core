import { io, Socket } from "socket.io-client";
import { isAnyStringParamEmpty } from "../utils";
import { DeviceType } from "../Device/types";

export default class Signaling {
  private static ws: Socket;
  private static instance: Signaling | null;
  private static STUN_URL = {
    iceServers: [
      {
        urls: "stun:stun.relay.metered.ca:80",
      },
      {
        urls: "turn:a.relay.metered.ca:80",
        username: "a8496d17af70b75b2ba4e2cc",
        credential: "9sRaUU0pVxwjLQsX",
      },
      {
        urls: "turn:a.relay.metered.ca:80?transport=tcp",
        username: "a8496d17af70b75b2ba4e2cc",
        credential: "9sRaUU0pVxwjLQsX",
      },
      {
        urls: "turn:a.relay.metered.ca:443",
        username: "a8496d17af70b75b2ba4e2cc",
        credential: "9sRaUU0pVxwjLQsX",
      },
      {
        urls: "turn:a.relay.metered.ca:443?transport=tcp",
        username: "a8496d17af70b75b2ba4e2cc",
        credential: "9sRaUU0pVxwjLQsX",
      },
    ],
  };
  private static peerConnection: RTCPeerConnection;

  private static roomName: string;

  private constructor(signalingEndpoint: string) {
    const isPass = isAnyStringParamEmpty(signalingEndpoint);
    if (isPass) {
      console.error("%c   invalid Signaling Endpoint", "color: red");
      return;
    }

    Signaling.ws = io(signalingEndpoint);

    console.log("%c HELLO ColdBrew", "color: hotpink; font-size:40px; background:black");
  }

  // emit
  static emitEvent(event: string, ...args: any) {
    Signaling.ws.emit(event, ...args);
  }

  static onEvent(event: string, callbackFn: (...args: any) => any) {
    Signaling.ws.on(event, callbackFn);
  }

  static offEvent(event: string) {
    Signaling.ws.off(event);
  }

  static createInstance() {
    if (!Signaling.instance) {
      Signaling.instance = new Signaling("https://www.sesac500.site");
      return;
    }
    console.error("%c   already Instance", "color: red");
  }

  static get getInstance() {
    return Signaling.instance;
  }

  static leaveSocket() {
    Signaling.ws.emit("left");
  }

  static connectSocket() {
    if (!Signaling.ws) {
      console.error("%c   invalid Socket Instance", "color: red");
      return;
    }

    Signaling.peerConnection = new RTCPeerConnection(Signaling.STUN_URL);
    // role: offer
    Signaling.ws.on("success-join", async () => {
      console.log("%c   success join", "color: #f3602b");

      // create offer + sdp
      const offer = await Signaling.peerConnection.createOffer();
      Signaling.peerConnection.setLocalDescription(offer);

      // send offer
      Signaling.ws.emit("offer", offer, Signaling.roomName);
      console.log("%c   sent offer", "color: #e64607bc", offer);

      Signaling.ws.on("answer", async (answer: RTCSessionDescriptionInit) => {
        console.log("created offer", answer);

        await Signaling.peerConnection.setRemoteDescription(answer);
        console.log("%c   received answer", "color: #e64607bc", answer);
      });
    });

    // role: answer
    Signaling.ws.on("offer", async (offer: RTCSessionDescriptionInit) => {
      console.log("answer offer", offer);

      await Signaling.peerConnection?.setRemoteDescription(offer);
      console.log("%c   received offer", offer, "color: #05c088");

      const answer = await Signaling.peerConnection.createAnswer();
      Signaling.peerConnection.setLocalDescription(answer);
      Signaling.ws.emit("answer", answer, Signaling.roomName);
      console.log("%c   sent answer", "color: #e64607bc", answer);
    });

    Signaling.ws.on("icecandidate", (ice: RTCIceCandidateInit) => {
      console.log("%c   received icecandidate", "color: #d3d61e", ice);
      Signaling.peerConnection.addIceCandidate(ice);
    });
  }

  static remoteAttachStreamToVideo(remoteVideoEl: HTMLVideoElement, stream: MediaStream) {
    this.createPeerConnection(remoteVideoEl, stream);
  }

  static deviceSender(type: DeviceType, mediaStreamTrack: MediaStreamTrack) {
    const senderKind = type === "video" ? "video" : "audio";
    const sender = Signaling.peerConnection?.getSenders().find((sender) => sender.track?.kind === senderKind);

    if (sender) {
      sender.replaceTrack(mediaStreamTrack);
      console.log(`%c   changed ${type}`, "color: orangered");
      return;
    }
    console.log(`%c   No ${type} sender found`, "color: gray");
  }

  private static createPeerConnection(remoteVideoEl: HTMLVideoElement, stream: MediaStream) {
    Signaling.peerConnection.addEventListener("icecandidate", (ice: RTCPeerConnectionIceEvent) => {
      console.log("%c sent icecandidate", "%color: red", ice);
      Signaling.ws.emit("ice", ice.candidate, Signaling.roomName);
    });
    Signaling.peerConnection.addEventListener("track", (peerTrack: RTCTrackEvent) => {
      console.log("got remote peer stream", peerTrack.streams[0]);
      remoteVideoEl.srcObject = peerTrack.streams[0];
    });

    stream.getTracks().map((track: MediaStreamTrack) => Signaling.peerConnection.addTrack(track, stream));
  }
}
