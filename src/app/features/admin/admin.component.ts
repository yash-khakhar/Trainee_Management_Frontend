import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraineeService } from '../trainees/services/trainees.service';
import { TraineeStatusEnum } from '../trainees/models/traineestatus.enum';


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
export class AdminDashboardComponent implements OnInit {
  
  assignments = signal<Assignment[]>([
    { id: '1', traineeName: 'Alice Smith', taskTitle: 'Build Angular Landing Page', assignedDate: '2026-07-20' },
    { id: '2', traineeName: 'Bob Jones', taskTitle: 'Implement .NET Core API Endpoints', assignedDate: '2026-07-22' }
  ]);

  private traineeService = inject(TraineeService)

  traineeList = this.traineeService.traineeList$;

  currentPage = signal<number>(1);
  pageSize = signal<number>(5);
  searchQuery = signal<string>('');
  selectedStatus = signal<TraineeStatusEnum>(TraineeStatusEnum.ACTIVE);

  // to use enum in html template
  TraineeStatusEnum = TraineeStatusEnum

  ngOnInit(): void {
    this.fetchTrainees();
  }

  fetchTrainees(){
    this.traineeService.getTrainees(
      this.currentPage(),
      this.pageSize(),
      this.searchQuery(),
      this.selectedStatus()
    ).subscribe();
  }

  onSearchChange(event: Event){
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
    this.fetchTrainees();
  }

  onStatusChange(event: Event){
    const value = (event.target as HTMLSelectElement).value as TraineeStatusEnum;
    this.selectedStatus.set(value);
    this.currentPage.set(1);
    this.fetchTrainees();
  }

  changePage(newPage: number){
    this.currentPage.set(newPage);
    this.fetchTrainees();
  }

  getTotalPages(totalRecords: number, pageSize: number) : number{
    return Math.ceil(totalRecords / pageSize) || 1;
  }

}