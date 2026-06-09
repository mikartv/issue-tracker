import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Response, NextFunction } from 'express';
import type { Request } from 'express';

export interface RequestWithUserEmail extends Request {
  userEmail: string;
}

@Injectable()
export class UserEmailMiddleware implements NestMiddleware {
  use(req: RequestWithUserEmail, _res: Response, next: NextFunction): void {
    const header = req.headers['x-user-email'];
    req.userEmail =
      typeof header === 'string' && header.trim().length > 0
        ? header.trim()
        : 'anonymous';
    next();
  }
}
