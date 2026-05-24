import express from "express";
import { setupAuth, isAuthenticated } from "./replit_integrations/auth/index.js";
import { db } from "./db.js";
import { users, organizations } from "../shared/schema.js";
import { eq } from "drizzle-orm";

const app = express();
app.use(express.json());

await setupAuth(app);

app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      full_name: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || user.email || "User",
      profile_image_url: user.profileImageUrl,
      organization_id: user.organizationId,
      onboarding_completed: user.onboardingCompleted,
    });
  } catch (err) {
    console.error("Get user error:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

app.post("/api/auth/complete-onboarding", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
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
      first_name: user.firstName,
      last_name: user.lastName,
      full_name: user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || user.email || "User",
      profile_image_url: user.profileImageUrl,
      organization_id: user.organizationId,
      onboarding_completed: user.onboardingCompleted,
    });
  } catch (err) {
    console.error("Onboarding error:", err);
    return res.status(500).json({ error: "Onboarding failed" });
  }
});

const port = parseInt(process.env.PORT || "3001");
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
