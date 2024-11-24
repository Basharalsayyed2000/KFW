import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LookupService {

  private lookupUrl = 'assets/lookup.json'; // Update this path if needed
  private areaData: any = {};

  constructor(private http: HttpClient) {}

  getLookupData(): Observable<any> {
    return this.http.get<any>(this.lookupUrl);
  }
  getMajors(): Observable<string[]> {
    return this.http.get<any>('assets/lookup.json').pipe(map((data) => data.majors));
  }
  fetchAreaData(): Observable<any> {
    return this.http.get<any>('assets/lookup.json');
  }

  setAreaData(data: any): void {
    this.areaData = data;
  }

  getAreaOptions(): string[] {
    return Object.keys(this.areaData);
  }

  getAreaData(): any {
    return this.areaData;
  }
}
