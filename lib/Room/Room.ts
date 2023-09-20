import User from "../User/User";
import Signaling from "../Signaling/Signaling";
import Device from "../Device/Device";
import Event from "../Event/Event";

export default class Room {
  private user: User;
  private roomName: string;
  private createdAt: Date;
  private static roomInfo: any;

  constructor(roomName: string, user: User) {
    this.roomName = roomName;
    this.createdAt = new Date();
    this.user = user;

    Signaling.createInstance();
    Event.register();
  }

  joinRoom() {
    const joinData = {
      roomName: this.roomName,
      createdAt: this.createdAt,
      user: this.user?.getUser,
    };

    Signaling.emitEvent("join-room", joinData);

    Signaling.connectSocket();
  }

  leaveRoom(device: Device): void {
    Signaling.leaveSocket();

    device?.getStream?.getVideoTracks()?.forEach((track: MediaStreamTrack) => {
      track.stop();
    });
  }

  static set updateRemoteRoomJoinInfo(data: any) {
    Room.roomInfo = data;
  }

  get getRemoteRoomJoinInfo() {
    return Room.roomInfo;
  }
}
