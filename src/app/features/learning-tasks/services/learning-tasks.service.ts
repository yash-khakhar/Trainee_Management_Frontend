import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LearningTaskResponse } from '../models/learning-task-response.model';
import { UpsertLearningTaskRequest } from '../models/upsert-learning-task-request.model';
import { environment } from '../../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class LearningTaskService {
    
    private http = inject(HttpClient);
    
    private readonly baseUrl = `${environment.apiUrl}/LearningTask`

    createTask(payload: UpsertLearningTaskRequest): Observable<LearningTaskResponse> {
        return this.http.post<LearningTaskResponse>(this.baseUrl, payload);
    }

    getTaskById(id: number): Observable<LearningTaskResponse> {
        return this.http.get<LearningTaskResponse>(`${this.baseUrl}/${id}`);
    }

    updateTask(id: number, payload: UpsertLearningTaskRequest): Observable<LearningTaskResponse> {
        return this.http.put<LearningTaskResponse>(`${this.baseUrl}/${id}`, payload);
    }

    getAllTasks(): Observable<LearningTaskResponse[]> {
        return this.http.get<LearningTaskResponse[]>(this.baseUrl);
    }
}