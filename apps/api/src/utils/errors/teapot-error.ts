export class TeapotError extends Error {
  statusCode: 418;

  constructor(message: string) {
    super(message);
    this.name = 'TeapotError';
    this.statusCode = 418;
  }
}
