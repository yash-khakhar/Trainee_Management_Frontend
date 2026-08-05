import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SubmissionResponse } from '../models/SubmissionResponse.model';
import { environment } from '../../../../environments/environment.development';


@Injectable({
    providedIn: 'root'
})
export class SubmissionService {

    private http = inject(HttpClient);
    private baseUrl = `${environment.apiUrl}/Submission`;

    addSubmission(
        taskAssignmentId: number,
        submissionUrl: string,
        notes: string,
        submissionDate: string,
        status: string,
        files: File[]
    ): Observable<SubmissionResponse> {

        const formData = new FormData();
        formData.append('taskAssignmentId', taskAssignmentId.toString());
        formData.append('submissionUrl', submissionUrl);
        formData.append('notes', notes);
        formData.append('submissionDate', submissionDate);
        formData.append('status', status);

        if (files && files.length > 0) {
            files.forEach(file => {
                formData.append('files', file, file.name);
            });
        }

        return this.http.post<SubmissionResponse>(this.baseUrl, formData);
        
    }
}