import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import authRouter from "./routes/auth.js";

const app = express();
app.use(express.json());

const pgStore = connectPg(session);
const sessionTtl = 7 * 24 * 60 * 60 * 1000;

app.use(
  session({
    secret: process.env.SESSION_SECRET || "passgen-dev-secret-change-in-prod",
    store: new pgStore({
      conString: process.env.DATABASE_URL,
      createTableIfMissing: true,
      ttl: sessionTtl,
      tableName: "sessions",
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: sessionTtl,
    },
  })
);

app.use("/api/auth", authRouter);

const port = parseInt(process.env.PORT || "3001");
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
