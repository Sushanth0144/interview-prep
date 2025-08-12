// src/app/app.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  currentIndex = 0;
  technologies = [
    { name: 'HTML', image: 'HTML.webp', text: 'Forms the backbone of web structure and content.' },
    { name: 'CSS', image: 'CSS.jpeg', text: 'Enhances design and responsiveness of web pages.' },
    { name: 'JavaScript', image: 'JavaScript.jpg', text: 'Adds interactivity and dynamic behavior.' },
    { name: 'Angular', image: 'Angular.jpg', text: 'Enables robust, scalable single-page applications.' }
  ];
  private intervalId: any;

  constructor(private dialog: MatDialog, private authService: AuthService, private router: Router) {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn && this.router.url === '/') {
        this.router.navigate(['/questions']); // Navigate to questions after login
      }
    });
  }

  ngOnInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  startAutoScroll() {
    this.intervalId = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.technologies.length;
    }, 2000);
  }

  stopAutoScroll() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  setIndex(index: number) {
    this.currentIndex = index;
  }

  openLoginDialog(): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.authService.getToken()) {
        this.router.navigate(['/questions']); // Navigate to questions page on success
      }
    });
  }

  openRegisterDialog(): void {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.authService.getToken()) {
        this.router.navigate(['/questions']); // Navigate to questions page on success
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Return to home page
  }
}