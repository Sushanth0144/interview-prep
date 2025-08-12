// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { InterviewComponent } from './interview/interview.component';
import { TopicTabsComponent } from './topic-tabs/topic-tabs.component';
import { TopicQuestionsComponent } from './questions/topic-questions.component';
import { AuthGuard } from './auth.guard';

// Admin components
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminTopicsComponent } from './admin/admin-topics/admin-topics.component';
import { AdminQuestionsComponent } from './admin/admin-questions/admin-questions.component';

const routes: Routes = [
  // Public route
  { path: '', component: HomeComponent },

  // ===== Authenticated User Routes =====
  { path: 'interview', component: InterviewComponent, canActivate: [AuthGuard] },
  { path: 'topics', component: TopicTabsComponent, canActivate: [AuthGuard] },
  { path: 'topics/:id', component: TopicQuestionsComponent, canActivate: [AuthGuard] },

  // ===== Admin Dashboard (Protected) =====
  {
    path: 'admin',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard], // Later replace with AdminGuard if you want strict admin-only
    children: [
      { path: 'topics', component: AdminTopicsComponent },
      { path: 'questions', component: AdminQuestionsComponent },
      { path: '', redirectTo: 'topics', pathMatch: 'full' }, // default child
    ],
  },

  // ===== Wildcard Redirect =====
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
