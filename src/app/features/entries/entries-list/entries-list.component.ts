import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { first } from 'rxjs';
import { Base } from 'src/app/core/models/base.model';
import { MainModel } from 'src/app/core/models/main.model';
import { ApiService } from 'src/app/core/services/api.service';
import { SharedService } from 'src/app/core/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.css'],
})
export class EntriesListComponent implements OnInit {
  @Input()
  items: MainModel;
  entries: MainModel;
  constructor(
    private apiService: ApiService,
    private spinner: NgxSpinnerService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {}
  ngOnChanges() {
    this.entries = this.items;
  }
  editEntry(entry: Base) {
    Swal.fire({
      title: 'Are you sure ',
      text: 'you want to edit this entry?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, edit it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#ff0000',
    }).then((result) => {
      if (result.value) {
         this.sharedService.setData(entry);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
  deleteEntry(entry: Base) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this entry!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      confirmButtonColor: '#ff0000',
    }).then((result) => {
      if (result.value) {
        this.spinner.show('globalSpinner');
        this.apiService
          .delete('time_entries', entry.id)
          .pipe(first())
          .subscribe({
            next: (response: MainModel) => {
              //remove deleted item using filter instead calling service again
              this.entries.data = this.entries.data.filter(
                (item: Base) => item.id != entry.id
              );
              this.spinner.hide('globalSpinner');
            },
            error: (err: any) => {
              this.spinner.hide('globalSpinner');
            },
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
