export interface TodoPatchReq {
    title?:       string;
    description?: string;
    [key: string]: any;
}
