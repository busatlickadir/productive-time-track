import { Base } from './base.model';

export class TimeEntryRelationships {
  public project: Base;
  public service: Base;

  constructor(project: Base, service: Base) {
    this.project = project;
    this.service = service;
  }
}
