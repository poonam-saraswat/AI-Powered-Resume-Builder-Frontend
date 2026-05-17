# ResumeAI — Angular Frontend

Notion-inspired Angular 17 frontend for the **ResumeAI** AI-Powered Resume Builder.
Connects out of the box to the Spring Boot microservices backend through the API gateway at `http://localhost:8080`.

## Tech Stack
- Angular 17 (standalone components, signals, lazy-loaded routes)
- TypeScript
- Pure CSS design system (Notion aesthetic — Inter + Lora fonts)
- HttpClient with JWT auth interceptor

## Features
- Marketing **Landing page** with pricing
- **Login / Register** (JWT)
- **Dashboard** with stats, recent resumes, quick actions
- **Resumes list** (create, duplicate, delete)
- **Resume editor** — Notion-like 3-pane editor (sections nav · live document · AI assistant)
  - Sections: Summary, Experience, Education, Skills, Projects, Certifications, Languages, Custom
  - AI: Generate summary, suggest skills, ATS check, cover letter, tailor resume, translate
  - Export: PDF / DOCX / JSON
  - Publish/unpublish to public gallery
- **Templates gallery** (free / premium filtering)
- **Job Match** (LinkedIn + Naukri search, bookmarks)
- **AI History**
- **Settings** (profile, password, upgrade)
- **Admin** panel (users, analytics)

## Project structure
```
src/app/
  core/
    services/    auth.service.ts, api.service.ts
    guards/      auth.guard.ts
    interceptors/auth.interceptor.ts
  layout/        app-shell.component.ts          (sidebar layout for /app/*)
  features/
    landing/     landing.component.ts
    auth/        login/, register/
    dashboard/   dashboard.component.ts
    resumes/     list/, editor/
    templates/   templates.component.ts
    jobs/        jobs.component.ts
    ai-history/  ai-history.component.ts
    settings/    settings.component.ts
    admin/       admin.component.ts
  app.config.ts, app.routes.ts, app.component.ts
src/environments/environment.ts                  (apiUrl)
src/styles.css                                   (design system tokens)
```

---

## How to run on your local system — step by step

### 1. Prerequisites
- **Node.js 18.13+ or 20+** — https://nodejs.org
- **npm** (comes with Node) — verify: `node -v` and `npm -v`
- The **ResumeAI backend** running locally (Eureka + API Gateway on port 8080)

### 2. Install Angular CLI globally (recommended)
```bash
npm install -g @angular/cli@17
```

### 3. Unzip and install dependencies
```bash
unzip resumeai-frontend.zip
cd resumeai-frontend
npm install
```
This installs Angular 17 and all dependencies (~2 minutes).

### 4. Configure the backend URL
Open `src/environments/environment.ts` and confirm/update the API gateway URL:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'   // <-- your gateway URL
};
```
Also update `src/environments/environment.prod.ts` for production builds.

### 5. Start the backend
From your `resumeai/` Spring Boot project, start (in order):
```
1. eureka-server      (port 8761)
2. auth-service, user-service, resume-service, ai-service,
   template-service, export-service, jobmatch-service,
   notification-service, billing-service
3. api-gateway        (port 8080)
```

### 6. Run the frontend
```bash
npm start
```
This runs `ng serve` and opens **http://localhost:4200** in your browser.

You should see the landing page. Register an account → you'll be redirected to the dashboard.

### 7. Production build (optional)
```bash
npm run build
```
Output goes to `dist/resumeai-frontend/` — serve with any static host (nginx, Vercel, S3+CloudFront, etc.).

---

## Necessary changes you may need to make

### A. Backend CORS
Your `api-gateway/src/main/resources/application.yml` already allows `http://localhost:4200`, so no change needed. If you change the frontend port, add it to the gateway's `allowedOriginPatterns` list.

### B. Endpoint paths
The frontend calls these endpoints under `/api`. If your backend uses different paths, edit **`src/app/core/services/api.service.ts`** to match. Defaults assumed:

| Feature | Method | Path |
|---|---|---|
| Login | POST | `/auth/login` |
| Register | POST | `/auth/register` |
| Get/list resumes | GET | `/resumes`, `/resumes/{id}` |
| Create resume | POST | `/resumes` |
| Update / delete | PUT / DELETE | `/resumes/{id}` |
| Duplicate | POST | `/resumes/{id}/duplicate` |
| Publish | POST | `/resumes/{id}/publish` |
| Sections CRUD | POST/PUT/DELETE | `/resumes/{id}/sections[/{sectionId}]` |
| Reorder sections | POST | `/resumes/{id}/sections/reorder` |
| Templates | GET | `/templates`, `/templates/{id}` |
| AI summary | POST | `/ai/summary` |
| AI bullets | POST | `/ai/bullets` |
| AI suggest skills | POST | `/ai/skills` |
| AI ATS check | POST | `/ai/ats-check` |
| AI cover letter | POST | `/ai/cover-letter` |
| AI tailor resume | POST | `/ai/tailor` |
| AI translate | POST | `/ai/translate` |
| AI history | GET | `/ai/history` |
| Export | POST | `/export/{resumeId}`  body `{format}` |
| Job search | POST | `/jobs/search` |
| Match score | POST | `/jobs/match` |
| Bookmark | POST | `/jobs/{id}/bookmark` |
| Bookmarks list | GET | `/jobs/bookmarks` |
| Notifications | GET | `/notifications` |
| Profile | GET/PUT | `/users/me` |
| Change password | POST | `/users/me/password` |
| Admin users | GET | `/users/admin/all` |
| Admin analytics | GET | `/users/admin/analytics` |
| Update user | PUT | `/users/admin/{id}` |
| Upgrade plan | POST | `/billing/upgrade` |

### C. Auth response shape
`AuthService.login/register` expects:
```json
{ "token": "<jwt>", "refreshToken": "...", "user": { "id": "...", "email": "...", "name": "...", "role": "USER|ADMIN", "plan": "FREE|PREMIUM" } }
```
If your backend returns a different shape (e.g. `accessToken` instead of `token`), edit `src/app/core/services/auth.service.ts → setSession()`.

### D. JWT header
The interceptor sends `Authorization: Bearer <token>`. If your gateway expects a different header name, edit `src/app/core/interceptors/auth.interceptor.ts`.

### E. Templates fallback
If `/api/templates` is unavailable, the frontend shows 8 demo templates so the gallery still renders. Once your template-service is live, real ones replace them automatically.

---

## Troubleshooting

- **CORS error in browser console** → check `api-gateway` `allowedOriginPatterns` includes `http://localhost:4200`.
- **401 on every call** → confirm backend returns `token` field in login response.
- **Connection refused on :8080** → start `api-gateway`.
- **`ng: command not found`** → `npm install -g @angular/cli@17`.
- **Port 4200 in use** → `npm start -- --port 4300`.

---
## Author

Built with ❤️ - by Poonam Saraswat
