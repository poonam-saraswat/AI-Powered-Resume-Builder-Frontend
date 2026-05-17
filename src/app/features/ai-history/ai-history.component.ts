import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-ai-history',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fade-in">
    <h1>AI History</h1>
    <p class="text-soft" style="margin-top:6px">Every AI request you've made.</p>

    <div *ngIf="loading()" class="card pulse" style="margin-top:24px">Loading…</div>

    <div *ngIf="!loading() && items().length === 0" class="card" style="text-align:center; margin-top:24px; padding:40px">
      <div style="font-size:32px">🤖</div>
      <p class="text-soft" style="margin-top:8px">No AI requests yet.</p>
    </div>

    <div style="margin-top:24px; display:flex; flex-direction:column; gap:8px;">
      <div *ngFor="let h of items()" class="card hist">
        <div class="flex justify-between items-center">
          <div>
            <div style="font-weight:600">{{ h.operation || h.type || 'AI Request' }}</div>
            <div class="text-xs text-muted">{{ h.createdAt | date:'MMM d, y · h:mm a' }} · {{ h.model || 'GPT-4o' }} · {{ h.tokens || 0 }} tokens</div>
          </div>
          <span class="tag" [class.tag-green]="h.status === 'SUCCESS'">{{ h.status || 'SUCCESS' }}</span>
        </div>
        <div *ngIf="h.prompt" class="hist-prompt">{{ h.prompt }}</div>
      </div>
    </div>
  </div>
  `,
  styles: [`.hist-prompt { margin-top:8px; padding:8px 12px; background: var(--bg-soft); border-radius:6px; font-size:13px; color:var(--text-soft); white-space:pre-wrap; max-height:120px; overflow:hidden; }`]
})
export class AiHistoryComponent implements OnInit {
  private api = inject(ApiService);
  items = signal<any[]>([]);
  loading = signal(true);
  ngOnInit() {
    this.api.aiHistory().subscribe({
      next: (i) => { this.items.set(i || []); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }
}
