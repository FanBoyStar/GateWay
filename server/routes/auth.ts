import { Router } from "express";
import bcrypt from "bcrypt";
import { db } from "../db.js";
import { users, organizations } from "../models/auth.js";
import { eq } from "drizzle-orm";

const router = Router();
const SALT_ROUNDS = 12;

router.use((req, _res, next) => {
  console.log(`[auth] ${req.method} ${req.path} | sessionID=${req.sessionID} | userId=${req.session.userId ?? 'NONE'}`);
  next();
});

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

router.post("/sign-up", async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (existing.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const [user] = await db.insert(users).values({
      email: email.toLowerCase(),
      fullName,
      passwordHash,
    }).returning();

    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Sign up failed" });
      }
      return res.json({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        organization_id: user.organizationId,
        onboarding_completed: user.onboardingCompleted,
      });
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    return res.status(500).json({ error: "Sign up failed" });
  }
});

router.post("/sign-in", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.userId = user.id;
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ error: "Sign in failed" });
      }
      return res.json({
        id: user.id,
        email: user.email,
        full_name: user.fullName,
        organization_id: user.organizationId,
        onboarding_completed: user.onboardingCompleted,
      });
    });
  } catch (err) {
    console.error("Sign-in error:", err);
    return res.status(500).json({ error: "Sign in failed" });
  }
});

router.post("/sign-out", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

router.get("/me", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    return res.json({
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      organization_id: user.organizationId,
      onboarding_completed: user.onboardingCompleted,
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.post("/complete-onboarding", async (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  try {
    const { organizationName, website, brandColor } = req.body;
    let organizationId: string | null = null;

    if (organizationName) {
      const [org] = await db.insert(organizations).values({
        name: organizationName,
        website: website || null,
        brandColor: brandColor || null,
        createdBy: userId,
      }).returning();
      organizationId = org.id;
    }

    const [user] = await db.update(users)
      .set({
        organizationId: organizationId,
        onboardingCompleted: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    return res.json({
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      organization_id: user.organizationId,
      onboarding_completed: user.onboardingCompleted,
    });
  } catch (err) {
    console.error("Onboarding error:", err);
    return res.status(500).json({ error: "Onboarding failed" });
  }
});

export default router;
