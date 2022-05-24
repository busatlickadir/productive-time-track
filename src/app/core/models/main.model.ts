import { Base } from "./base.model";

export class MainModel {
  public data: Base[];
  public included: Base[];

  constructor(data:[],included:[]) {
    this.data = data;
    this.included = included;
  }
}
