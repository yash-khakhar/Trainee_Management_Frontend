export interface SubmissionFileResponse{
    id: number 
    submissionId: number
    filePath: string 
    fileName: string 
    fileSizeInBytes: number
    contentType: number
    uploadedDate: Date
}