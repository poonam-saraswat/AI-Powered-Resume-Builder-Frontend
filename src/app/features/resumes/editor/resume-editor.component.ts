import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

interface Section { id: string; type: string; title: string; content: any; visible: boolean; order: number; }

@Component({
  selector: 'app-resume-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
  <div class="editor fade-in" *ngIf="resume()">
    <header class="ed-bar">
      <div class="flex items-center gap-3">
        <a routerLink="/app/resumes" class="btn btn-ghost btn-sm">←</a>
        <input class="title-input" [(ngModel)]="resume()!.title" (blur)="save()" placeholder="Untitled resume" />
        <span class="tag" *ngIf="saving()">Saving…</span>
        <span class="tag tag-green" *ngIf="!saving() && lastSaved()">Saved · {{ lastSaved() | date:'shortTime' }}</span>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-ghost btn-sm" (click)="togglePublish()">{{ resume()!.published ? '🌐 Unpublish' : '🔒 Publish' }}</button>
        <button class="btn btn-outline btn-sm" (click)="runAts()" [disabled]="aiLoading()">📊 ATS Check</button>
        <button class="btn btn-primary btn-sm" (click)="exportResume('pdf')" [disabled]="exporting()">⬇ {{ exporting() ? 'Exporting…' : 'Export PDF' }}</button>
        <div class="dropdown">
          <button class="btn btn-outline btn-sm">▾</button>
          <div class="menu">
            <button (click)="exportResume('docx')">Export DOCX</button>
            <button (click)="exportResume('json')">Export JSON</button>
            <button (click)="aiTailor()">✨ Tailor to job</button>
            <button (click)="aiTranslate()">🌍 Translate</button>
          </div>
        </div>
      </div>
    </header>

    <div class="ed-body">
      <!-- LEFT: section navigator -->
      <aside class="nav-pane">
        <div class="text-xs text-muted" style="padding:8px 12px; font-weight:600; text-transform:uppercase; letter-spacing:.06em">Sections</div>
        <div class="sec-list">
          <div *ngFor="let s of sections(); let i = index"
               class="sec-item"
               [class.active]="activeSection() === s.id"
               (click)="activeSection.set(s.id)">
            <span class="emoji">{{ iconFor(s.type) }}</span>
            <span class="flex-1">{{ s.title }}</span>
            <button class="btn btn-ghost btn-sm" (click)="toggleVisible($event, s)" title="Hide/Show">{{ s.visible ? '👁' : '🚫' }}</button>
          </div>
        </div>
        <div class="divider"></div>
        <div class="text-xs text-muted" style="padding:4px 12px">+ Add section</div>
        <div class="sec-list">
          <button class="sec-item add" (click)="addSection('summary', 'Summary')"><span class="emoji">🧠</span> Summary</button>
          <button class="sec-item add" (click)="addSection('experience', 'Experience')"><span class="emoji">💼</span> Experience</button>
          <button class="sec-item add" (click)="addSection('education', 'Education')"><span class="emoji">🎓</span> Education</button>
          <button class="sec-item add" (click)="addSection('skills', 'Skills')"><span class="emoji">⚡</span> Skills</button>
          <button class="sec-item add" (click)="addSection('projects', 'Projects')"><span class="emoji">🚀</span> Projects</button>
          <button class="sec-item add" (click)="addSection('certifications', 'Certifications')"><span class="emoji">🏆</span> Certifications</button>
          <button class="sec-item add" (click)="addSection('languages', 'Languages')"><span class="emoji">🌍</span> Languages</button>
          <button class="sec-item add" (click)="addSection('custom', 'Custom')"><span class="emoji">➕</span> Custom</button>
        </div>
      </aside>

      <!-- CENTER: editor canvas -->
      <main class="canvas">
        <div class="doc">
          <div class="doc-header">
            <input class="big-name" [(ngModel)]="resume()!.personalInfo.name" (blur)="save()" placeholder="Your Name" />
            <div class="flex gap-3" style="flex-wrap:wrap">
              <input class="meta-input" [(ngModel)]="resume()!.personalInfo.title" (blur)="save()" placeholder="Job Title" />
              <input class="meta-input" [(ngModel)]="resume()!.personalInfo.email" (blur)="save()" placeholder="email@domain.com" />
              <input class="meta-input" [(ngModel)]="resume()!.personalInfo.phone" (blur)="save()" placeholder="+1 555 ..." />
              <input class="meta-input" [(ngModel)]="resume()!.personalInfo.location" (blur)="save()" placeholder="City, Country" />
            </div>
          </div>

          <div *ngFor="let s of visibleSections()" class="block-section" [id]="'sec-' + s.id">
            <div class="sec-h">
              <input class="sec-title" [(ngModel)]="s.title" (blur)="save()" />
              <div class="sec-actions">
                <button class="btn btn-ghost btn-sm" (click)="aiAssist(s)" title="AI assist">✨</button>
                <button class="btn btn-ghost btn-sm btn-danger" (click)="removeSection(s)" title="Delete">🗑</button>
              </div>
            </div>

            <ng-container [ngSwitch]="s.type">
              <textarea *ngSwitchCase="'summary'" class="textarea" rows="4"
                [(ngModel)]="s.content.text" (blur)="save()"
                placeholder="Write a 2-3 sentence summary of your experience..."></textarea>

              <div *ngSwitchCase="'experience'" class="entries">
                <div *ngFor="let e of s.content.items; let i = index" class="entry">
                  <div class="grid grid-2 gap-3">
                    <input class="input" [(ngModel)]="e.role" placeholder="Role" (blur)="save()" />
                    <input class="input" [(ngModel)]="e.company" placeholder="Company" (blur)="save()" />
                    <input class="input" [(ngModel)]="e.start" placeholder="Start (e.g. Jan 2022)" (blur)="save()" />
                    <input class="input" [(ngModel)]="e.end" placeholder="End (e.g. Present)" (blur)="save()" />
                  </div>
                  <textarea class="textarea" rows="3" [(ngModel)]="e.bullets" (blur)="save()" placeholder="• Achievement bullet points..."></textarea>
                  <button class="btn btn-ghost btn-sm btn-danger" (click)="removeItem(s, i)">Remove</button>
                </div>
                <button class="btn btn-outline btn-sm" (click)="addItem(s, {role:'',company:'',start:'',end:'',bullets:''})">+ Add experience</button>
              </div>

              <div *ngSwitchCase="'education'" class="entries">
                <div *ngFor="let e of s.content.items; let i = index" class="entry">
                  <div class="grid grid-2 gap-3">
                    <input class="input" [(ngModel)]="e.school" placeholder="School" (blur)="save()" />
                    <input class="input" [(ngModel)]="e.degree" placeholder="Degree" (blur)="save()" />
                    <input class="input" [(ngModel)]="e.start" placeholder="Start" (blur)="save()" />
                    <input class="input" [(ngModel)]="e.end" placeholder="End" (blur)="save()" />
                  </div>
                  <button class="btn btn-ghost btn-sm btn-danger" (click)="removeItem(s, i)">Remove</button>
                </div>
                <button class="btn btn-outline btn-sm" (click)="addItem(s, {school:'',degree:'',start:'',end:''})">+ Add education</button>
              </div>

              <div *ngSwitchCase="'skills'">
                <textarea class="textarea" rows="3" [(ngModel)]="s.content.text" (blur)="save()" placeholder="Comma-separated: React, TypeScript, Node.js, ..."></textarea>
                <div class="flex gap-2" style="flex-wrap:wrap; margin-top:8px">
                  <span class="tag tag-blue" *ngFor="let k of skillsList(s)">{{ k }}</span>
                </div>
              </div>

              <textarea *ngSwitchDefault class="textarea" rows="3" [(ngModel)]="s.content.text" (blur)="save()" placeholder="Add details..."></textarea>
            </ng-container>
          </div>
        </div>
      </main>

      <!-- RIGHT: AI / inspector pane -->
      <aside class="ai-pane">
        <div class="text-xs text-muted" style="font-weight:600; text-transform:uppercase; letter-spacing:.06em; margin-bottom:12px;">AI Assistant</div>

        <div class="ai-card card">
          <div style="font-weight:600; margin-bottom:8px">📊 ATS Score</div>
          <div class="score" *ngIf="atsScore() !== null">
            <div class="score-num">{{ atsScore() }}<span class="text-muted text-sm">/100</span></div>
            <div class="score-bar"><div [style.width.%]="atsScore()!"></div></div>
          </div>
          <div *ngIf="atsScore() === null" class="text-soft text-sm">Run an ATS check to see your match score.</div>
          <textarea class="textarea" rows="3" [(ngModel)]="jobDesc" placeholder="Paste a job description..." style="margin-top:10px"></textarea>
          <button class="btn btn-primary btn-sm" (click)="runAts()" [disabled]="aiLoading()" style="margin-top:8px; width:100%; justify-content:center;">{{ aiLoading() ? 'Analyzing…' : 'Run ATS Check' }}</button>
          <div *ngIf="atsKeywords().length" style="margin-top:12px;">
            <div class="text-xs text-muted">Missing keywords:</div>
            <div class="flex gap-2" style="flex-wrap:wrap; margin-top:4px">
              <span class="tag" *ngFor="let k of atsKeywords()">{{ k }}</span>
            </div>
          </div>
        </div>

        <div class="ai-card card" style="margin-top:12px">
          <div style="font-weight:600; margin-bottom:8px">✨ Quick AI Actions</div>
          <button class="ai-action" (click)="aiSummary()">🧠 Generate summary</button>
          <button class="ai-action" (click)="aiSuggestSkills()">⚡ Suggest skills</button>
          <button class="ai-action" *ngIf="auth.isPremium()" (click)="aiCoverLetter()">📝 Cover letter</button>
          <button class="ai-action" *ngIf="auth.isPremium()" (click)="aiTailor()">🎯 Tailor to job</button>
          <button class="ai-action" *ngIf="auth.isPremium()" (click)="aiTranslate()">🌍 Translate</button>
          <div *ngIf="!auth.isPremium()" class="text-xs text-muted" style="margin-top:8px">Upgrade for unlimited AI.</div>
        </div>

        <div *ngIf="aiResult()" class="ai-card card" style="margin-top:12px">
          <div style="font-weight:600; margin-bottom:8px">AI Output</div>
          <div class="ai-out">{{ aiResult() }}</div>
        </div>
      </aside>
    </div>
  </div>
  <div *ngIf="!resume()" class="pulse" style="padding:40px">Loading resume…</div>
  `,
  styles: [`
    .editor { display:flex; flex-direction:column; height: calc(100vh - 64px); margin:-32px -40px; }
    .ed-bar { display:flex; align-items:center; justify-content:space-between; padding:10px 16px; border-bottom:1px solid var(--border); background:#fff; gap:12px; flex-wrap:wrap; }
    .title-input { font-size:16px; font-weight:600; padding: 4px 8px; border-radius:4px; background:transparent; border:1px solid transparent; min-width:240px; }
    .title-input:hover, .title-input:focus { border-color: var(--border); background:#fff; outline:none; }
    .ed-body { display:grid; grid-template-columns: 240px 1fr 320px; flex:1; overflow:hidden; }
    .nav-pane { background:#fbfbfa; border-right:1px solid var(--border); padding:12px 6px; overflow-y:auto; }
    .sec-list { display:flex; flex-direction:column; gap:1px; }
    .sec-item { display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:4px; font-size:14px; color:var(--text-soft); cursor:pointer; text-align:left; width:100%; }
    .sec-item:hover { background: var(--bg-hover); color: var(--text); }
    .sec-item.active { background: var(--bg-hover); color: var(--text); font-weight:500; }
    .sec-item.add { color: var(--text-muted); }
    .canvas { overflow-y:auto; padding: 32px; background: var(--bg-soft); }
    .doc { max-width: 760px; margin: 0 auto; background:#fff; border:1px solid var(--border); border-radius: var(--radius-lg); padding: 48px 56px; min-height: 100%; box-shadow: var(--shadow); }
    .doc-header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid var(--text); }
    .big-name { font-size: 36px; font-weight: 800; padding: 4px 8px; border:1px solid transparent; background:transparent; width:100%; border-radius:4px; letter-spacing: -0.02em; }
    .big-name:hover, .big-name:focus { border-color: var(--border); outline: none; }
    .meta-input { padding: 4px 8px; border:1px solid transparent; background:transparent; border-radius:4px; font-size:14px; color:var(--text-soft); }
    .meta-input:hover, .meta-input:focus { border-color: var(--border); background:#fff; outline:none; }
    .block-section { margin-top: 24px; }
    .sec-h { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
    .sec-title { font-size:18px; font-weight:700; padding:4px 8px; border:1px solid transparent; background:transparent; border-radius:4px; flex:1; }
    .sec-title:hover, .sec-title:focus { border-color: var(--border); outline:none; }
    .sec-actions { display:flex; gap:4px; opacity:0; transition: opacity 100ms; }
    .block-section:hover .sec-actions { opacity:1; }
    .entries { display:flex; flex-direction:column; gap:16px; }
    .entry { padding:16px; background: var(--bg-soft); border-radius:8px; border:1px solid var(--border); display:flex; flex-direction:column; gap:8px; }
    .ai-pane { border-left:1px solid var(--border); background:#fbfbfa; padding:16px; overflow-y:auto; }
    .ai-card { padding:14px; }
    .ai-action { display:block; width:100%; text-align:left; padding:8px 12px; border-radius:6px; font-size:14px; color:var(--text-soft); }
    .ai-action:hover { background: var(--bg-hover); color: var(--text); }
    .score { display:flex; align-items:center; gap:12px; margin-bottom:8px; }
    .score-num { font-size:28px; font-weight:700; }
    .score-bar { flex:1; height:8px; background: var(--bg-hover); border-radius:999px; overflow:hidden; }
    .score-bar > div { height:100%; background: linear-gradient(90deg, var(--green), var(--accent)); transition: width 400ms; }
    .ai-out { font-size:13px; white-space:pre-wrap; color:var(--text-soft); }
    .dropdown { position:relative; }
    .dropdown:hover .menu, .dropdown:focus-within .menu { display:flex; }
    .menu { display:none; position:absolute; top:100%; right:0; margin-top:4px; background:#fff; border:1px solid var(--border); border-radius:8px; box-shadow: var(--shadow); flex-direction:column; min-width:160px; padding:4px; z-index:5; }
    .menu button { padding:8px 12px; border-radius:4px; text-align:left; font-size:13px; }
    .menu button:hover { background: var(--bg-hover); }
    @media (max-width: 1024px) { .ed-body { grid-template-columns: 1fr; } .nav-pane, .ai-pane { display:none; } }
  `]
})
export class ResumeEditorComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  resume = signal<any>(null);
  sections = signal<Section[]>([]);
  activeSection = signal<string>('');
  saving = signal(false);
  lastSaved = signal<Date | null>(null);
  aiLoading = signal(false);
  aiResult = signal<string>('');
  exporting = signal(false);
  atsScore = signal<number | null>(null);
  atsKeywords = signal<string[]>([]);
  jobDesc = '';

  visibleSections = computed(() => this.sections().filter(s => s.visible).sort((a, b) => a.order - b.order));

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getResume(id).subscribe({
      next: (r) => {
        if (!r.personalInfo) r.personalInfo = { name: '', title: '', email: '', phone: '', location: '' };
        this.resume.set(r);
        const sections: Section[] = (r.sections || []).map((s: any, i: number) => ({
          id: s.id || crypto.randomUUID(),
          type: s.type || 'custom',
          title: s.title || s.type,
          content: s.content || { text: '', items: [] },
          visible: s.visible !== false,
          order: s.order ?? i
        }));
        if (sections.length === 0) {
          sections.push(this.makeSection('summary', 'Summary', 0));
          sections.push(this.makeSection('experience', 'Experience', 1));
          sections.push(this.makeSection('skills', 'Skills', 2));
        }
        this.sections.set(sections);
        this.activeSection.set(sections[0]?.id || '');
        if (r.atsScore) this.atsScore.set(r.atsScore);
      },
      error: () => {
        this.resume.set({ id, title: 'Untitled', personalInfo: { name:'', title:'', email:'', phone:'', location:'' }, sections: [] });
        this.sections.set([this.makeSection('summary', 'Summary', 0)]);
      }
    });
  }

  makeSection(type: string, title: string, order: number): Section {
    return { id: crypto.randomUUID(), type, title, content: type === 'experience' || type === 'education' ? { items: [] } : { text: '' }, visible: true, order };
  }

  iconFor(t: string) {
    return ({ summary:'🧠', experience:'💼', education:'🎓', skills:'⚡', projects:'🚀', certifications:'🏆', languages:'🌍', custom:'📝' } as any)[t] || '📝';
  }

  skillsList(s: Section) { return (s.content.text || '').split(',').map((x: string) => x.trim()).filter(Boolean); }

  addSection(type: string, title: string) {
    const s = this.makeSection(type, title, this.sections().length);
    this.sections.update(arr => [...arr, s]);
    this.activeSection.set(s.id);
    this.save();
  }
  removeSection(s: Section) {
    if (!confirm('Remove this section?')) return;
    this.sections.update(arr => arr.filter(x => x.id !== s.id));
    this.save();
  }
  toggleVisible(e: Event, s: Section) { e.stopPropagation(); s.visible = !s.visible; this.save(); }
  addItem(s: Section, item: any) { s.content.items = [...(s.content.items || []), item]; this.save(); }
  removeItem(s: Section, i: number) { s.content.items.splice(i, 1); this.save(); }

  save() {
    const r = this.resume();
    if (!r) return;
    this.saving.set(true);
    const payload = { ...r, sections: this.sections() };
    this.api.updateResume(r.id, payload).subscribe({
      next: () => { this.saving.set(false); this.lastSaved.set(new Date()); },
      error: () => this.saving.set(false)
    });
  }

  togglePublish() {
    const r = this.resume(); if (!r) return;
    this.api.publishResume(r.id, !r.published).subscribe({ next: () => { r.published = !r.published; } });
  }

  exportResume(format: 'pdf' | 'docx' | 'json') {
    const r = this.resume(); if (!r) return;
    this.exporting.set(true);
    this.api.exportResume(r.id, format).subscribe({
      next: (res: any) => {
        this.exporting.set(false);
        if (res?.url) window.open(res.url, '_blank');
        else alert(`Export queued. You'll be notified when ready.`);
      },
      error: () => { this.exporting.set(false); alert('Export failed.'); }
    });
  }

  runAts() {
    const r = this.resume(); if (!r) return;
    if (!this.jobDesc) { alert('Paste a job description first.'); return; }
    this.aiLoading.set(true);
    this.api.aiAtsCheck({ resumeId: r.id, jobDescription: this.jobDesc }).subscribe({
      next: (res: any) => {
        this.aiLoading.set(false);
        this.atsScore.set(res?.score ?? 0);
        this.atsKeywords.set(res?.missingKeywords || []);
      },
      error: () => { this.aiLoading.set(false); alert('AI service unavailable.'); }
    });
  }

  aiSummary() {
    const r = this.resume(); if (!r) return;
    this.aiLoading.set(true);
    this.api.aiGenerateSummary({
      jobTitle: r.personalInfo?.title, experience: 5, skills: ''
    }).subscribe({
      next: (res: any) => {
        this.aiLoading.set(false);
        this.aiResult.set(res?.text || res?.summary || '');
        const summary = this.sections().find(s => s.type === 'summary');
        if (summary) { summary.content.text = res?.text || res?.summary; this.save(); }
      },
      error: () => { this.aiLoading.set(false); alert('AI service unavailable.'); }
    });
  }

  aiSuggestSkills() {
    const r = this.resume(); if (!r) return;
    this.aiLoading.set(true);
    this.api.aiSuggestSkills({ jobTitle: r.personalInfo?.title }).subscribe({
      next: (res: any) => { this.aiLoading.set(false); this.aiResult.set((res?.skills || []).join(', ')); },
      error: () => this.aiLoading.set(false)
    });
  }

  aiCoverLetter() {
    const r = this.resume(); if (!r) return;
    if (!this.jobDesc) { alert('Paste a job description first.'); return; }
    this.aiLoading.set(true);
    this.api.aiCoverLetter({ resumeId: r.id, jobDescription: this.jobDesc }).subscribe({
      next: (res: any) => { this.aiLoading.set(false); this.aiResult.set(res?.text || ''); },
      error: () => this.aiLoading.set(false)
    });
  }

  aiTailor() {
    const r = this.resume(); if (!r) return;
    if (!this.jobDesc) { alert('Paste a job description first.'); return; }
    this.aiLoading.set(true);
    this.api.aiTailorResume({ resumeId: r.id, jobDescription: this.jobDesc }).subscribe({
      next: () => { this.aiLoading.set(false); alert('Resume tailored. Reloading.'); location.reload(); },
      error: () => this.aiLoading.set(false)
    });
  }

  aiTranslate() {
    const r = this.resume(); if (!r) return;
    const lang = prompt('Translate to which language? (e.g. Spanish)');
    if (!lang) return;
    this.aiLoading.set(true);
    this.api.aiTranslate({ resumeId: r.id, language: lang }).subscribe({
      next: () => { this.aiLoading.set(false); alert('Translation complete.'); location.reload(); },
      error: () => this.aiLoading.set(false)
    });
  }

  aiAssist(s: Section) {
    if (s.type === 'summary') this.aiSummary();
    else if (s.type === 'skills') this.aiSuggestSkills();
    else alert('AI assist for this section coming soon.');
  }
}
