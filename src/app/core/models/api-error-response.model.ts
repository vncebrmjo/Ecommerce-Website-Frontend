export interface ApiErrorResponseModel {
    status: number;
    title: string;
    detail?: string;
    errors?: { [key: string]: string[] };
}
