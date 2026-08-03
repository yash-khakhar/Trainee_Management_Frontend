import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';

import { AdminLayoutComponent } from '../../../shared/components/layouts/admin-layout/admin-layout.component';
import { TraineeService } from '../services/trainees.service';
import { Trainee } from '../models/trainee.model';

@Component({
    selector: 'app-trainee-detail',
    standalone: true,
    imports: [CommonModule, AdminLayoutComponent, RouterModule],
    templateUrl: './trainee-details.component.html'
})
export class TraineeDetailComponent implements OnInit {

    private route = inject(ActivatedRoute);
    private traineeService = inject(TraineeService)

    trainee = signal<Trainee | null>(null);
    isLoading = signal<boolean>(true);

    ngOnInit(): void {

        const id = Number(this.route.snapshot.paramMap.get('id'));
        
        this.traineeService.getTraineeById(id).subscribe({
            next: (trainee) => {
                this.trainee.set(trainee || null);
                this.isLoading.set(false);
            },
            error: () => {
                this.trainee.set(null);
                this.isLoading.set(false);
            }
        });

    }
}