import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraineeSidebarComponent } from '../trainee-sidebar/trainee-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-trainee-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, TraineeSidebarComponent],
    templateUrl: './trainee-layout.component.html'
})
export class TraineeLayoutComponent { }