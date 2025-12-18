export class UnauthorizedError extends Error {
  statusCode: 401;

  constructor(message?: string) {
    super(message ?? 'Unauthorized');
    this.name = 'UnauthorizedError';
    this.statusCode = 401;
  }
}
