import type { Response, NextFunction } from 'express';
import { UserEmailMiddleware, RequestWithUserEmail } from './user-email.middleware';

describe('UserEmailMiddleware', () => {
  let middleware: UserEmailMiddleware;
  let next: NextFunction;

  beforeEach(() => {
    middleware = new UserEmailMiddleware();
    next = jest.fn();
  });

  it('sets userEmail from X-User-Email header', () => {
    const req = { headers: { 'x-user-email': 'user@example.com' } } as unknown as RequestWithUserEmail;
    middleware.use(req, {} as Response, next);
    expect(req.userEmail).toBe('user@example.com');
    expect(next).toHaveBeenCalled();
  });

  it('defaults to "anonymous" when header is absent', () => {
    const req = { headers: {} } as unknown as RequestWithUserEmail;
    middleware.use(req, {} as Response, next);
    expect(req.userEmail).toBe('anonymous');
    expect(next).toHaveBeenCalled();
  });

  it('defaults to "anonymous" when header is blank', () => {
    const req = { headers: { 'x-user-email': '   ' } } as unknown as RequestWithUserEmail;
    middleware.use(req, {} as Response, next);
    expect(req.userEmail).toBe('anonymous');
    expect(next).toHaveBeenCalled();
  });
});
