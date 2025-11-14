import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { getWeatherRecommendations, getAiRecommendations } from "../controllers/recs.controller.js";

const r = Router();

r.get("/weather-live", getWeatherRecommendations);
r.get("/ai", auth(), getAiRecommendations);

export default r;
