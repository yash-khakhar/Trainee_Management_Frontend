import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaskAssignmentService } from '../../services/task-assignment.service';
import { LearningTaskResponse } from '../../../learning-tasks/models/learning-task-response.model';
import { LearningTaskService } from '../../../learning-tasks/services/learning-tasks.service';
import { NotificationService } from '../../../../shared/services/NotificationService.service';

import { Mentor } from '../../../mentors/models/mentors.model';
import { MentorsService } from '../../../mentors/services/mentors.service';
import { Trainee } from '../../../trainees/models/trainee.model';
import { TraineeService } from '../../../trainees/services/trainees.service';
import { CreateTaskAssignmentRequest } from '../../models/create-task-assignment.model';
import { TaskAssignmentStatusEnum } from '../../models/task-assignment-status.enum';

import { ButtonComponent } from '../../../../shared/components/UI/button/button.component';
import { InputComponent } from '../../../../shared/components/UI/text-input/input.component';
import { AdminLayoutComponent } from '../../../admin/components/admin-layout/admin-layout.component';
import { SearchableDropdownComponent, DropdownOption } from '../../../../shared/components/UI/searchable-dropdown/searchable-dropdown.component';
import { TraineeList } from '../../../trainees/models/trainee-list.model';
import { MentorList } from '../../../mentors/models/mentors-list.model';

@Component({
    selector: 'app-add-task-assignment',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        ButtonComponent,
        InputComponent,
        AdminLayoutComponent,
        SearchableDropdownComponent
    ],
    templateUrl: './add-task-assignment.component.html'
})
export class AddTaskAssignmentComponent implements OnInit {

    private fb = inject(FormBuilder);
    private traineeService = inject(TraineeService);
    private mentorService = inject(MentorsService);
    private notificationService = inject(NotificationService);
    private learningTaskService = inject(LearningTaskService);
    private taskAssignmentService = inject(TaskAssignmentService);

    isLoading = signal<boolean>(false);

    rawTrainees = signal<Trainee[]>([]);
    rawMentors = signal<Mentor[]>([]);
    rawTasks = signal<LearningTaskResponse[]>([]);

    traineeOptions = computed<DropdownOption[]>(() =>
        this.rawTrainees().map(t => ({
            id: t.id,
            label: `${t.firstName} ${t.lastName}`,
            subLabel: t.email
        }))
    );

    mentorOptions = computed<DropdownOption[]>(() =>
        this.rawMentors().map(m => ({
            id: m.id,
            label: `${m.firstName} ${m.lastName}`,
            subLabel: m.email
        }))
    );

    taskOptions = computed<DropdownOption[]>(() =>
        this.rawTasks().map(t => ({
            id: t.id,
            label: t.title,
            subLabel: t.expectedTechStack
        }))
    );

    statuses = [
        { label: 'Assigned', value: TaskAssignmentStatusEnum.Assigned },
        { label: 'In Progess', value: TaskAssignmentStatusEnum.InProgess },
        { label: 'Submitted', value: TaskAssignmentStatusEnum.Submitted },
        { label: 'Reviewed', value: TaskAssignmentStatusEnum.Reviewed },
        { label: 'Completed', value: TaskAssignmentStatusEnum.Completed }
    ];

    assignmentForm = this.fb.nonNullable.group({
        traineeId: [0, [Validators.required, Validators.min(1)]],
        mentorId: [0, [Validators.required, Validators.min(1)]],
        taskId: [0, [Validators.required, Validators.min(1)]],
        assignedDate: ['', [Validators.required]],
        status: [TaskAssignmentStatusEnum.Assigned, [Validators.required]],
        remarks: ['']
    });

    ngOnInit(): void {
        this.loadDropdownData();
    }

    loadDropdownData(): void {
        this.traineeService.getTrainees().subscribe({
            next: (res: TraineeList) => {
                const list = res.data || [];
                this.rawTrainees.set(list);
            },
            error: () => this.notificationService.error('Failed to load trainees.')
        });

        this.mentorService.getMentors().subscribe({
            next: (res: MentorList) => {
                const list = res.data || [];
                this.rawMentors.set(list);
            },
            error: () => this.notificationService.error('Failed to load mentors.')
        });

        this.learningTaskService.getAllTasks().subscribe({
            next: (res) => {
                this.rawTasks.set(res);
            },
            error: () => this.notificationService.error('Failed to load tasks.')
        });
    }

    onSubmit(): void {

        if (this.assignmentForm.invalid) {
            this.assignmentForm.markAllAsTouched();
            return;
        }

        this.isLoading.set(true);

        const formValues = this.assignmentForm.getRawValue();
        const payload: CreateTaskAssignmentRequest = {
            traineeId: Number(formValues.traineeId),
            mentorId: Number(formValues.mentorId),
            taskId: Number(formValues.taskId),
            assignedDate: formValues.assignedDate ? new Date(formValues.assignedDate).toISOString().split('T')[0] : '',
            status: formValues.status,
            remarks: formValues.remarks ? formValues.remarks : null
        };

        this.taskAssignmentService.createTaskAssignment(payload).subscribe({
            next: () => {
                this.isLoading.set(false);
                this.notificationService.success('Task assigned successfully!');
                this.assignmentForm.reset({
                    traineeId: 0,
                    mentorId: 0,
                    taskId: 0,
                    status: TaskAssignmentStatusEnum.Assigned
                });
            },
            error: (err) => {
                this.isLoading.set(false);
                this.notificationService.error(err.error?.Message || 'Operation failed. Please check inputs.');
            }
        });
    }
}