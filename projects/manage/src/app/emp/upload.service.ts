import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}

  public upload(file: File, apiUrl: string): Observable<Object> {
    const url = environment.api + apiUrl;
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('clearFlag', 'true');
    const progress = new Subject<Object>();
    this.http.post(url, formData).subscribe(response => {
      progress.next(response);
    });
    return progress.asObservable();
  }
}
