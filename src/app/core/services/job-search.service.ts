import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface JobSearchResult {
  externalId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  applyUrl: string;
  employmentType: string;
  postedAt: string;
  source: string;
  companyLogo: string;
  salary: string;
}

@Injectable({ providedIn: 'root' })
export class JobSearchService {
  private base = 'http://localhost:8080/api/jobs';

  constructor(private http: HttpClient) {}

  search(query: string, location = '', page = 1): Observable<JobSearchResult[]> {
    const params = new HttpParams()
      .set('query', query)
      .set('location', location)
      .set('page', String(page));
    const token = localStorage.getItem('jwt') || localStorage.getItem('accessToken') || '';
    return this.http.get<JobSearchResult[]>(`${this.base}/search`, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }
}
