import express from "express";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth/index.js";
import "./db.js";

const app = express();
app.use(express.json());

async function main() {
  await setupAuth(app);
  registerAuthRoutes(app);

  const port = parseInt(process.env.PORT || "3001");
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  });
}

main().catch(console.error);
