// src/app/services/topic.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  constructor(private http: HttpClient) {}

  getTopics() {
    return this.http.get(`${environment.apiUrl}/topics`);
  }

  getQuestions(topicId: number) {
    return this.http.get(`${environment.apiUrl}/topics/${topicId}/questions`);
  }

  createTopic(data: any) {
    return this.http.post(`${environment.apiUrl}/topics`, data);
  }

  addQuestion(topicId: number, question: string) {
    return this.http.post(`${environment.apiUrl}/topics/${topicId}/questions`, {
      text: question,
    });
  }
}
