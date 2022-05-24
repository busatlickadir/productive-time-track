export class TimeEntryAttributes {
  public time: number;
  public note: string;
  public date: string;
  public id: string;
  public name: string;

  constructor(
    id: string,
    time: number,
    note: string,
    date: string,
    name: string
  ) {
    this.id = id;
    this.time = time;
    this.note = note;
    this.date = date;
    this.name = name;
  }
}
