import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="fade-in" style="max-width:680px">
    <h1>Settings</h1>
    <p class="text-soft" style="margin-top:6px">Manage your account.</p>

    <div class="card" style="margin-top:24px">
      <h3>Profile</h3>
      <div class="field" style="margin-top:16px">
        <label class="label">Full name</label>
        <input class="input" [(ngModel)]="name" />
      </div>
      <div class="field">
        <label class="label">Email</label>
        <input class="input" [value]="auth.user()?.email" disabled />
      </div>
      <button class="btn btn-primary" (click)="saveProfile()">Save changes</button>
    </div>

    <div class="card" style="margin-top:16px">
      <h3>Password</h3>
      <div class="field" style="margin-top:16px">
        <label class="label">Current password</label>
        <input class="input" type="password" [(ngModel)]="currentPwd" />
      </div>
      <div class="field">
        <label class="label">New password</label>
        <input class="input" type="password" [(ngModel)]="newPwd" />
      </div>
      <button class="btn btn-outline" (click)="changePwd()">Update password</button>
    </div>

    <div class="card" style="margin-top:16px; background: linear-gradient(135deg,#fbf9ff,#f0eaf6);" *ngIf="!auth.isPremium()">
      <h3>Upgrade to Premium</h3>
      <p class="text-soft" style="margin-top:6px">Unlimited AI, premium templates, and live job matching.</p>
      <button class="btn btn-primary" style="margin-top:12px" (click)="upgrade()">Upgrade now</button>
    </div>
  </div>
  `
})
export class SettingsComponent {
  private api = inject(ApiService);
  auth = inject(AuthService);
  name = this.auth.user()?.name || '';
  currentPwd = ''; newPwd = '';

  saveProfile() {
    this.api.updateProfile({ name: this.name }).subscribe({ next: () => alert('Saved.') });
  }
  changePwd() {
    this.api.changePassword({ currentPassword: this.currentPwd, newPassword: this.newPwd }).subscribe({
      next: () => { alert('Updated.'); this.currentPwd = ''; this.newPwd = ''; }
    });
  }
  upgrade() {
    this.api.upgrade().subscribe({ next: () => alert('Upgrade flow started.') });
  }
}
