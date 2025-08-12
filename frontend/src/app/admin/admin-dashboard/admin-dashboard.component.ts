import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent {
  activeSection: 'topics' | 'questions' = 'topics';

  constructor(private authService: AuthService, private router: Router) {}

  showSection(section: 'topics' | 'questions') {
    this.activeSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
