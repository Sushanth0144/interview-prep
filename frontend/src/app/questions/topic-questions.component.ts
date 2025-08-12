import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TopicService } from '../services/topic.service';

@Component({
  selector: 'app-topic-questions',
  templateUrl: './topic-questions.component.html',
  styleUrls: ['./topic-questions.component.css']
})
export class TopicQuestionsComponent implements OnInit {
  topicId!: number;
  topic: any = null;
  questions: any[] = [];
  isLoading = true;
  errorMessage = '';
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private topicService: TopicService
  ) {}

  ngOnInit() {
    // ✅ Track login state
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });

    // ✅ Get topicId from URL
    const id = this.route.snapshot.paramMap.get('id');
    this.topicId = id ? Number(id) : 0;

    if (!this.topicId) {
      this.errorMessage = 'No topic ID found.';
      this.isLoading = false;
      return;
    }

    // ✅ Fetch topic data from backend
    this.loadTopicData();
  }

  loadTopicData(): void {
    this.topicService.getQuestions(this.topicId).subscribe({
      next: (data: any) => {
        this.topic = data.topic;
        this.questions = data.questions || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading topic data:', err);
        this.errorMessage = 'Failed to load topic data.';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/topics']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
