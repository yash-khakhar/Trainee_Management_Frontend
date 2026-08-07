import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { ReviewRequest } from '../models/review-request.model';
import { ReviewResponse } from '../models/review-response.model';

@Injectable({
    providedIn: 'root'
})
export class ReviewService {

    private http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/Review`;

    addReview(review: ReviewRequest): Observable<ReviewResponse> {
        return this.http.post<ReviewResponse>(this.baseUrl, review);
    }

    getReviewBySubmissionId(submissionId: number): Observable<ReviewResponse> {
        return this.http.get<ReviewResponse>(`${this.baseUrl}/submission/${submissionId}`);
    }
}