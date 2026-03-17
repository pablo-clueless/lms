import type { Role } from "./user";

export type Maybe<T> = T | null;

export type Undefined<T> = T | undefined;

export type Nullable<T> = T | null | undefined;

export type MaybePromise<T> = T | PromiseLike<T>;

export type MaybePromiseOrNull<T> = MaybePromise<Nullable<T>>;

export interface HttpError {
  data: {
    code: number;
    error: string;
    message: string;
    success: boolean;
  };
}

export interface PaginationParams {
  order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  role?: Role;
  search?: string;
  sort_by?: string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    has_next: boolean;
    has_prev: boolean;
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

export interface HttpResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}
