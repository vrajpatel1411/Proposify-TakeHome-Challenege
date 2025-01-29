// types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Add the 'user' property to the Request interface
    }
  }
}
