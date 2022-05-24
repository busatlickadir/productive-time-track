import { TimeEntryAttributes } from "./time-entry-attributes.model";
import { TimeEntryRelationships } from "./time-entry-relationships.model";

export class Base {
  public id: string;
  public type: string;
  public name: string;
  public data: Base;
  public attributes: TimeEntryAttributes;
  public relationships: TimeEntryRelationships;

  constructor(
    id: string = '',
    type: string = '',
    name: string = '',
    attributes: TimeEntryAttributes = null,
    relationships: TimeEntryRelationships = null,
    data: Base = null
  ) {
    this.id = id;
    this.type = type;
    this.name = name;
    this.attributes = attributes;
    this.relationships = relationships;
    this.data = data;
  }
}
