import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-neutral-50 p-6">
      <a routerLink="/" class="text-sm text-neutral-500 mb-6 self-start hover:text-neutral-900">
        ← Back to home
      </a>

      <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
        <div class="flex items-center gap-2 mb-6">
          <div class="w-10 h-10 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold">R</div>
          <span class="font-semibold text-lg">ResumeAI</span>
        </div>

        <h1 class="text-2xl font-bold mb-1">Welcome back</h1>
        <p class="text-neutral-500 mb-6">Log in to your workspace.</p>

        <form #f="ngForm" (ngSubmit)="submit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              [(ngModel)]="email"
              required
              email
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="6"
              class="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <p *ngIf="error()" class="text-sm text-red-600">{{ error() }}</p>

          <button
            type="submit"
            [disabled]="f.invalid || loading()"
            class="w-full py-2.5 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50"
          >
            {{ loading() ? 'Logging in…' : 'Log in' }}
          </button>
        </form>

        <p class="text-sm text-neutral-500 text-center mt-6">
          Don't have an account?
          <a routerLink="/register" class="text-violet-600 font-medium">Sign up</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  submit() {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app/dashboard']);
      },
      error: (e) => {
        this.loading.set(false);
        this.error.set(e?.error?.error || e?.error?.message || 'Invalid email or password.');
      },
    });
  }
}
