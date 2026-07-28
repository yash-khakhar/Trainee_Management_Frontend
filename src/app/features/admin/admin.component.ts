import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Trainee {
  id: string;
  name: string;
  email: string;
  assignedMentor: string;
}

interface Assignment {
  id: string;
  traineeName: string;
  taskTitle: string;
  assignedDate: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html'
})
export class AdminDashboardComponent {
  trainees = signal<Trainee[]>([
    { id: '1', name: 'Alice Smith', email: 'alice@example.com', assignedMentor: 'John Doe' },
    { id: '2', name: 'Bob Jones', email: 'bob@example.com', assignedMentor: 'Sarah Jenkins' },
    { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', assignedMentor: 'Unassigned' }
  ]);

  assignments = signal<Assignment[]>([
    { id: '1', traineeName: 'Alice Smith', taskTitle: 'Build Angular Landing Page', assignedDate: '2026-07-20' },
    { id: '2', traineeName: 'Bob Jones', taskTitle: 'Implement .NET Core API Endpoints', assignedDate: '2026-07-22' }
  ]);
}