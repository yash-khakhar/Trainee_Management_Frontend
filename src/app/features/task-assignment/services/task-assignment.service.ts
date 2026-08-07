import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

import { CreateTaskAssignmentRequest } from '../models/create-task-assignment.model';
import { TaskAssignmentResponse } from '../models/task-assignment-response.model';
import { UpdateTaskAssignmentRequest } from '../models/update-task-assignment.model';
import { DetailedTaskAssignmentResponse } from '../models/detailed-task-assignment-response';

@Injectable({
    providedIn: 'root'
})
export class TaskAssignmentService {

    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/TaskAssignment`;

    getTaskAssignments(): Observable<TaskAssignmentResponse[]> {
        return this.http.get<TaskAssignmentResponse[]>(this.baseUrl);
    }

    getTaskAssignmentById(id: number): Observable<DetailedTaskAssignmentResponse> {
        return this.http.get<DetailedTaskAssignmentResponse>(`${this.baseUrl}/${id}`);
    }

    createTaskAssignment(payload: CreateTaskAssignmentRequest): Observable<TaskAssignmentResponse> {
        return this.http.post<TaskAssignmentResponse>(this.baseUrl, payload);
    }

    updateTaskAssignment(id: number, payload: UpdateTaskAssignmentRequest): Observable<TaskAssignmentResponse> {
        return this.http.put<TaskAssignmentResponse>(`${this.baseUrl}/${id}`, payload);
    }

    getTaskAssignmentsByTraineeId(userId: number): Observable<DetailedTaskAssignmentResponse[]> {
        return this.http.get<DetailedTaskAssignmentResponse[]>(`${this.baseUrl}/trainee/${userId}`);
    }

    getTaskAssignmentsByMentorId(userId: number): Observable<DetailedTaskAssignmentResponse[]> {
        return this.http.get<DetailedTaskAssignmentResponse[]>(`${this.baseUrl}/mentor/${userId}`);
    }
}