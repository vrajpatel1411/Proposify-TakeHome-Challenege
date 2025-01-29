import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server as HttpServer, createServer as createHttpServer } from "http";
import startSocketServer from "./SocketServer";

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var JwtPayload = require("jsonwebtoken").JwtPayload;
// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: typeof JwtPayload;
    }
  }
}

// Define the app
const app = express();
// Use middlewares
app.use(cors());
app.use(express.json());

// In-memory database simulation for users
interface User {
  id: string;
  username: string;
  passwordHash: string;
}

class InMemoryUserDatabase {
  private users: { [key: string]: User } = {};

  // Add a new user (register)
  addUser(username: string, password: string): User {
    const id = Math.random().toString(36).substr(2, 9); // Generate a random user ID
    const passwordHash = bcrypt.hashSync(password, 10); // Hash the password
    const user = { id, username, passwordHash };
    this.users[username] = user;
    return user;
  }

  // Get user by username
  getUserByUsername(username: string): User | undefined {
    return this.users[username];
  }
}

const userDB = new InMemoryUserDatabase();
const JWT_SECRET = "your-jwt-secret"; // Secret key for signing JWT tokens

const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    res.status(403).send("Access denied.");
    return;
  }

  jwt.verify(
    token,
    JWT_SECRET,
    (err: any, user: typeof JwtPayload | undefined) => {
      if (err) return res.status(403).send("Invalid token.");
      req.user = user; // Attach the decoded user to the request
      next();
    }
  );
};

app.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  console.log("username", username);
  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }

  const existingUser = userDB.getUserByUsername(username);
  if (existingUser) {
    res.status(400).send("Username already taken");
    return;
  }

  const user = userDB.addUser(username, password);
  res.status(201).send({ message: "User registered successfully" });
});

// Login Route
app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = userDB.getUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(400).send("Invalid credentials");
    return;
  }

  // Generate JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).send({ token });
});

app.get(
  "/protected",
  verifyToken,
  async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
      res.send(
        `Hello ${req.user.username}, you have access to this protected route!`
      );
    } else {
      res.status(401).send("User not authenticated.");
    }
  }
);

let httpServer: HttpServer;
httpServer = createHttpServer(app);

startSocketServer(httpServer);

httpServer.listen(3005, () => {
  console.info(`Listening on 3005`);
});
