import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());

const pgStore = connectPg(session);
const sessionTtl = 7 * 24 * 60 * 60 * 1000;

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: sessionTtl,
    },
  })
);

app.use("/api/auth", authRouter);

if (process.env.NODE_ENV === "production") {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const port = parseInt(process.env.PORT || "3001");
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
