type Role = "manager" | "attendee";
type UserInfo = {
    userId: string;
    userName: string;
    role: Role;
    attendeeTime: Date;
};
interface IUser {
    userName: string;
    role: Role;
}
export type { Role, UserInfo, IUser };
