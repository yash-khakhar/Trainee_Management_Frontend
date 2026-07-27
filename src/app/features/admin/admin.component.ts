import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Trainee {
  id: string;
  name: string;
  email: string;
  assignedMentor: string;
}

interface Mentor {
  id: string;
  name: string;
  expertise: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
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
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <!-- Page Header -->
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p class="mt-1 text-sm text-gray-600">Manage trainees, mentors, tasks, and assignments.</p>
        </div>
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
          Admin Control Center
        </span>
      </div>

      <!-- Quick Actions Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group">
          <div class="text-indigo-600 font-semibold group-hover:text-indigo-700">+ Add New Task</div>
          <p class="text-xs text-gray-500 mt-1">Create a new learning task or assignment template.</p>
        </button>

        <button class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group">
          <div class="text-indigo-600 font-semibold group-hover:text-indigo-700">+ Add Trainee / Mentor</div>
          <p class="text-xs text-gray-500 mt-1">Onboard new users to the platform.</p>
        </button>

        <button class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group">
          <div class="text-indigo-600 font-semibold group-hover:text-indigo-700">Assign Task</div>
          <p class="text-xs text-gray-500 mt-1">Distribute tasks to specific trainees.</p>
        </button>

        <button class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-500 hover:shadow-md transition-all text-left group">
          <div class="text-indigo-600 font-semibold group-hover:text-indigo-700">Assign Mentor</div>
          <p class="text-xs text-gray-500 mt-1">Link mentors with designated trainees.</p>
        </button>
      </div>

      <!-- Content Sections -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Trainees & Mentors Section -->
        <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Trainees & Mentors Overview</h2>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trainee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned Mentor</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (trainee of trainees(); track trainee.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ trainee.name }}</div>
                    <div class="text-xs text-gray-500">{{ trainee.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                    {{ trainee.assignedMentor || 'Unassigned' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Task Assignments Section -->
        <div class="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">Active Task Assignments</h2>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trainee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task Title</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned On</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (assignment of assignments(); track assignment.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ assignment.traineeName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ assignment.taskTitle }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                    {{ assignment.assignedDate | date:'mediumDate' }}
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

      </div>

    </div>
  `
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