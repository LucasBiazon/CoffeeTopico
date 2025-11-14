import { Router } from "express";
import {
  listCoffees,
  getCoffeeById,
} from "../controllers/coffees.controller.js";
import {
  listReviewsForCoffee,
  createReviewForCoffee,
} from "../controllers/reviews.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.get("/", listCoffees);
router.get("/:id", getCoffeeById);
router.get("/:id/reviews", listReviewsForCoffee);
router.post("/:id/reviews", authRequired, createReviewForCoffee);

export default router;
