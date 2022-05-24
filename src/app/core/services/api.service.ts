import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MainModel } from '../models/main.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  headers = new HttpHeaders({
    'Content-Type': 'application/vnd.api+json',
    'X-Auth-Token': environment.authToken,
    'X-Organization-Id': environment.organizationId,
  });
  params = new HttpParams();
  options = {
    headers: this.headers,
    params: this.params,
  };

  constructor(private http: HttpClient) { }

  getEntries(endpoint: string) {
    let currentDate = new DatePipe('en-US').transform(Date.now(), 'y-MM-d');
    let params = new HttpParams()
      .set('filter[person_id]', '271716')
      .set('filter[before]', currentDate)
      .set('filter[after]', currentDate);
    this.options.params = params;
    return this.http.get<MainModel>(
      `${environment.apiUrl}` + endpoint,
      this.options
    );
  }
  getServices(endpoint: string, project_id: any) {
    let params = new HttpParams().set('filter[project_id]', project_id);
    this.options.params = params;
    return this.http.get<MainModel>(
      `${environment.apiUrl}` + endpoint,
      this.options
    );
  }
  get(endpoint: string) {
    this.options.params = new HttpParams();
    return this.http.get<MainModel>(
      `${environment.apiUrl}` + endpoint,
      this.options
    );
  }
  save(endpoint: string, data: any) {
    this.options.params = new HttpParams();
    return this.http.post(
      `${environment.apiUrl}` + endpoint,
      data,
      this.options
    );
  }
  update(endpoint: string, data: any) {
    this.options.params = new HttpParams();
    return this.http.patch(
      `${environment.apiUrl}` + endpoint + '/' + data.data.id,
      data,
      this.options
    );
  }
  delete(endpoint: string, id: string) {
    this.options.params = new HttpParams();
    return this.http.delete<MainModel>(
      `${environment.apiUrl}` + endpoint + `/${id}`,
      this.options
    );
  }
}
