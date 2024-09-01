import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const jwtMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY || 'veryverysecret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Type guard to ensure `decoded` is of type `JwtPayload`
    if (typeof decoded === 'object' && decoded !== null) {
      req.user = decoded;
    } else {
      req.user = undefined;
    }

    next();
  });
};

export const generateToken = (user: { id: string; email: string }) => {
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.SECRET_KEY || 'veryverysecret', { expiresIn: '1h' }); // Token berlaku selama 1 jam
  return token;
}