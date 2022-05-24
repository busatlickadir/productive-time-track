import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs';
import { Base } from './core/models/base.model';
import { MainModel } from './core/models/main.model';
import { ApiService } from './core/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  entries: MainModel;
  pipe = new DatePipe('en-US');
  currentDate = this.pipe.transform(Date.now(), 'd MMMM, y');
  currentYear = this.pipe.transform(Date.now(), 'y');
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.spinner.show('loadingspinner');
    this.apiService
      .getEntries('time_entries')
      .pipe(first())
      .subscribe({
        next: (response: MainModel) => {
          this.formatDataForTable(response);
          this.spinner.hide('loadingspinner');
        },
        error: (err: any) => {},
      });
  }
  formatDataForTable(data: MainModel) {
    data.data.forEach((el: Base) => {
      let service = data.included.find(
        (element: Base) => {
          return element.type === 'services';
        }
      )
      el.relationships.service.data.attributes = service.attributes;
      el.relationships.service.data.id = service.id;

      let project = data.included.find((element: Base) => {
        return element.type === 'projects';
      });
      el.relationships.project = {
        data: {
          id:project.id,
          attributes: project.attributes,
        },
      } as Base;
    });
    this.entries = data;
  }
}
