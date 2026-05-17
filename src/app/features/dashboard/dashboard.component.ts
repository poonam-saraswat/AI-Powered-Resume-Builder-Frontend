import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="fade-in">
    <div class="header-row">
      <div>
        <div class="text-sm text-muted">Workspace · {{ greeting() }}</div>
        <!-- ✅ Fixed: use firstName() getter instead of inline null checks -->
        <h1>Hi {{ firstName() }} 👋</h1>
        <p class="text-soft" style="margin-top:6px">Pick up where you left off, or start something new.</p>
      </div>
      <a routerLink="/app/resumes" class="btn btn-primary btn-lg">+ New resume</a>
    </div>

    <div class="grid grid-4" style="margin-top:32px">
      <div class="stat card">
        <div class="text-xs text-muted">Resumes</div>
        <div class="stat-num">{{ resumes().length }}</div>
        <div class="tag tag-blue">{{ auth.isPremium() ? 'Unlimited' : (resumes().length + '/3') }}</div>
      </div>
      <div class="stat card">
        <div class="text-xs text-muted">AI calls used</div>
        <div class="stat-num">{{ aiCount() }}</div>
        <div class="tag tag-purple">{{ auth.isPremium() ? 'Unlimited' : '5/month' }}</div>
      </div>
      <div class="stat card">
        <div class="text-xs text-muted">Best ATS score</div>
        <div class="stat-num">{{ bestAts() }}<span class="text-muted text-sm">/100</span></div>
        <div class="tag tag-green">Optimized</div>
      </div>
      <div class="stat card">
        <div class="text-xs text-muted">Job matches</div>
        <div class="stat-num">{{ jobCount() }}</div>
        <a routerLink="/app/jobs" class="tag tag-orange" style="cursor:pointer">View →</a>
      </div>
    </div>

    <div class="grid" style="grid-template-columns: 2fr 1fr; margin-top:32px; gap:24px;">
      <div>
        <div class="section-h">
          <h3>Recent resumes</h3>
          <a routerLink="/app/resumes" class="text-sm text-soft">See all →</a>
        </div>
        <div *ngIf="loading()" class="card pulse">Loading…</div>
        <div *ngIf="!loading() && resumes().length === 0" class="empty card">
          <div style="font-size:32px">📄</div>
          <h3 style="margin-top:8px">No resumes yet</h3>
          <p class="text-soft">Pick a template to start your first resume.</p>
          <a routerLink="/templates" class="btn btn-outline" style="margin-top:12px">Browse templates</a>
        </div>
        <div class="resume-list">
          <a *ngFor="let r of resumes().slice(0,5)" [routerLink]="['/app/resumes', r.id]" class="resume-row card">
            <div class="r-icon">📄</div>
            <div class="flex-1">
              <div style="font-weight:600">{{ r.title || 'Untitled resume' }}</div>
              <div class="text-xs text-muted">Updated {{ r.updatedAt | date:'MMM d, y' }}</div>
            </div>
            <div class="tag" *ngIf="r.atsScore">ATS {{ r.atsScore }}</div>
            <div class="tag tag-purple" *ngIf="r.published">Public</div>
          </a>
        </div>
      </div>

      <div>
        <div class="section-h"><h3>Quick actions</h3></div>
        <div class="qa card">
          <a routerLink="/templates" class="qa-item"><span class="emoji">🎨</span> Browse templates</a>
          <a routerLink="/app/jobs" class="qa-item"><span class="emoji">💼</span> Find matching jobs</a>
          <a routerLink="/app/ai-history" class="qa-item"><span class="emoji">🤖</span> Review AI history</a>
          <a routerLink="/app/settings" class="qa-item"><span class="emoji">⚙️</span> Account settings</a>
        </div>

        <div class="card" *ngIf="!auth.isPremium()" style="margin-top:16px; background: linear-gradient(135deg, #fbf9ff, #f0eaf6); border-color: var(--purple);">
          <div class="tag tag-purple">⭐ Premium</div>
          <h3 style="margin-top:8px">Unlock everything</h3>
          <p class="text-soft text-sm">Unlimited resumes, AI calls, and live job matching.</p>
          <button class="btn btn-primary" style="margin-top:12px; width:100%; justify-content:center;">Upgrade now</button>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
    .header-row { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap; }
    .stat { display:flex; flex-direction:column; gap:8px; }
    .stat-num { font-size: 28px; font-weight: 700; }
    .section-h { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
    .resume-list { display:flex; flex-direction:column; gap:8px; }
    .resume-row { display:flex; align-items:center; gap:12px; padding:14px 16px; cursor:pointer; }
    .r-icon { width:36px; height:36px; background: var(--bg-hover); border-radius: 8px; display:grid; place-items:center; }
    .empty { text-align:center; padding:40px 20px; }
    .qa { display:flex; flex-direction:column; gap:2px; padding:8px; }
    .qa-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:6px; font-size:14px; }
    .qa-item:hover { background: var(--bg-hover); }
  `]
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  resumes = signal<any[]>([]);
  loading = signal(true);
  aiCount = signal(0);
  jobCount = signal(0);
  bestAts = signal(0);

  ngOnInit() {
    this.api.listResumes().subscribe({
      next: (r) => {
        this.resumes.set(r || []);
        this.bestAts.set(Math.max(0, ...(r || []).map((x: any) => x.atsScore || 0)));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
    this.api.aiHistory().subscribe({ next: (h) => this.aiCount.set((h || []).length), error: () => {} });
    this.api.listBookmarks().subscribe({ next: (b) => this.jobCount.set((b || []).length), error: () => {} });
  }

  greeting() {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  }

  // ✅ Added getter to safely compute first name
  firstName(): string {
    const user = this.auth.user();
    return user?.name?.split(' ')[0] ?? 'there';
  }
}
