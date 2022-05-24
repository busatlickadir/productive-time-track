import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public setData(data: any) {
    this._data.next(data);
  }
  public getData(): Observable<any> {
    return this._data.asObservable();
  }
}
