import { Category, Location, Role } from './index';

export class Person {
  constructor(
    public _id: string,
    public firstname: string,
    public lastname: string,
    public identification: string,
    public email: string,
    public username: string,
    public password: string,
    public phoneNumber: string,
    public occupation: string,
    public active: boolean,
    public creationDate: Date,
    public creationUsername: string,
    public modificationDate: Date,
    public modificationUsername: string,
    public location: Location,
    public category: Category,
    public role: Role
  ) { }

  getFullName() {
    return this.firstname + ' ' + this.lastname;
  }
}
