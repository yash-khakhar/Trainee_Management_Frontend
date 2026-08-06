import { Component } from '@angular/core';

import { MentorsListComponent } from './mentor-list.component';
import { AdminLayoutComponent } from '../../admin/admin-layout/admin-layout.component';

@Component({
    selector: 'view-app-mentors-list',
    standalone: true,
    imports: [MentorsListComponent, AdminLayoutComponent],
    template: `
        <app-admin-layout>
            <app-mentors-list></app-mentors-list>
        </app-admin-layout>
    `
})
export class ViewMentorsListComponent { }