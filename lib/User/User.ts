import { v4 as uuidv4 } from "uuid";
import { IUser, Role, UserInfo } from "./types";

export default class User {
  private userId: string;
  private userName: string;
  private role: Role;
  private attendeeTime: Date;

  constructor(user: IUser) {
    const { userName, role } = user;
    this.userId = uuidv4();
    this.userName = userName;
    this.role = role;
    this.attendeeTime = new Date();
  }

  get getUser(): UserInfo {
    return {
      userId: this.userId,
      userName: this.userName,
      role: this.role,
      attendeeTime: this.attendeeTime,
    };
  }
}
