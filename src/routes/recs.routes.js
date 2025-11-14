import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  getWeatherRecommendations,
  getPersonalizedRecommendations,
} from "../controllers/recs.controller.js";

const router = Router();

router.get("/weather-live", getWeatherRecommendations);
router.get("/ai", authRequired, getPersonalizedRecommendations);

export default router;
