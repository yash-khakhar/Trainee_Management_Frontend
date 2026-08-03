import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';
import { MentorsService } from '../services/mentors.service';
import { Mentor } from '../models/mentors.model';

@Component({
    selector: 'app-mentor-detail',
    standalone: true,
    imports: [CommonModule, AdminLayoutComponent, RouterModule],
    templateUrl: './mentor-details.component.html'
})
export class MentorDetailComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private mentorService = inject(MentorsService)

    mentor = signal<Mentor | null>(null);
    isLoading = signal<boolean>(true);

    ngOnInit(): void {

        const id = Number(this.route.snapshot.paramMap.get('id'));
        
        this.mentorService.getMentorById(id).subscribe({
            next: (mentor) => {
                this.mentor.set(mentor || null);
                this.isLoading.set(false);
            },
            error: () => {
                this.mentor.set(null);
                this.isLoading.set(false);
            }
        });

    }
}