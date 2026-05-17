import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
  <div class="page fade-in">
    <header class="topbar">
      <div class="container flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2">
          <div class="brand-mark">R</div>
          <div style="font-weight:700">ResumeAI</div>
        </a>
        <div class="flex items-center gap-3">
          <a routerLink="/login" class="btn btn-ghost" *ngIf="!auth.isAuthenticated()">Log in</a>
          <a routerLink="/app/dashboard" class="btn btn-primary" *ngIf="auth.isAuthenticated()">My workspace</a>
        </div>
      </div>
    </header>

    <div class="container" style="padding: 48px 24px;">
      <h1>Resume templates</h1>
      <p class="text-soft" style="margin-top:6px">Pick a starting point. Customize everything.</p>

      <div class="filters">
        <button class="chip" [class.active]="filter() === 'all'" (click)="filter.set('all')">All</button>
        <button class="chip" [class.active]="filter() === 'free'" (click)="filter.set('free')">Free</button>
        <button class="chip" [class.active]="filter() === 'premium'" (click)="filter.set('premium')">Premium</button>
        <button class="chip" [class.active]="filter() === 'sample'" (click)="filter.set('sample')">Samples</button>
        <input class="input" style="margin-left:auto; max-width:240px" placeholder="Search templates..." [(ngModel)]="search" />
      </div>

      <div *ngIf="loading()" class="card pulse">Loading…</div>

      <div class="grid grid-3" style="margin-top:24px">
        <div *ngFor="let t of filtered()" class="card t-card" (click)="use(t)">
          <div class="t-thumb" [style.background]="t.color || '#fbfbfa'">
            <div class="t-mock">
              <div class="t-line" style="width:60%"></div>
              <div class="t-line" style="width:40%; height:4px"></div>
              <div class="t-bar"></div>
              <div class="t-line"></div>
              <div class="t-line"></div>
              <div class="t-line" style="width:80%"></div>
            </div>
          </div>
          <div class="flex justify-between items-center" style="padding:12px 4px 4px;">
            <div>
              <div style="font-weight:600">
                {{ t.name }}
                <span *ngIf="t.isSample" class="tag tag-sample" style="margin-left:6px">Sample</span>
              </div>
              <div class="text-xs text-muted">{{ t.category || 'Modern' }}</div>
            </div>
            <span class="tag" [class.tag-purple]="t.plan === 'PREMIUM'">{{ t.plan === 'PREMIUM' ? 'Premium' : 'Free' }}</span>
          </div>
        </div>
      </div>

      <div *ngIf="!loading() && filtered().length === 0" class="card" style="margin-top:24px; text-align:center; padding:32px;">
        No templates match your filters.
      </div>
    </div>
  </div>
  `,
  styles: [`
    .topbar { padding: 14px 0; border-bottom:1px solid var(--border); background:#fff; }
    .brand-mark { width:28px; height:28px; border-radius:7px; background:linear-gradient(135deg,#37352f,#6940a5); color:#fff; display:grid; place-items:center; font-weight:700; }
    .filters { display:flex; align-items:center; gap:8px; margin-top:24px; flex-wrap:wrap; }
    .chip { padding:6px 14px; border-radius:999px; background:var(--bg-hover); font-size:13px; font-weight:500; color:var(--text-soft); }
    .chip.active { background: var(--text); color:#fff; }
    .t-card { padding:12px; cursor:pointer; transition: transform .15s ease, box-shadow .15s ease; }
    .t-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md, 0 6px 20px rgba(0,0,0,.08)); }
    .t-thumb { aspect-ratio: 4/5; border-radius:6px; padding:24px; display:flex; align-items:flex-start; justify-content:center; }
    .t-mock { background:#fff; width:100%; height:100%; padding:16px; border-radius:4px; display:flex; flex-direction:column; gap:6px; box-shadow: var(--shadow-sm); }
    .t-line { height:6px; background: #e9e9e7; border-radius:2px; width:100%; }
    .t-bar { height:2px; background: var(--text); margin: 8px 0 4px; width: 30%; }
    .tag-sample { background:#eef6ff; color:#1d4ed8; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:600; }
  `]
})
export class TemplatesComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);
  auth = inject(AuthService);
  templates = signal<any[]>([]);
  loading = signal(true);
  filter = signal<'all' | 'free' | 'premium' | 'sample'>('all');
  search = '';

  ngOnInit() {
    // Load samples (public) + user templates (if any) in parallel.
    forkJoin({
      samples: this.api.listSampleTemplates().pipe(catchError(() => of([] as any[]))),
      user: this.api.listTemplates().pipe(catchError(() => of([] as any[])))
    }).subscribe(({ samples, user }) => {
      const merged = [
        ...(samples || []).map(s => ({ ...s, isSample: true })),
        ...(user || []).filter(u => !(samples || []).some(s => s.id === u.id))
      ];
      this.templates.set(merged.length ? merged : this.fallback());
      this.loading.set(false);
    });
  }

  fallback() {
    const colors = ['#fbe7d4', '#e7f3fb', '#f0eaf6', '#e0f3ee', '#fef0f0', '#fff8d6', '#fbf9ff', '#f3f3f1'];
    const names = ['Modern Minimal','Classic Pro','Creative Bold','Executive','Tech Forward','Academic','Startup','Designer'];
    return names.map((n, i) => ({
      id: 'tpl-' + i, name: n, category: i % 2 ? 'Classic' : 'Modern',
      plan: i > 4 ? 'PREMIUM' : 'FREE', color: colors[i], isSample: true
    }));
  }

  filtered() {
    const q = this.search.toLowerCase();
    return this.templates().filter(t => {
      if (this.filter() === 'free' && t.plan !== 'FREE') return false;
      if (this.filter() === 'premium' && t.plan !== 'PREMIUM') return false;
      if (this.filter() === 'sample' && !t.isSample) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  use(t: any) {
    if (t.plan === 'PREMIUM' && !this.auth.isPremium()) { alert('Upgrade to Premium to use this template.'); return; }
    if (!this.auth.isAuthenticated()) { this.router.navigate(['/register']); return; }
    this.api.createResume({ title: t.name + ' Resume', templateId: t.id }).subscribe({
      next: (r) => this.router.navigate(['/app/resumes', r.id])
    });
  }
}
