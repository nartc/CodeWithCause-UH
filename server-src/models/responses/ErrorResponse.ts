export interface ErrorResponse {
    thrown?: boolean,
    error?: MongoError;
    message?: string;
}

interface MongoError {
    code?: number;
    message?: string;
    name?: string;
    stack?: string;
}
