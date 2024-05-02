import { ResponseDto } from "../api/response";

export type ResponseBody<T> = T | ResponseDto | null;
