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

export type QueryParams = Record<string, string>;

export interface PaginationParams {
  limit?: number;
  page?: number;
  status?: string;
}

export interface PaginatedResponse<T extends object> {
  K: T[];
  pagination: {
    count: number;
    has_more: boolean;
  };
}

export interface Pagination {
  count: number;
  has_more: boolean;
}

export interface HttpResponse<T> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}
