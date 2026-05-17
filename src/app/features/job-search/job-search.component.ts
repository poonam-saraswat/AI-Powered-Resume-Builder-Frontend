import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobSearchResult, JobSearchService } from '../../core/services/job-search.service';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-search.component.html',
  styleUrls: ['./job-search.component.css'],
})
export class JobSearchComponent {
  query = '';
  location = '';
  page = 1;
  loading = false;
  error = '';
  results: JobSearchResult[] = [];

  constructor(private api: JobSearchService) {}

  onSearch(reset = true) {
    if (!this.query.trim()) {
      this.error = 'Please enter a job title or keyword';
      return;
    }
    if (reset) this.page = 1;
    this.loading = true;
    this.error = '';
    this.api.search(this.query, this.location, this.page).subscribe({
      next: (r) => { this.results = r; this.loading = false; },
      error: (e) => {
        this.error = e?.error?.message || 'Search failed. Make sure you are logged in.';
        this.loading = false;
      },
    });
  }

  next() { this.page++; this.onSearch(false); }
  prev() { if (this.page > 1) { this.page--; this.onSearch(false); } }

  open(url: string) { window.open(url, '_blank'); }
}
