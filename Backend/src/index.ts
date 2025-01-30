import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { Server as HttpServer, createServer as createHttpServer } from "http";
import startSocketServer from "./SocketServer";
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
import { userDB } from "./Model/User";

var JwtPayload = require("jsonwebtoken").JwtPayload;

declare global {
  namespace Express {
    interface Request {
      user?: typeof JwtPayload;
    }
  }
}

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = "Sample JWT Secret";

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
      req.user = user;
      next();
    }
  );
};

app.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

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
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res
    .status(201)
    .send({ message: "User registered successfully", token: token, username });
});

app.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = userDB.getUserByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    res.status(400).send("Invalid credentials");
    return;
  }
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
  res.status(200).send({ token, username });
});

let httpServer: HttpServer;
httpServer = createHttpServer(app);

startSocketServer(httpServer);

httpServer.listen(3005, () => {
  console.info(`Listening on 3005`);
});
