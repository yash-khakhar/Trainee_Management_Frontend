import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { DataTableComponent } from '../../../shared/components/UI/data-table/data-table.component';
import { TraineeStatusEnum } from '../models/traineestatus.enum';
import { TraineeService } from '../services/trainees.service';
import { TraineeList } from '../models/trainee-list.model';

@Component({
    selector: 'app-trainees-list',
    standalone: true,
    imports: [CommonModule, RouterModule, DataTableComponent],
    templateUrl: './trainee-list.component.html'
})
export class TraineesListComponent {

    private traineeService = inject(TraineeService);
    private router = inject(Router);

    TraineeStatusEnum = TraineeStatusEnum;

    currentPage = signal<number>(1);
    pageSize = signal<number>(5);
    searchQuery = signal<string>('');
    selectedStatus = signal<TraineeStatusEnum>(TraineeStatusEnum.ACTIVE);
    isLoadingTrainees = signal<boolean>(false);

    private searchQuery$ = toObservable(this.searchQuery);

    traineeData = signal<TraineeList | null>(null);

    constructor() {
        
        this.searchQuery$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            tap(() => this.currentPage.set(1)),
            switchMap(() => {
                this.isLoadingTrainees.set(true);
                return this.traineeService.getTrainees(
                    this.currentPage(),
                    this.pageSize(),
                    this.searchQuery(),
                    this.selectedStatus()
                ).pipe(
                    finalize(() => this.isLoadingTrainees.set(false))
                );
            })
        ).subscribe({
            next: (response) => {
                if (response) this.traineeData.set(response);
            }
        });

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

    fetchTrainees() {
        this.isLoadingTrainees.set(true);

        this.traineeService.getTrainees(
            this.currentPage(),
            this.pageSize(),
            this.searchQuery(),
            this.selectedStatus()
        ).pipe(
            finalize(() => this.isLoadingTrainees.set(false))
        ).subscribe({
            next: (response) => {
                if (response) {
                    this.traineeData.set(response);
                }
            },
            error: (err) => {
            }
        });
    }

    getTotalPages = computed(() => {
        const data = this.traineeData();
        return Math.ceil((data?.totalRecords || 0) / this.pageSize()) || 1;
    });

    selectTrainee(id: number) {
        this.router.navigate(['/admin/trainees', id]);
    }
}