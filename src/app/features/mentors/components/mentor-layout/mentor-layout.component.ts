import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorSidebarComponent } from '../mentor-sidebar/mentor-sidebar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-mentor-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, MentorSidebarComponent],
    templateUrl: './mentor-layout.component.html'
})
export class MentorLayoutComponent { }