import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <div class="shell">
    <aside class="sidebar">
      <div class="brand" routerLink="/app/dashboard">
        <div class="brand-mark">R</div>
        <div>
          <div class="brand-name">ResumeAI</div>
          <div class="brand-sub">{{ auth.isPremium() ? 'Premium' : 'Free' }} workspace</div>
        </div>
      </div>

      <div class="nav-section">
        <div class="nav-label">Workspace</div>
        <a routerLink="/app/dashboard" routerLinkActive="active" class="nav-item">
          <span class="emoji">🏠</span> Dashboard
        </a>
        <a routerLink="/app/resumes" routerLinkActive="active" class="nav-item">
          <span class="emoji">📄</span> Resumes
        </a>
        <a routerLink="/app/jobs" routerLinkActive="active" class="nav-item">
          <span class="emoji">💼</span> Job Match
        </a>
        <a routerLink="/app/ai-history" routerLinkActive="active" class="nav-item">
          <span class="emoji">🤖</span> AI History
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-label">Account</div>
        <a routerLink="/app/settings" routerLinkActive="active" class="nav-item">
          <span class="emoji">⚙️</span> Settings
        </a>
        <a *ngIf="auth.isAdmin()" routerLink="/app/admin" routerLinkActive="active" class="nav-item">
          <span class="emoji">🛡️</span> Admin
        </a>
        <a routerLink="/templates" class="nav-item">
          <span class="emoji">🎨</span> Templates
        </a>
      </div>

      <div class="user-card">
        <div class="avatar">{{ initials() }}</div>
        <div class="flex-1">
          <div class="text-sm" style="font-weight:600">{{ auth.user()?.name || auth.user()?.email }}</div>
          <div class="text-xs text-soft">{{ auth.user()?.email }}</div>
        </div>
        <button class="btn btn-ghost btn-sm" (click)="auth.logout()">↩</button>
      </div>
    </aside>

    <main class="main">
      <router-outlet />
    </main>
  </div>
  `,
  styles: [`
    .shell { display: flex; min-height: 100vh; background: var(--bg-soft); }
    .sidebar {
      width: 260px; background: #fbfbfa; border-right: 1px solid var(--border);
      padding: 16px 12px; display: flex; flex-direction: column; gap: 8px;
      position: sticky; top: 0; height: 100vh; overflow-y: auto;
    }
    .brand { display: flex; align-items: center; gap: 10px; padding: 8px; cursor: pointer; border-radius: 6px; }
    .brand:hover { background: var(--bg-hover); }
    .brand-mark {
      width: 32px; height: 32px; border-radius: 8px;
      background: linear-gradient(135deg, #37352f, #6940a5);
      color: #fff; display: grid; place-items: center; font-weight: 700;
    }
    .brand-name { font-weight: 700; font-size: 15px; }
    .brand-sub { font-size: 11px; color: var(--text-muted); }
    .nav-section { display: flex; flex-direction: column; gap: 2px; margin-top: 12px; }
    .nav-label {
      font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--text-muted); padding: 6px 10px 4px; font-weight: 600;
    }
    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 6px 10px; border-radius: 4px;
      font-size: 14px; color: var(--text-soft);
      transition: all 80ms;
    }
    .nav-item:hover { background: var(--bg-hover); color: var(--text); }
    .nav-item.active { background: var(--bg-hover); color: var(--text); font-weight: 500; }
    .emoji { font-size: 14px; width: 18px; text-align: center; }
    .user-card {
      margin-top: auto; display: flex; align-items: center; gap: 10px;
      padding: 8px; border-top: 1px solid var(--border); padding-top: 12px;
    }
    .avatar {
      width: 32px; height: 32px; border-radius: 50%;
      background: var(--accent); color: #fff;
      display: grid; place-items: center; font-weight: 600; font-size: 13px;
    }
    .main { flex: 1; padding: 32px 40px; max-width: 100%; overflow-x: hidden; }
    @media (max-width: 768px) {
      .sidebar { width: 220px; }
      .main { padding: 20px; }
    }
  `]
})
export class AppShellComponent {
  auth = inject(AuthService);
  initials() {
    const u = this.auth.user();
    if (!u) return '?';
    const n = u.name || u.email;
    return n.split(/[\s@]/).filter(Boolean).slice(0,2).map((s: string) => s[0]?.toUpperCase()).join('');
  }
}
