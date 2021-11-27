import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, observable, retry, tap, throwError } from 'rxjs';
import { IAdmin } from '../interface/i-admin';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private API = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

  constructor(private _httpClient: HttpClient) { }

  public getAdminData() {
    return this._httpClient
      .get<IAdmin[]>(this.API, { params: new HttpParams({}), observe: 'response' })
      .pipe(
        retry(3),
        catchError(this.handleError),
        tap((res) => { })
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknow error!;';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error :${error.error.message}`;
    } else {
      errorMessage = `Error : ${error.status} \nMessage :${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
