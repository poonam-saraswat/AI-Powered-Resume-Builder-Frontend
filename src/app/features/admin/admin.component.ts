import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fade-in">
    <h1>Admin</h1>
    <p class="text-soft">Platform analytics & user management.</p>

    <div class="grid grid-4" style="margin-top:24px">
      <div class="card stat"><div class="text-xs text-muted">Total users</div><div class="num">{{ analytics()?.users || 0 }}</div></div>
      <div class="card stat"><div class="text-xs text-muted">Resumes created</div><div class="num">{{ analytics()?.resumes || 0 }}</div></div>
      <div class="card stat"><div class="text-xs text-muted">AI calls</div><div class="num">{{ analytics()?.aiCalls || 0 }}</div></div>
      <div class="card stat"><div class="text-xs text-muted">Exports</div><div class="num">{{ analytics()?.exports || 0 }}</div></div>
    </div>

    <h3 style="margin-top:32px">Users</h3>
    <div class="card" style="margin-top:12px; padding:0">
      <table class="t">
        <thead><tr><th>Email</th><th>Name</th><th>Plan</th><th>Status</th><th></th></tr></thead>
        <tbody>
          <tr *ngFor="let u of users()">
            <td>{{ u.email }}</td>
            <td>{{ u.name }}</td>
            <td><span class="tag" [class.tag-purple]="u.plan === 'PREMIUM'">{{ u.plan || 'FREE' }}</span></td>
            <td><span class="tag" [class.tag-green]="u.status === 'ACTIVE'">{{ u.status || 'ACTIVE' }}</span></td>
            <td><button class="btn btn-ghost btn-sm" (click)="toggle(u)">{{ u.plan === 'PREMIUM' ? 'Downgrade' : 'Upgrade' }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  styles: [`
    .stat .num { font-size:28px; font-weight:700; margin-top:6px; }
    .t { width:100%; border-collapse:collapse; }
    .t th, .t td { padding:12px 16px; text-align:left; border-bottom:1px solid var(--border); font-size:14px; }
    .t th { font-weight:600; color:var(--text-soft); background: var(--bg-soft); }
    .t tr:last-child td { border-bottom:none; }
  `]
})
export class AdminComponent implements OnInit {
  private api = inject(ApiService);
  users = signal<any[]>([]);
  analytics = signal<any>(null);
  ngOnInit() {
    this.api.adminUsers().subscribe({ next: u => this.users.set(u || []), error: () => {} });
    this.api.adminAnalytics().subscribe({ next: a => this.analytics.set(a || {}), error: () => this.analytics.set({}) });
  }
  toggle(u: any) {
    const plan = u.plan === 'PREMIUM' ? 'FREE' : 'PREMIUM';
    this.api.adminUpdateUser(u.id, { plan }).subscribe({ next: () => { u.plan = plan; } });
  }
}
