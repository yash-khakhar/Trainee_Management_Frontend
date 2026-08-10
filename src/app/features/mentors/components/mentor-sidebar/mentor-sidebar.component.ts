import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-mentor-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './mentor-sidebar.component.html'
})
export class MentorSidebarComponent { }