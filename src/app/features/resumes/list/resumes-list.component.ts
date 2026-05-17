import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-resumes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <div class="fade-in">
    <div class="flex justify-between items-center" style="flex-wrap:wrap; gap:16px;">
      <div>
        <h1>My resumes</h1>
        <p class="text-soft" style="margin-top:6px">{{ resumes().length }} resumes in your workspace</p>
      </div>
      <div class="flex gap-2">
        <input class="input" style="width:240px" placeholder="🔍 Search..." [(ngModel)]="search" />
        <button class="btn btn-primary" (click)="createNew()">+ New resume</button>
      </div>
    </div>

    <div *ngIf="loading()" class="card pulse" style="margin-top:24px">Loading…</div>

    <div *ngIf="!loading()" class="grid grid-3" style="margin-top:24px">
      <div *ngFor="let r of filtered()" class="card resume-card" [routerLink]="['/app/resumes', r.id]">
        <div class="thumb"><div class="thumb-page">📄</div></div>
        <div style="padding:14px 4px 4px;">
          <div style="font-weight:600">{{ r.title || 'Untitled' }}</div>
          <div class="text-xs text-muted">Edited {{ r.updatedAt | date:'MMM d' }}</div>
          <div class="flex gap-2" style="margin-top:8px">
            <span class="tag" *ngIf="r.atsScore">ATS {{ r.atsScore }}</span>
            <span class="tag tag-purple" *ngIf="r.published">Public</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-ghost btn-sm" (click)="duplicate($event, r.id)">⎘</button>
          <button class="btn btn-ghost btn-sm btn-danger" (click)="remove($event, r.id)">🗑</button>
        </div>
      </div>

      <div class="card resume-card create" (click)="createNew()" *ngIf="filtered().length < 12">
        <div class="thumb thumb-empty">+</div>
        <div style="padding:14px 4px 4px;">
          <div style="font-weight:600">Blank resume</div>
          <div class="text-xs text-muted">Start from scratch</div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .resume-card { padding: 12px; cursor: pointer; position: relative; }
    .thumb { aspect-ratio: 4/5; background: var(--bg-soft); border:1px solid var(--border); border-radius: 6px; display:grid; place-items:center; font-size: 48px; }
    .thumb-page { opacity: 0.4; }
    .thumb-empty { font-size: 36px; color: var(--text-muted); border-style: dashed; }
    .actions { position:absolute; top:18px; right:18px; display:flex; gap:4px; opacity:0; transition: opacity 120ms; }
    .resume-card:hover .actions { opacity: 1; }
    .resume-card.create { border-style:dashed; }
  `]
})
export class ResumesListComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  resumes = signal<any[]>([]);
  loading = signal(true);
  search = '';

  ngOnInit() { this.load(); }
  load() {
    this.api.listResumes().subscribe({
      next: r => { this.resumes.set(r || []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
  filtered() {
    const q = this.search.toLowerCase();
    return this.resumes().filter(r => !q || (r.title || '').toLowerCase().includes(q));
  }
  createNew() {
    this.api.createResume({ title: 'Untitled resume', templateId: null }).subscribe({
      next: (r) => this.router.navigate(['/app/resumes', r.id])
    });
  }
  duplicate(e: Event, id: string) {
    e.stopPropagation();
    this.api.duplicateResume(id).subscribe({ next: () => this.load() });
  }
  remove(e: Event, id: string) {
    e.stopPropagation();
    if (!confirm('Delete this resume?')) return;
    this.api.deleteResume(id).subscribe({ next: () => this.load() });
  }
}
