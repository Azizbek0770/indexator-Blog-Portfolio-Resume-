import { Router } from "express";

import about from "./about.js";
import hero from "./hero.js";
import services from "./services.js";
import projects from "./projects.js";
import blog from "./blog.js";
import testimonials from "./testimonials.js";
import skills from "./skills.js";
import education from "./education.js";
import experience from "./experiences.js";
import certificates from "./certificates.js";
import settings from "./settings.js";

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
