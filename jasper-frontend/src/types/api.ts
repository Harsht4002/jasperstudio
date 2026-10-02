export type ApiResult<T> =
  | { status: "loading"; data?: undefined; error?: undefined }
  | { status: "success"; data: T; error?: undefined }
  | { status: "empty"; data: T; error?: undefined }
  | { status: "error"; data?: undefined; error: Error };

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};
