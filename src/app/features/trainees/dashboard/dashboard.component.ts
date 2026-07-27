import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface TraineeTask {
  id: string;
  traineeName: string;
  email: string;
  taskTitle: string;
  deadline: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

@Component({
    selector: 'trainee-app-dashboard',
    templateUrl: './dashboard.component.html',
    imports: [CommonModule]
})
export class DashboardComponent implements OnInit {

  private http = inject(HttpClient);
  
  traineeTasks = signal<TraineeTask[]>([
    {
      id: '1',
      traineeName: 'Alice Smith',
      email: 'alice.smith@example.com',
      taskTitle: 'Build Angular Landing Page with Tailwind',
      deadline: '2026-08-10',
      status: 'In Progress'
    },
    {
      id: '2',
      traineeName: 'Bob Jones',
      email: 'bob.jones@example.com',
      taskTitle: 'Implement .NET Core API Endpoints',
      deadline: '2026-08-05',
      status: 'Pending'
    },
    {
      id: '3',
      traineeName: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      taskTitle: 'Setup Entity Framework Core DB Context',
      deadline: '2026-07-28',
      status: 'Completed'
    },
    {
      id: '4',
      traineeName: 'Diana Prince',
      email: 'diana.prince@example.com',
      taskTitle: 'Configure Angular Route Guards and SSR',
      deadline: '2026-08-15',
      status: 'Pending'
    }
  ]);

  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  private fetchDashboardData(): void {

  }
}