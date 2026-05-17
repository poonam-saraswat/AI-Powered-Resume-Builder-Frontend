import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  htmlTemplate: string;
  isSample?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TemplateService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/templates`;

  list(): Observable<Template[]> { return this.http.get<Template[]>(this.base); }
  samples(): Observable<Template[]> { return this.http.get<Template[]>(`${this.base}/samples`); }
  get(id: string): Observable<Template> { return this.http.get<Template>(`${this.base}/${id}`); }
  create(t: Partial<Template>): Observable<Template> { return this.http.post<Template>(this.base, t); }
}
