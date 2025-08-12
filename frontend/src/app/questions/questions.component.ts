// src/app/questions/questions.component.ts
import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {
  topics: any[] = [];

  constructor(private questionService: QuestionService, private router: Router) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.questionService.getQuestions().subscribe((data: any) => {
      // Adjust based on your API response
      this.topics = data.topics || data || [];
    });
  }

  navigateToTopic(topicId: number) {
    this.router.navigate([`/topics/${topicId}`]);
  }
}
