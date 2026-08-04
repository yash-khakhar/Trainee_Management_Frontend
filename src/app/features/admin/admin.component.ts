import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

import { TraineeService } from '../trainees/services/trainees.service';
import { TraineeStatusEnum } from '../trainees/models/traineestatus.enum';
import { TraineeList } from '../trainees/models/trainee-list.model';
import { ButtonComponent } from '../../shared/components/UI/button/button.component';
import { AdminLayoutComponent } from '../../shared/components/layouts/admin-layout/admin-layout.component';
import { TraineesListComponent } from '../trainees/trainee-list/trainee-list.component';

interface Assignment {
  id: string;
  traineeName: string;
  taskTitle: string;
  assignedDate: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, AdminLayoutComponent, TraineesListComponent],
  templateUrl: './admin.component.html'
})
export class AdminDashboardComponent implements OnInit {
  assignments = signal<Assignment[]>([
    { id: '1', traineeName: 'Alice Smith', taskTitle: 'Build Angular Landing Page', assignedDate: '2026-07-20' },
    { id: '2', traineeName: 'Bob Jones', taskTitle: 'Implement .NET Core API Endpoints', assignedDate: '2026-07-22' }
  ]);

  private router = inject(Router);
  private traineeService = inject(TraineeService);

  traineeData = signal<TraineeList | null>(null);
  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  searchQuery = signal<string>('');
  selectedStatus = signal<TraineeStatusEnum>(TraineeStatusEnum.ACTIVE);
  isLoadingTrainees = signal<boolean>(false);

  TraineeStatusEnum = TraineeStatusEnum;

  ngOnInit(): void {
    this.fetchTrainees();
  }

  fetchTrainees() {

    this.isLoadingTrainees.set(true);

    this.traineeService.getTrainees(
      this.currentPage(),
      this.pageSize(),
      this.searchQuery(),
      this.selectedStatus()
    ).pipe(finalize(() => this.isLoadingTrainees.set(false))).subscribe(data => {
      if(data){
        this.traineeData.set(data);
      }
    });

  }

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.fetchTrainees();
  }

  onStatusChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value as TraineeStatusEnum;
    this.selectedStatus.set(value);
    this.currentPage.set(1);
    this.fetchTrainees();
  }

  changePage(newPage: number) {
    this.currentPage.set(newPage);
    this.fetchTrainees();
  }

  getTotalPages(totalRecords: number, pageSize: number): number {
    return Math.ceil(totalRecords / pageSize) || 1;
  }

  openAddTaskModal() { }
  openAddUserModal() { this.router.navigate(['/admin/create-user']); }
  openAssignTaskModal() { }
  openAssignMentorModal() { }
}