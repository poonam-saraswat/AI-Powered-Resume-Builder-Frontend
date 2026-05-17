import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
  { path: 'templates', loadComponent: () => import('./features/templates/templates.component').then(m => m.TemplatesComponent) },
  {
    path: 'app',
    loadComponent: () => import('./layout/app-shell.component').then(m => m.AppShellComponent),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'resumes', loadComponent: () => import('./features/resumes/list/resumes-list.component').then(m => m.ResumesListComponent) },
      { path: 'resumes/:id', loadComponent: () => import('./features/resumes/editor/resume-editor.component').then(m => m.ResumeEditorComponent) },
      { path: 'jobs', loadComponent: () => import('./features/jobs/jobs.component').then(m => m.JobsComponent) },
      { path: 'ai-history', loadComponent: () => import('./features/ai-history/ai-history.component').then(m => m.AiHistoryComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) },
      { path: 'admin', loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent) },
      { path: 'job-search', canActivate: [authGuard], loadComponent: () => import('./features/job-search/job-search.component').then(m => m.JobSearchComponent) },

    ]
  },
  { path: '**', redirectTo: '' }
];
