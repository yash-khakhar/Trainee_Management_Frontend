import { Trainee } from "./trainee.model"

export interface TraineeList{
    pageNumber: number
    pageSize: number
    totalRecords: number
    data: Trainee[]
}