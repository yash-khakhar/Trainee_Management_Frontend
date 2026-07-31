import { Component } from '@angular/core';

import { TraineesListComponent } from './trainee-list.component';
import { AdminLayoutComponent } from '../../../../shared/components/layouts/admin-layout/admin-layout.component';

@Component({
    selector: 'view-app-trainees-list',
    standalone: true,
    imports: [TraineesListComponent, AdminLayoutComponent],
    template: `
        <app-admin-layout>
            <app-trainees-list></app-trainees-list>
        </app-admin-layout>
    `
})
export class ViewTraineesListComponent { }