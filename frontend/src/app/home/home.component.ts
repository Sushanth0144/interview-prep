// src/app/home/home.component.ts
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from '../auth/login.component';
import { RegisterComponent } from '../auth/register.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isAdmin = false;
  currentIndex = 0;
  private intervalId: any;

  technologies = [
    { name: 'HTML', image: 'HTML.webp', text: 'Forms the backbone of web structure and content.' },
    { name: 'CSS', image: 'CSS.jpeg', text: 'Enhances design and responsiveness of web pages.' },
    { name: 'JavaScript', image: 'JavaScript.jpg', text: 'Adds interactivity and dynamic behavior.' },
    { name: 'Angular', image: 'Angular.jpg', text: 'Enables robust, scalable single-page applications.' },
  ];

  @ViewChild('partnerScroll') partnerScroll!: ElementRef<HTMLDivElement>;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  ngOnInit() {
    this.startAutoScroll();
  }

  ngOnDestroy() {
    this.stopAutoScroll();
  }

  // Carousel
  startAutoScroll() {
    this.intervalId = setInterval(() => this.nextSlide(), 3000);
  }
  stopAutoScroll() { if (this.intervalId) clearInterval(this.intervalId); }
  pauseAutoScroll() { this.stopAutoScroll(); }
  resumeAutoScroll() { this.startAutoScroll(); }
  setIndex(index: number) { this.currentIndex = index; }
  prevSlide() { this.currentIndex = (this.currentIndex - 1 + this.technologies.length) % this.technologies.length; }
  nextSlide() { this.currentIndex = (this.currentIndex + 1) % this.technologies.length; }

  // Partner scroll
  scrollPartners(direction: 'left' | 'right') {
    const el = this.partnerScroll?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -220 : 220, behavior: 'smooth' });
  }

  // Auth
  openLoginDialog() {
    const ref = this.dialog.open(LoginComponent, { width: '400px' });
    ref.afterClosed().subscribe(() => {
      if (this.authService.getToken()) {
        this.isLoggedIn = true;
        this.isAdmin = this.authService.isAdmin();
        this.router.navigate([this.isAdmin ? '/admin' : '/topics']);
      }
    });
  }

  openRegisterDialog() {
    const ref = this.dialog.open(RegisterComponent, { width: '400px' });
    ref.afterClosed().subscribe(() => {
      if (this.authService.getToken()) {
        this.isLoggedIn = true;
        this.isAdmin = this.authService.isAdmin();
        this.router.navigate(['/topics']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/']);
  }
}
