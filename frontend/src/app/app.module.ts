// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Angular Material Modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { InterviewComponent } from './interview/interview.component';
import { QuestionsComponent } from './questions/questions.component';
import { TopicQuestionsComponent } from './questions/topic-questions.component';
import { HomeComponent } from './home/home.component';
import { TopicTabsComponent } from './topic-tabs/topic-tabs.component';

// ✅ Admin Dashboard Components
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminTopicsComponent } from './admin/admin-topics/admin-topics.component';
import { AdminQuestionsComponent } from './admin/admin-questions/admin-questions.component';

// Services and Guards
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { QuestionService } from './services/question.service';
import { TopicService } from './services/topic.service';
import { AdminService } from './services/admin.service';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InterviewComponent,
    QuestionsComponent,
    TopicQuestionsComponent,
    HomeComponent,
    TopicTabsComponent,

    // ✅ Admin Components
    AdminDashboardComponent,
    AdminTopicsComponent,
    AdminQuestionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,            // ✅ Required for ngModel
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,

    // Angular Material Modules
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatCardModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule
  ],
  providers: [
    AuthService,
    QuestionService,
    TopicService,
    AdminService,  // ✅ provide AdminService
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
