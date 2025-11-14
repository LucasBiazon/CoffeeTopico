import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { listReviews, createReview } from "../controllers/reviews.controller.js";

const r = Router({ mergeParams: true });

r.get("/", listReviews);
r.post("/", auth(), createReview);

export default r;
