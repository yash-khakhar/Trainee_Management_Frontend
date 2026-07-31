import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, map, Observable, tap } from "rxjs";

import { TraineeList } from "../models/trainee-list.model";
import { TraineeStatusEnum } from "../models/traineestatus.enum";
import { Trainee } from "../models/trainee.model";
import { UpdateTraineeRequest } from "../models/update-trainee-request";

@Injectable({
    providedIn: 'root'
})
export class TraineeService{

    private readonly baseUrl = `${environment.apiUrl}/Trainee`

    private http = inject(HttpClient);

    private traineeListSubject = new BehaviorSubject<TraineeList | null>(null);
    readonly traineeList$ = this.traineeListSubject.asObservable();

    getTrainees(
        pageNumber?: number,
        pageSize?: number,
        search?: string,
        status?: TraineeStatusEnum
    ) : Observable<TraineeList>{

        let params = new HttpParams();

        if (pageNumber !== undefined && pageNumber !== null) {
            params = params.set('pageNumber', pageNumber.toString());
        }

        if (pageSize !== undefined && pageSize !== null) {
            params = params.set('pageSize', pageSize.toString());
        }

        if (search && search.trim() !== '') {
            params = params.set('search', search.trim());
        }

        if (status) {
            params = params.set('status', status);
        }
    
        return this.http.get<TraineeList>(this.baseUrl, { params }).pipe(
            tap((response: TraineeList) => {
                this.traineeListSubject.next(response);
            })
        );

    }

    getTraineeById(id: number){
        return this.http.get<Trainee>(`${this.baseUrl}/${id}`).pipe(
            map((response:Trainee) => response)
        );
    }

    updateTrainee(traineeData: UpdateTraineeRequest){
        return this.http.put<Trainee>(`${this.baseUrl}/`, traineeData).pipe(
            map((response:Trainee) => response)
        );
    }

}