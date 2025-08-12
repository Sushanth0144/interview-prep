// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ===================== TOPICS =====================
  getTopics(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/topics`);
  }

  createTopic(data: { name: string; description?: string; link?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/topics`, data);
  }

  updateTopic(id: number, data: { name?: string; description?: string; link?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/topics/${id}`, data);
  }

  deleteTopic(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/topics/${id}`);
  }

  // ===================== QUESTIONS =====================
  getQuestionsByTopic(topicId: number): Observable<{ topic: any; questions: any[] }> {
    return this.http.get<{ topic: any; questions: any[] }>(
      `${this.apiUrl}/topics/${topicId}/questions`
    );
  }

  addQuestion(topicId: number, data: { text: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/topics/${topicId}/questions`, data);
  }

  updateQuestion(id: number, data: { text: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/questions/${id}`, data);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/questions/${id}`);
  }
}
