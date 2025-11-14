import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { listMyFavorites, toggleFavorite } from "../controllers/favorites.controller.js";

const router = Router();

router.get("/", authRequired, listMyFavorites);
router.post("/:id/toggle", authRequired, toggleFavorite);

export default router;
