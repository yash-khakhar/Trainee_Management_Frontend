import { Mentor } from "./mentors.model"


export interface MentorList{
    pageNumber: number
    pageSize: number
    totalRecords: number
    data: Mentor[]
}