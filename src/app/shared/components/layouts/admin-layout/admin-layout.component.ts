import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, SidebarComponent],
    templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent { }