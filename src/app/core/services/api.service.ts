import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;
  constructor(private http: HttpClient) {}

  // Resumes
  listResumes() { return this.http.get<any[]>(`${this.base}/resumes`); }
  getResume(id: string) { return this.http.get<any>(`${this.base}/resumes/${id}`); }
  createResume(data: any) { return this.http.post<any>(`${this.base}/resumes`, data); }
  updateResume(id: string, data: any) { return this.http.put<any>(`${this.base}/resumes/${id}`, data); }
  deleteResume(id: string) { return this.http.delete(`${this.base}/resumes/${id}`); }
  duplicateResume(id: string) { return this.http.post<any>(`${this.base}/resumes/${id}/duplicate`, {}); }
  publishResume(id: string, publish: boolean) { return this.http.post(`${this.base}/resumes/${id}/publish`, { publish }); }

  // Sections
  addSection(resumeId: string, section: any) { return this.http.post<any>(`${this.base}/resumes/${resumeId}/sections`, section); }
  updateSection(resumeId: string, sectionId: string, section: any) { return this.http.put<any>(`${this.base}/resumes/${resumeId}/sections/${sectionId}`, section); }
  deleteSection(resumeId: string, sectionId: string) { return this.http.delete(`${this.base}/resumes/${resumeId}/sections/${sectionId}`); }
  reorderSections(resumeId: string, order: string[]) { return this.http.post(`${this.base}/resumes/${resumeId}/sections/reorder`, { order }); }

  // Templates
  listTemplates() { return this.http.get<any[]>(`${this.base}/templates`); }
  getTemplate(id: string) { return this.http.get<any>(`${this.base}/templates/${id}`); }
  listSampleTemplates() {
  return this.http.get<any[]>(`${this.base}/api/templates/samples`);
}


  // AI
  aiGenerateSummary(payload: any) { return this.http.post<any>(`${this.base}/ai/summary`, payload); }
  aiGenerateBullets(payload: any) { return this.http.post<any>(`${this.base}/ai/bullets`, payload); }
  aiSuggestSkills(payload: any) { return this.http.post<any>(`${this.base}/ai/skills`, payload); }
  aiAtsCheck(payload: any) { return this.http.post<any>(`${this.base}/ai/ats-check`, payload); }
  aiCoverLetter(payload: any) { return this.http.post<any>(`${this.base}/ai/cover-letter`, payload); }
  aiTailorResume(payload: any) { return this.http.post<any>(`${this.base}/ai/tailor`, payload); }
  aiTranslate(payload: any) { return this.http.post<any>(`${this.base}/ai/translate`, payload); }
  aiHistory() { return this.http.get<any[]>(`${this.base}/ai/history`); }

  // Export
  exportResume(resumeId: string, format: 'pdf' | 'docx' | 'json') {
    return this.http.post<any>(`${this.base}/export/${resumeId}`, { format });
  }
  exportStatus(jobId: string) { return this.http.get<any>(`${this.base}/export/status/${jobId}`); }

  // Jobs
  searchJobs(opts: { title?: string; location?: string; resumeId?: string | null; page?: number }) {
    let params = new HttpParams()
      .set('query', opts.title || '')
      .set('location', opts.location || '')
      .set('page', String(opts.page ?? 1));
    if (opts.resumeId) {
      params = params.set('resumeId', opts.resumeId);
    }
    return this.http.get<any[]>(`${this.base}/jobs/search`, { params });
  }

  matchScore(resumeId: string, description: string) {
    return this.http.post<any>(`${this.base}/jobs/match`, { resumeId, description });
  }
  bookmarkJob(jobId: string) { return this.http.post(`${this.base}/jobs/${jobId}/bookmark`, {}); }
  listBookmarks() { return this.http.get<any[]>(`${this.base}/jobs/bookmarks`); }

  // Notifications
  listNotifications() { return this.http.get<any[]>(`${this.base}/notifications`); }
  markRead(id: string) { return this.http.post(`${this.base}/notifications/${id}/read`, {}); }

  // User
  me() { return this.http.get<any>(`${this.base}/users/me`); }
  updateProfile(data: any) { return this.http.put<any>(`${this.base}/users/me`, data); }
  changePassword(data: any) { return this.http.post(`${this.base}/users/me/password`, data); }

  // Admin
  adminUsers() { return this.http.get<any[]>(`${this.base}/users/admin/all`); }
  adminAnalytics() { return this.http.get<any>(`${this.base}/users/admin/analytics`); }
  adminUpdateUser(id: string, data: any) { return this.http.put(`${this.base}/users/admin/${id}`, data); }

  // Billing
  upgrade() { return this.http.post<any>(`${this.base}/billing/upgrade`, {}); }
}
