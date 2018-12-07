export class Location {
  constructor(
    public _id: string,
    public name: string,
    public creationDate: Date,
    public creationUsername: string,
    public modificationDate: Date,
    public modificationUsername: string
  ) { }
}
