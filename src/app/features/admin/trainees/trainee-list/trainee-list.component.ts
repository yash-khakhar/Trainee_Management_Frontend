import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, finalize, distinctUntilChanged } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { DataTableComponent } from '../../../../shared/components/UI/data-table/data-table.component';
import { TraineeStatusEnum } from '../../../trainees/models/traineestatus.enum';
import { TraineeService } from '../../../trainees/services/trainees.service';
import { TraineeList } from '../../../trainees/models/trainee-list.model';

@Component({
    selector: 'app-trainees-list',
    standalone: true,
    imports: [CommonModule, RouterModule, DataTableComponent],
    templateUrl: './trainee-list.component.html'
})
export class TraineesListComponent {

    currentPage = signal<number>(1);
    pageSize = signal<number>(5);
    searchQuery = signal<string>('');
    selectedStatus = signal<TraineeStatusEnum>(TraineeStatusEnum.ACTIVE);
    isLoadingTrainees = signal<boolean>(false);

    TraineeStatusEnum = TraineeStatusEnum;

    private traineeService = inject(TraineeService);

    private router = inject(Router);

    traineeData = signal<TraineeList | null>(null);

    private search$ = toObservable(this.searchQuery);

    constructor() {
        this.search$.pipe(
            debounceTime(400), 
            distinctUntilChanged() 
        ).subscribe(query => {
            this.currentPage.set(1);
            this.fetchTrainees();
        });
    }

    ngOnInit(): void {
        this.traineeService.traineeList$.subscribe(data => {
            if (data) {
                this.traineeData.set(data);
            }
        });
        this.fetchTrainees();
    }

    fetchTrainees() {
        this.isLoadingTrainees.set(true);
        this.traineeService.getTrainees(
            this.currentPage(),
            this.pageSize(),
            this.searchQuery(),
            this.selectedStatus()
        ).pipe(finalize(() => this.isLoadingTrainees.set(false))).subscribe();
    }

    onSearchChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value);
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

    selectTrainee(id: number) {
        this.router.navigate(['/admin/trainees', id]);
    }
}