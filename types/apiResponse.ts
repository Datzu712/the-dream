export type ApiResponse<T, AdditionalData = object> = {
    [P in keyof AdditionalData]: AdditionalData[P];
} & {
    message?: string;
    data?: T;
    error?: string;
    statusCode?: number;
    errors?: string[];
};
