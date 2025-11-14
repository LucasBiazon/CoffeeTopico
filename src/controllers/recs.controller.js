import axios from "axios";
import Coffee from "../models/Coffee.js";
import env from "../config/env.js";

export async function getWeatherRecommendations(req, res, next) {
  try {
    const city = req.query.city || "Sao Paulo,BR";

    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "WEATHER_API_KEY não configurada" });
    }

    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: { q: city, units: "metric", appid: apiKey },
      }
    );

    const temp = response.data.main.temp; // °C
    const isRaining = response.data.weather.some((w) =>
      String(w.main).toLowerCase().includes("rain")
    );

    const query = { available: true };

    if (temp <= 15 || isRaining) {
      query.roast = { $in: ["medium", "dark"] };
    } else if (temp >= 26) {
      query.roast = { $in: ["light", "medium"] };
    }

    const coffees = await Coffee.find(query)
      .sort({ rating_avg: -1 })
      .limit(8)
      .lean();

    res.json({
      context: {
        city,
        temp,
        isRaining,
      },
      items: coffees,
    });
  } catch (err) {
    next(err);
  }
}


import Review from "../models/Review.js";
import Coffee from "../models/Coffee.js";

export async function getPersonalizedRecommendations(req, res, next) {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    if (reviews.length === 0) {
      const fallback = await Coffee.find({ available: true })
        .sort({ rating_avg: -1, rating_count: -1 })
        .limit(8)
        .lean();
      return res.json({ items: fallback, usedFallback: true });
    }

    const likedIds = reviews
      .filter((r) => r.rating >= 4)
      .map((r) => r.coffee);

    const likedCoffees = await Coffee.find({ _id: { $in: likedIds } }).lean();

    const roastPrefs = {};
    let roastSum = 0;
    for (const c of likedCoffees) {
      if (!c.roast) continue;
      roastPrefs[c.roast] = (roastPrefs[c.roast] || 0) + 1;
      roastSum++;
    }

    const roastWeights =
      roastSum > 0
        ? Object.fromEntries(
          Object.entries(roastPrefs).map(([k, v]) => [k, v / roastSum])
        )
        : {};

    const tastingCount = {};
    let tastingTotal = 0;
    for (const c of likedCoffees) {
      (c.tasting_notes || []).forEach((note) => {
        const key = String(note).toLowerCase();
        tastingCount[key] = (tastingCount[key] || 0) + 1;
        tastingTotal++;
      });
    }

    const tastingWeights =
      tastingTotal > 0
        ? Object.fromEntries(
          Object.entries(tastingCount).map(([k, v]) => [k, v / tastingTotal])
        )
        : {};

    const candidates = await Coffee.find({ available: true })
      .sort({ rating_avg: -1, rating_count: -1 })
      .limit(80)
      .lean();

    function scoreCoffee(coffee) {
      let score = 0;

      if (coffee.roast && roastWeights[coffee.roast]) {
        score += 0.6 * roastWeights[coffee.roast];
      }

      if (coffee.tasting_notes && coffee.tasting_notes.length > 0) {
        let notesScore = 0;
        for (const note of coffee.tasting_notes) {
          notesScore += tastingWeights[String(note).toLowerCase()] || 0;
        }
        score += 0.3 * (notesScore / coffee.tasting_notes.length || 0);
      }

      if (coffee.rating_avg) {
        score += 0.1 * coffee.rating_avg / 5;
      }

      return score;
    }

    const scored = candidates
      .filter(
        (c) =>
          !likedIds.some((id) => id.toString() === c._id.toString())
      )
      .map((c) => ({ coffee: c, score: scoreCoffee(c) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((s) => s.coffee);

    res.json({
      items: scored,
      usedFallback: false,
    });
  } catch (err) {
    next(err);
  }
}
