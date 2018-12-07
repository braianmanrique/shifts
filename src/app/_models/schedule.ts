import { Location, Person } from './index';

export class Schedule{
  constructor(
    public _id: string,
    public active: boolean,
    public month: number,
    public day: number,
    public year: number,
    public initHour: number,
    public duration: number,
    public creationDate: Date,
    public creationUsername: string,
    public modificationDate: Date,
    public modificationUsername: string,
    public person: Person,
    public location: Location
  ){

  }
}
