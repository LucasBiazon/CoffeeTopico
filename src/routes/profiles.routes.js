import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getMyProfile, upsertMyProfile } from "../controllers/profiles.controller.js";

const router = Router();

router.get("/me", authRequired, getMyProfile);
router.put("/me", authRequired, upsertMyProfile);

export default router;
