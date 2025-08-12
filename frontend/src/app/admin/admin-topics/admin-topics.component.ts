import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-topics',
  templateUrl: './admin-topics.component.html',
  styleUrls: ['./admin-topics.component.css'],
})
export class AdminTopicsComponent implements OnInit {
  topics: any[] = [];
  newTopic = { name: '', description: '', link: '' };

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.adminService.getTopics().subscribe((data) => (this.topics = data));
  }

  createTopic() {
    this.adminService.createTopic(this.newTopic).subscribe(() => {
      this.newTopic = { name: '', description: '', link: '' };
      this.loadTopics();
    });
  }

  updateTopic(topic: any) {
    this.adminService.updateTopic(topic.id, topic).subscribe(() => this.loadTopics());
  }

  deleteTopic(id: number) {
    if (confirm('Are you sure to delete this topic?')) {
      this.adminService.deleteTopic(id).subscribe(() => this.loadTopics());
    }
  }
}
