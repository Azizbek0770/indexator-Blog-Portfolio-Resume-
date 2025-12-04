import { Router } from "express";

/* ✅ IMPORT FROM routes */
import about from "../routes/about.js";
import hero from "../routes/hero.js";
import services from "../routes/services.js";
import projects from "../routes/projects.js";
import blog from "../routes/blog.js";
import testimonials from "../routes/testimonials.js";
import skills from "../routes/skills.js";
import education from "../routes/education.js";
import experience from "../routes/experiences.js";
import certificates from "../routes/certificates.js";
import settings from "../routes/settings.js";

const router = Router();

router.use("/about", about);
router.use("/hero", hero);
router.use("/services", services);
router.use("/projects", projects);
router.use("/blog", blog);
router.use("/testimonials", testimonials);
router.use("/skills", skills);
router.use("/education", education);
router.use("/experience", experience);
router.use("/certificates", certificates);
router.use("/settings", settings);

export default router;
