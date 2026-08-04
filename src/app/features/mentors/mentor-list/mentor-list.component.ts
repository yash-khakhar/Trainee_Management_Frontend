import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { DataTableComponent } from '../../../shared/components/UI/data-table/data-table.component';
import { MentorStatusEnum } from '../models/mentorstatus.enum';
import { MentorsService } from '../services/mentors.service';
import { MentorList } from '../models/mentors-list.model';
import { NotificationService } from '../../../shared/services/NotificationService.service';

@Component({
    selector: 'app-mentors-list',
    standalone: true,
    imports: [CommonModule, RouterModule, DataTableComponent],
    templateUrl: './mentor-list.component.html'
})
export class MentorsListComponent {

    private mentorService = inject(MentorsService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    MentorStatusEnum = MentorStatusEnum;

    currentPage = signal<number>(1);
    pageSize = signal<number>(5);
    searchQuery = signal<string>('');
    selectedStatus = signal<MentorStatusEnum>(MentorStatusEnum.ACTIVE);
    isLoading = signal<boolean>(false);

    private searchQuery$ = toObservable(this.searchQuery);

    mentorData = signal<MentorList | null>(null);

    constructor() {
       
        this.searchQuery$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            tap(() => this.currentPage.set(1)),
            switchMap(() => {
                this.isLoading.set(true);
                return this.mentorService.getMentors(
                    this.currentPage(),
                    this.pageSize(),
                    this.searchQuery(),
                    this.selectedStatus()
                ).pipe(
                    finalize(() => this.isLoading.set(false))
                );
            })
        ).subscribe({
            next: (response) => {
                if (response) {
                    this.mentorData.set(response);
                }
            },
            error: (err) => {
                this.notificationService.error(err.error?.Message || 'Unexpected Error: Failed to load mentors');
            }
        });
    }

    onSearchChange(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.searchQuery.set(value); 
    }

    onStatusChange(event: Event) {
        const value = (event.target as HTMLSelectElement).value as MentorStatusEnum;
        this.selectedStatus.set(value);
        this.currentPage.set(1);
        this.fetchMentors();
    }

    changePage(newPage: number) {
        this.currentPage.set(newPage);
        this.fetchMentors();
    }

    fetchMentors() {
        this.isLoading.set(true);

        this.mentorService.getMentors(
            this.currentPage(),
            this.pageSize(),
            this.searchQuery(),
            this.selectedStatus()
        ).pipe(
            finalize(() => this.isLoading.set(false))
        ).subscribe({
            next: (response) => {
                if (response) {
                    this.mentorData.set(response);
                }
            },
            error: (err) => {
                this.notificationService.error(err.error?.Message || 'Unexpected Error: Failed to load mentors');
            }
        });
    }

    getTotalPages = computed(() => {
        const data = this.mentorData();
        return Math.ceil((data?.totalRecords || 0) / this.pageSize()) || 1;
    });

    selectMentor(id: number) {
        this.router.navigate(['/admin/mentors', id]);
    }
}