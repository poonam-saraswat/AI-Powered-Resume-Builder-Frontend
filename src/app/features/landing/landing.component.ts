import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <div class="page fade-in">
    <header class="topbar">
      <div class="container flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="brand-mark">R</div>
          <div style="font-weight:700">ResumeAI</div>
        </div>
        <nav class="flex items-center gap-4">
          <a routerLink="/templates" class="text-soft">Templates</a>
          <a href="#features" class="text-soft">Features</a>
          <a href="#pricing" class="text-soft">Pricing</a>
          <a routerLink="/login" class="btn btn-ghost">Log in</a>
          <a routerLink="/register" class="btn btn-primary">Get ResumeAI free</a>
        </nav>
      </div>
    </header>

    <section class="hero container">
      <div class="hero-tag">✨ AI Resume Builder · GPT-4o + Claude</div>
      <h1 class="hero-title">
        Build smarter resumes.<br/>
        <span class="serif" style="font-style:italic; color:var(--text-soft);">Land the job faster.</span>
      </h1>
      <p class="hero-sub">
        A Notion-inspired workspace where you write, edit and tailor resumes with AI.
        Get an ATS score, match to live jobs, and export to PDF, DOCX, or JSON in seconds.
      </p>
      <div class="flex gap-3 items-center" style="justify-content:center; margin-top:24px;">
        <a routerLink="/register" class="btn btn-primary btn-lg">Start free →</a>
        <a routerLink="/templates" class="btn btn-outline btn-lg">Browse templates</a>
      </div>

      <div class="hero-mock card" style="margin-top:48px; padding:0; overflow:hidden;">
        <div class="mock-tabs">
          <span class="dot" style="background:#ff5f57"></span>
          <span class="dot" style="background:#ffbd2e"></span>
          <span class="dot" style="background:#28c840"></span>
          <span class="text-xs text-muted" style="margin-left:12px">resumeai.app/app/resumes/jane-doe-resume</span>
        </div>
        <div class="mock-body">
          <div class="mock-side">
            <div class="m-block"><span class="emoji">📝</span> Personal Info</div>
            <div class="m-block active"><span class="emoji">🧠</span> Summary</div>
            <div class="m-block"><span class="emoji">💼</span> Experience</div>
            <div class="m-block"><span class="emoji">🎓</span> Education</div>
            <div class="m-block"><span class="emoji">⚡</span> Skills</div>
          </div>
          <div class="mock-doc">
            <div class="doc-h1">Jane Doe</div>
            <div class="text-soft text-sm">Senior Frontend Engineer · San Francisco</div>
            <div class="doc-divider"></div>
            <div class="doc-section">
              <div class="doc-label">Summary</div>
              <p>Frontend engineer with 7+ years building accessible, high-performance product UIs at scale...</p>
              <div class="ai-pill">✨ Improved by AI · 92 ATS score</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="container" style="padding: 80px 24px;">
      <div style="text-align:center; max-width: 640px; margin: 0 auto 48px;">
        <div class="hero-tag">Features</div>
        <h2 style="margin-top:12px">Everything you need to apply with confidence.</h2>
      </div>
      <div class="grid grid-3">
        <div class="card feature">
          <div class="feature-icon" style="background:#fbe7d4">✍️</div>
          <h3>AI writing assistant</h3>
          <p class="text-soft">Generate professional summaries and bullet points instantly. Powered by GPT-4o with Claude fallback.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon" style="background:#e7f3fb">📊</div>
          <h3>ATS compatibility score</h3>
          <p class="text-soft">Paste a job description and get a 0-100 score with missing keywords highlighted.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon" style="background:#f0eaf6">🎯</div>
          <h3>Tailor to any job</h3>
          <p class="text-soft">One click rewrites your entire resume to match a specific role and company.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon" style="background:#e0f3ee">💼</div>
          <h3>Live job matches</h3>
          <p class="text-soft">Pulls from LinkedIn and Naukri APIs, ranked by fit score against your resume.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon" style="background:#fef0f0">📤</div>
          <h3>Export anywhere</h3>
          <p class="text-soft">Pixel-perfect PDF, editable DOCX, or structured JSON for any tool.</p>
        </div>
        <div class="card feature">
          <div class="feature-icon" style="background:#fff8d6">🌍</div>
          <h3>Translate instantly</h3>
          <p class="text-soft">Premium users translate full resumes into any language while preserving tone.</p>
        </div>
      </div>
    </section>

    <section id="pricing" class="container" style="padding: 60px 24px 100px;">
      <div style="text-align:center; max-width: 640px; margin: 0 auto 48px;">
        <div class="hero-tag">Pricing</div>
        <h2 style="margin-top:12px">Free to start. Upgrade when you're ready.</h2>
      </div>
      <div class="grid grid-2" style="max-width: 880px; margin: 0 auto;">
        <div class="card pricing">
          <div class="tag">Free</div>
          <h3 style="margin-top:8px">$0<span class="text-muted text-sm"> /month</span></h3>
          <ul class="plist">
            <li>✓ Up to 3 resumes</li>
            <li>✓ Free templates</li>
            <li>✓ 5 AI generations / month</li>
            <li>✓ 3 ATS checks / month</li>
            <li>✓ PDF export (10/day)</li>
          </ul>
          <a routerLink="/register" class="btn btn-outline" style="width:100%; justify-content:center;">Start free</a>
        </div>
        <div class="card pricing pricing-pro">
          <div class="tag tag-purple">Premium</div>
          <h3 style="margin-top:8px">$12<span class="text-muted text-sm"> /month</span></h3>
          <ul class="plist">
            <li>✓ Unlimited resumes & AI calls</li>
            <li>✓ All premium templates</li>
            <li>✓ Cover letter generator</li>
            <li>✓ Tailor + translate resumes</li>
            <li>✓ PDF, DOCX, JSON exports</li>
            <li>✓ Live job match (LinkedIn + Naukri)</li>
          </ul>
          <a routerLink="/register" class="btn btn-primary" style="width:100%; justify-content:center;">Go Premium</a>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container flex items-center justify-between" style="padding:24px;">
        <div class="text-sm text-muted">© 2026 ResumeAI · Build smarter. Apply faster.</div>
        <div class="flex gap-4 text-sm text-soft">
          <a href="#">Privacy</a><a href="#">Terms</a><a href="#">Contact</a>
        </div>
      </div>
    </footer>
  </div>
  `,
  styles: [`
    .page { background: var(--bg); }
    .topbar { padding: 16px 0; border-bottom: 1px solid var(--border); position: sticky; top: 0; background: rgba(255,255,255,0.85); backdrop-filter: blur(10px); z-index:10; }
    .brand-mark { width: 28px; height: 28px; border-radius: 7px; background: linear-gradient(135deg, #37352f, #6940a5); color:#fff; display:grid; place-items:center; font-weight:700; font-size:14px; }
    .hero { text-align: center; padding: 80px 24px 40px; }
    .hero-tag { display:inline-block; padding: 4px 12px; background: var(--bg-hover); border-radius:999px; font-size:13px; color:var(--text-soft); }
    .hero-title { font-size: 64px; margin-top: 24px; letter-spacing: -0.03em; }
    .hero-sub { font-size: 18px; color: var(--text-soft); max-width: 620px; margin: 20px auto 0; }
    @media (max-width: 768px){ .hero-title{font-size:40px} }

    .mock-tabs { display:flex; align-items:center; gap:6px; padding: 12px 16px; background: var(--bg-soft); border-bottom:1px solid var(--border); }
    .dot { width:10px; height:10px; border-radius:50%; display:inline-block; }
    .mock-body { display:grid; grid-template-columns: 200px 1fr; min-height: 360px; text-align:left; }
    .mock-side { background: #fbfbfa; border-right:1px solid var(--border); padding: 12px 8px; }
    .m-block { padding: 6px 10px; border-radius:4px; font-size:13px; color: var(--text-soft); display:flex; align-items:center; gap:8px; }
    .m-block.active { background: var(--bg-hover); color: var(--text); font-weight:500; }
    .mock-doc { padding: 32px; }
    .doc-h1 { font-size: 32px; font-weight: 700; }
    .doc-divider { height:1px; background: var(--border); margin: 16px 0; }
    .doc-label { font-size:11px; text-transform:uppercase; letter-spacing:.08em; color: var(--text-muted); margin-bottom:6px; font-weight:600; }
    .ai-pill { display:inline-block; margin-top:12px; padding:4px 10px; background: linear-gradient(90deg, #f0eaf6, #e7f3fb); border-radius:999px; font-size:12px; font-weight:500; }

    .feature { padding: 28px; }
    .feature-icon { width: 44px; height:44px; border-radius:10px; display:grid; place-items:center; font-size:22px; margin-bottom:14px; }
    .feature h3 { margin-bottom: 8px; }

    .pricing { padding: 32px; display:flex; flex-direction:column; gap:16px; }
    .pricing-pro { border-color: var(--text); position: relative; }
    .pricing-pro::before { content:'⭐ Most popular'; position:absolute; top:-12px; right:24px; padding:4px 10px; background: var(--text); color:#fff; border-radius:999px; font-size:11px; font-weight:600; }
    .plist { list-style:none; display:flex; flex-direction:column; gap:8px; }
    .plist li { color: var(--text-soft); font-size:14px; }

    .footer { border-top: 1px solid var(--border); margin-top: 40px; }
  `]
})
export class LandingComponent {}
