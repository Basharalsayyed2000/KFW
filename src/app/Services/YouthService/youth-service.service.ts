import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YouthServiceService {
  private apiUrl = 'http://localhost:3000/youth';
  private youthDbUrl = 'assets/data/youthdb.json';

  constructor(private http: HttpClient) {}


  submitFormData(formData: any): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }

  getAllYouth(): Observable<any[]> {
    return this.http.get<any[]>(this.youthDbUrl);
  }


  getYouthById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }


  updateYouth(id: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedData);
  }


  deleteYouth(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateYouthStatus(id: number, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }
  updateYouthCategoryJob(id: number, payload: any): Observable<any> {
    return this.http.patch(`http://localhost:3000/youth/${id}/jobCategory`, payload);
  }
  checkPersonalRegistrationNumber(personalRegistrationNumber: string): Observable<{ inUse: boolean; message: string }> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) => {
        const isInUse = data.some(entry => entry.personalRegistrationNumber === personalRegistrationNumber);
        return {
          inUse: isInUse,
          message: isInUse ? 'This registration number is already taken.' : ''
        };
      })
    );
  }
  updateYouthNotes(id: number, notes: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/notes`, { notes });
  }

  getYouthNotesById(id: number): Observable<{ notes: string }> {
    return this.http.get<{ notes: string }>(`${this.apiUrl}/${id}/notes`);
  }
}
