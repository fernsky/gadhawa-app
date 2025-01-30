export class AuthError extends Error {
  constructor(
    public code: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AuthError";
  }
}
