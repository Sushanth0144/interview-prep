// src/app/admin/admin-questions/admin-questions.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-questions',
  templateUrl: './admin-questions.component.html',
  styleUrls: ['./admin-questions.component.css'],
})
export class AdminQuestionsComponent implements OnInit {
  topics: any[] = [];
  questions: any[] = [];
  selectedTopicId: number | '' = '';
  newQuestion = { text: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadTopics();
  }

  // ✅ Load all topics
  loadTopics(): void {
    this.adminService.getTopics().subscribe({
      next: (data) => (this.topics = data),
      error: (err) => console.error('Error loading topics:', err),
    });
  }

  // ✅ Load questions for the selected topic
  loadQuestions(): void {
    if (!this.selectedTopicId) {
      this.questions = [];
      return;
    }
    this.adminService.getQuestionsByTopic(this.selectedTopicId as number).subscribe({
      next: (data) => (this.questions = data.questions),
      error: (err) => console.error('Error loading questions:', err),
    });
  }

  // ✅ Add a new question
  addQuestion(): void {
    if (!this.newQuestion.text.trim()) return;
    this.adminService
      .addQuestion(this.selectedTopicId as number, { text: this.newQuestion.text })
      .subscribe({
        next: () => {
          this.newQuestion.text = '';
          this.loadQuestions();
        },
        error: (err) => console.error('Error adding question:', err),
      });
  }

  // ✅ Update an existing question
  updateQuestion(question: any): void {
    if (!question.text.trim()) return;
    this.adminService.updateQuestion(question.id, { text: question.text }).subscribe({
      next: () => this.loadQuestions(),
      error: (err) => console.error('Error updating question:', err),
    });
  }

  // ✅ Delete a question
  deleteQuestion(id: number): void {
    if (confirm('Are you sure you want to delete this question?')) {
      this.adminService.deleteQuestion(id).subscribe({
        next: () => this.loadQuestions(),
        error: (err) => console.error('Error deleting question:', err),
      });
    }
  }
}
