// src/app/topic-tabs/topic-tabs.component.ts
import { Component, OnInit } from '@angular/core';
import { TopicService } from '../services/topic.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface Topic {
  id: number;
  name: string;
  description?: string;
  link?: string;
  questionsCount: number;
  image?: string;
}

@Component({
  selector: 'app-topic-tabs',
  templateUrl: './topic-tabs.component.html',
  styleUrls: ['./topic-tabs.component.css']
})
export class TopicTabsComponent implements OnInit {
  topics: Topic[] = [];
  isLoggedIn = false;

  constructor(
    private topicService: TopicService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.loadTopics();
  }

  loadTopics(): void {
    this.topicService.getTopics().subscribe((data: any) => {
      this.topics = data.map((t: any) => ({
        ...t,
        image: this.getImageForTopic(t.name)
      }));
    });
  }

  getImageForTopic(topicName: string): string {
    switch (topicName.toLowerCase()) {
      case 'html': return 'Htmls.png';
      case 'css': return 'css_s.png';
      case 'javascript': return 'js_s.jpg';
      case 'angular': return 'angulars.png';
      default: return 'default.png';
    }
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/default.png';
  }

  navigateToTopic(topicId: number) {
    this.router.navigate(['/topics', topicId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
