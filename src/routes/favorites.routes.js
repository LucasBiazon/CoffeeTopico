import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listMyFavorites, toggleFavorite } from "../controllers/favorites.controller.js";

const r = Router();

r.use(auth());

r.get("/", listMyFavorites);
r.post("/:coffeeId/toggle", toggleFavorite);

export default r;
