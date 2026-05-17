import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <a routerLink="/" class="back">← Back to home</a>

      <div class="auth-card card">
        <div class="brand-row">
          <div class="mark">R</div>
          <strong>ResumeAI</strong>
        </div>

        <h1>Create your account</h1>
        <p class="muted">Start building in seconds. No credit card required.</p>

        <form (ngSubmit)="submit()" #f="ngForm" class="form" autocomplete="on">
          <label class="field">
            <span>Full name</span>
            <input type="text" name="name" [(ngModel)]="name" required />
          </label>

          <label class="field">
            <span>Email</span>
            <input type="email" name="email" [(ngModel)]="email" required
                   placeholder="you@company.com" />
          </label>

          <label class="field">
            <span>Password</span>
            <input type="password" name="password" [(ngModel)]="password"
                   required minlength="6" />
          </label>

          <p class="error" *ngIf="error()">{{ error() }}</p>

          <button class="btn primary block" type="submit"
                  [disabled]="loading() || f.invalid">
            {{ loading() ? 'Creating account…' : 'Create account' }}
          </button>
        </form>

        <hr />
        <p class="muted center">
          Already have an account? <a routerLink="/login">Log in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height: 100vh; display: grid; place-items: center; background: var(--bg-soft); padding: 24px; position: relative; }
    .back { position: absolute; top: 24px; left: 24px; color: var(--text-soft); font-size: 14px; text-decoration: none; }
    .auth-card { width: 100%; max-width: 420px; padding: 36px; }
    .brand-row { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
    .mark { width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg,#37352f,#6940a5); color: #fff; display: grid; place-items: center; font-weight: 700; }
    .form { display: grid; gap: 14px; margin-top: 18px; }
    .field { display: grid; gap: 6px; font-size: 13px; }
    .field input { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; }
    .block { width: 100%; }
    .center { text-align: center; }
    .error { color: var(--danger); background: #fef0f0; padding: 8px 12px; border-radius: 6px; font-size: 13px; margin: 0; }
  `]
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit() {
    this.loading.set(true);
    this.error.set(null);

    // send the `name` field expected by the backend
    const payload = {
      email: this.email,
      password: this.password,
      fullName: this.name,
    };

    this.auth.register(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app/dashboard']);
      },
      error: (e) => {
        this.loading.set(false);
        const msg =
          e?.error?.details?.[0] ||
          e?.error?.error ||
          e?.error?.message ||
          'Could not create account.';
        this.error.set(msg);
      },
    });
  }
}
