import { UserInfo } from "../User/types";
type RoomInfo = {
    roomId: string;
    roomName: string;
    createdAt: Date;
    users: UserInfo[];
    joinCount: number;
};
export type { RoomInfo };
