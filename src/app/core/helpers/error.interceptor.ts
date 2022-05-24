import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}
  generateErrorMessage(err: any) {
    let errString = 'ERROR: ' + err.message + '</br>';
    err?.error?.errors.forEach((e: any, index: any) => {
      let messageNumber = index + 1;
      errString +=
        '</br> Message ' +
        messageNumber +
        ': ' +
        e.status +
        ': ' +
        e.detail +
        '\n';
    });
    return errString;
  }
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.toastr.error(this.generateErrorMessage(err), 'Server error!');
        return throwError(() => new Error(err));
      })
    );
  }
}
