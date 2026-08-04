import { inject, Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment.development";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

import { MentorList } from "../models/mentors-list.model";
import { MentorStatusEnum } from "../models/mentorstatus.enum";
import { Mentor } from "../models/mentors.model";
import { UpdateMentorRequest } from "../models/update-mentor-request";

@Injectable({
    providedIn: 'root'
})
export class MentorsService{

    private readonly baseUrl = `${environment.apiUrl}/Mentor`

    private http = inject(HttpClient);

    getMentors(
        pageNumber?: number,
        pageSize?: number,
        search?: string,
        status?: MentorStatusEnum
    ) : Observable<MentorList>{

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
    
        return this.http.get<MentorList>(this.baseUrl, { params });

    }

    getMentorById(id: number){
        return this.http.get<Mentor>(`${this.baseUrl}/${id}`);
    }

    updateMentor(mentorData: UpdateMentorRequest){
        return this.http.put<Mentor>(`${this.baseUrl}/${mentorData.id}`, mentorData);
    }

}