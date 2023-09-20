import { IUser, UserInfo } from "./types";
export default class User {
    private userId;
    private userName;
    private role;
    private attendeeTime;
    constructor(user: IUser);
    get getUser(): UserInfo;
}
