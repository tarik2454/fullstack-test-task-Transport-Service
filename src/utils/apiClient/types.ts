export type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: unknown };

export type ApiResultServer<T> = {
  data?: T;
  error?: unknown;
};
