import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="fade-in">
    <h1>Job Match</h1>
    <p class="text-soft" style="margin-top:6px">Live jobs from LinkedIn & Naukri, ranked by your resume fit.</p>

    <div class="card" style="margin-top:24px">
      <div class="grid" style="grid-template-columns: 2fr 1fr 1fr auto; gap:12px; align-items:end">
        <div><label class="label">Job title</label><input class="input" [(ngModel)]="title" placeholder="e.g. Frontend Engineer" /></div>
        <div><label class="label">Location</label><input class="input" [(ngModel)]="location" placeholder="e.g. Remote, Bangalore" /></div>
        <div><label class="label">Resume</label>
          <select class="select" [(ngModel)]="resumeId">
            <option value="">— Select —</option>
            <option *ngFor="let r of resumes()" [value]="r.id">{{ r.title }}</option>
          </select>
        </div>
        <button class="btn btn-primary" (click)="search()" [disabled]="loading()">{{ loading() ? 'Searching…' : 'Search' }}</button>
      </div>
    </div>

    <div *ngIf="jobs().length" style="margin-top:24px; display:flex; flex-direction:column; gap:12px">
      <div *ngFor="let j of jobs()" class="card job">
        <div class="flex justify-between items-center" style="gap:16px;">
          <div class="flex-1">
            <div style="font-weight:600; font-size:16px">{{ j.title }}</div>
            <div class="text-sm text-soft">{{ j.company }} · {{ j.location }}</div>
            <div class="flex gap-2" style="margin-top:8px">
              <span class="tag">{{ j.source || 'LinkedIn' }}</span>
              <span class="tag tag-blue" *ngIf="j.matchScore">Match {{ j.matchScore }}%</span>
            </div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" (click)="bookmark(j)">★ Save</button>
            <a [href]="j.url" target="_blank" class="btn btn-primary btn-sm">Apply →</a>
          </div>
        </div>
      </div>
    </div>

    <div *ngIf="!loading() && jobs().length === 0" class="card" style="text-align:center; margin-top:24px; padding:48px;">
      <div style="font-size:32px">💼</div>
      <h3 style="margin-top:8px">No results yet</h3>
      <p class="text-soft">Search a role to see matching jobs.</p>
    </div>
  </div>
  `,
  styles: [`
    .job { transition: transform 120ms; }
    .job:hover { transform: translateY(-2px); }
  `]
})
export class JobsComponent implements OnInit {
  private api = inject(ApiService);
  title = ''; location = ''; resumeId = '';
  loading = signal(false);
  jobs = signal<any[]>([]);
  resumes = signal<any[]>([]);

  ngOnInit() {
    this.api.listResumes().subscribe({ next: r => this.resumes.set(r || []) });
  }

  search() {
    this.loading.set(true);
    this.api.searchJobs({ title: this.title, location: this.location, resumeId: this.resumeId || null }).subscribe({
      next: (j) => { this.jobs.set(j || []); this.loading.set(false); },
      error: () => { this.loading.set(false); alert('Job search failed.'); }
    });
  }

  bookmark(j: any) {
    this.api.bookmarkJob(j.id).subscribe({ next: () => alert('Saved.') });
  }
}
