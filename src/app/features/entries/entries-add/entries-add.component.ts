import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs';
import { Base } from 'src/app/core/models/base.model';
import { MainModel } from 'src/app/core/models/main.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entries-add',
  templateUrl: './entries-add.component.html',
  styleUrls: ['./entries-add.component.css'],
})
export class EntriesAddComponent implements OnInit {
  entryForm: FormGroup;
  projects: Base[];
  services: Base[];
  data: MainModel;
  pipe = new DatePipe('en-US');
  currentDate = this.pipe.transform(Date.now(), 'd MMMM, y');
  @Input()
  items: MainModel;
  @Output() emitformatDataForTable = new EventEmitter<string>();
  isNewEntry: boolean = true;

  constructor(
    private apiService: ApiService,
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private sharedService: SharedService
  ) {
    this.sharedService.getData().subscribe((data) => {
      if (data) {
        this.isNewEntry = false;
        this.entryForm.controls['time'].setValue(data.attributes.time);
        this.entryForm.controls['note'].setValue(data.attributes.note);
        this.entryForm.controls['id'].setValue(data.id);
        this.entryForm.controls['project'].setValue(
          data.relationships.project.data.id
        );
        //load services for selected project and after that selected service
        this.getServices(data.relationships.project.data.id, true, data);
      }
    });
  }
  ngOnChanges() {
    this.data = this.items;
  }
  ngOnInit(): void {
    this.initializeForm();
    this.getProjects();
  }
  formatDataForTable(data: any) {
    this.emitformatDataForTable.emit(data);
  }
  initializeForm() {
    this.entryForm = new FormGroup({
      project: new FormControl(null, Validators.required),
      service: new FormControl(null, Validators.required),
      time: new FormControl(
        0,
        Validators.compose([
          Validators.minLength(1),
          Validators.required,
          Validators.pattern('^[0-9]*$'),
        ])
      ),
      note: new FormControl(''),
      id: new FormControl(null),
    });
  }

  getProjects() {
    this.apiService
      .get('projects')
      .pipe(first())
      .subscribe({
        next: (response: MainModel) => {
          this.projects = response.data;
        },
        error: (err: any) => {},
      });
  }
  getServices(
    project_id: any,
    shouldSelectService: boolean = false,
    data: any = null
  ) {
    this.spinner.show('servicesspinner');
    //clear value in case if user change project
    this.entryForm.controls['service'].setValue(null);
    this.apiService
      .getServices('services', project_id)
      .pipe(first())
      .subscribe({
        next: (response: MainModel) => {
          this.services = response.data;
          this.spinner.hide('servicesspinner');
          if (shouldSelectService) {
            this.entryForm.controls['service'].setValue(
              data.relationships.service.data.id
            );
          }
        },
        error: (err: any) => {},
      });
  }
  onSubmit() {
    this.spinner.show('savingspinner');
    let data = this.prepareDataForSave();
    if (data.data.id) {
      this.apiService
        .update('time_entries', data)
        .pipe(first())
        .subscribe({
          next: (response: any) => {
            //refresh data after succesefull saving
            for (let index = 0; index < this.data.data.length; index++) {
              if (this.data.data[index].id == response.data.id) {
                this.data.data[index] = response.data;
              }
            }
            this.formatDataForTable(this.data);
            //reset form
            this.isNewEntry = true;
            this.entryForm.reset();
            this.spinner.hide('savingspinner');
            this.toastr.success(environment.successSaveMsg, 'Saved');
          },
          error: (err: any) => {},
        });
    } else {
      this.apiService
        .save('time_entries', data)
        .pipe(first())
        .subscribe({
          next: (response: any) => {
            //refresh data after succesefull saving
            this.data.data.unshift(response.data);
            this.formatDataForTable(this.data);

            //reset form
            this.isNewEntry = true;
            this.entryForm.reset();
            this.spinner.hide('savingspinner');
            this.toastr.success(environment.successSaveMsg, 'Saved');
          },
          error: (err: any) => {},
        });
    }
  }

  prepareDataForSave() {
    return {
      data: {
        id: this.entryForm.value.id,
        type: 'time_entries',
        attributes: {
          note: this.entryForm.value.note,
          date: this.currentDate,
          time: this.entryForm.value.time,
        },
        relationships: {
          person: {
            data: {
              type: 'people',
              id: '271716',
            },
          },
          service: {
            data: {
              type: 'services',
              id: this.entryForm.value.service,
            },
          },
          project: {
            data: {
              type: 'projects',
              id: this.entryForm.value.project,
            },
          },
        },
      },
    };
  }
  resetForm() {
    this.isNewEntry = true;
    this.entryForm.reset();
  }
  get form() {
    return this.entryForm.controls;
  }
}
