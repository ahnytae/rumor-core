import User from "../User/User";
import Device from "../Device/Device";
export default class Room {
    private user;
    private roomName;
    private createdAt;
    private static roomInfo;
    constructor(roomName: string, user: User);
    joinRoom(): void;
    leaveRoom(device: Device): void;
    static set updateRemoteRoomJoinInfo(data: any);
    get getRemoteRoomJoinInfo(): any;
}
