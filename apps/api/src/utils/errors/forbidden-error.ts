export class ForbiddenError extends Error {
  statusCode: 403;

  constructor(message?: string) {
    super(message ?? 'Forbidden');
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}
