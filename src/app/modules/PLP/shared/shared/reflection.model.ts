export class ReflectionModel {

  UserNotes: String;
  UpdatedTimeStamp: String;
  Today: String;

  constructor() {
    this.UpdatedTimeStamp = "";
    this.UserNotes = "";
    this.Today = "";
  }
}

export class ReflectionPostModel {

  UserNotes: String;
  UpdatedTimeStamp: Date;
  Today: Date;

  constructor() {
    this.UpdatedTimeStamp = new Date;
    this.UserNotes = "";
    this.Today = new Date;
  }
}