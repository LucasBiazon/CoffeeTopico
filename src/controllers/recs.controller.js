import Coffee from "../models/Coffee.js";
import Review from "../models/review.model.js";

async function fetchWeatherForCity(city) {
  const apiKey = process.env.WEATHER_API_KEY;
  const base = process.env.WEATHER_API_BASE || "https://api.openweathermap.org/data/2.5";

  if (!apiKey) {
    return null;
  }

  const url = `${base}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=pt_br`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Weather API error: ${res.status}`);
  }
  return res.json();
}

function classifyWeather(weather) {
  if (!weather) {
    return {
      temp: 24,
      main: "clear",
      bucket: "mild",
      isRainy: false,
      isCloudy: false,
    };
  }

  const temp = weather?.main?.temp ?? 25;
  const main = (weather?.weather?.[0]?.main || "").toLowerCase();

  let bucket = "mild";
  if (temp >= 28) bucket = "hot";
  else if (temp <= 16) bucket = "cold";
  else if (temp >= 22) bucket = "warm";

  const isRainy = main.includes("rain");
  const isCloudy = main.includes("cloud");

  return { bucket, isRainy, isCloudy, temp, main };
}

function buildWeatherQuery(classification) {
  const { bucket, isRainy } = classification;
  const filter = { available: true };

  if (bucket === "hot") {
    filter.$or = [
      { temperature: "cold" },
      { brew_methods: "cold-brew" },
      { recommended_weather: "hot" },
    ];
  } else if (bucket === "cold") {
    filter.$or = [
      { temperature: "hot" },
      { contains: "milk" },
      { recommended_weather: "cold" },
    ];
  } else if (bucket === "warm") {
    filter.$or = [
      { temperature: "either" },
      { tags: "equilibrado" },
    ];
  } else {
    filter.$or = [
      { temperature: "either" },
      { recommended_weather: "mild" },
    ];
  }

  if (isRainy) {
    filter.$or.push({ tags: "conforto" });
  }

  return filter;
}

export async function getWeatherRecommendations(req, res, next) {
  try {
    const city = req.query.city || process.env.DEFAULT_WEATHER_CITY || "Sao Paulo,BR";

    const weatherRaw = await fetchWeatherForCity(city);
    const classification = classifyWeather(weatherRaw);
    const mongoFilter = buildWeatherQuery(classification);

    const coffees = await Coffee.find(mongoFilter)
      .sort({ rating_avg: -1 })
      .limit(6)
      .lean();

    return res.json({
      city,
      weather: {
        temp: classification.temp,
        main: classification.main,
        bucket: classification.bucket,
        isRainy: classification.isRainy,
        isCloudy: classification.isCloudy,
      },
      filter: mongoFilter,
      items: coffees,
      usedFallback: !weatherRaw,
      llm_explanation: null,
    });
  } catch (err) {
    next(err);
  }
}

function computeUserPreference(reviewsWithCoffee) {
  if (!reviewsWithCoffee.length) {
    return null;
  }

  const sums = { acidity: 0, sweetness: 0, bitterness: 0, body: 0, aroma: 0 };
  let totalWeight = 0;
  const tastingCounter = {};

  for (const r of reviewsWithCoffee) {
    const rating = r.rating || 3;
    const c = r.coffee;
    if (!c || !c.attributes) continue;

    Object.keys(sums).forEach((k) => {
      sums[k] += (c.attributes[k] || 0) * rating;
    });

    (c.tasting_notes || []).forEach((note) => {
      tastingCounter[note] = (tastingCounter[note] || 0) + rating;
    });

    totalWeight += rating;
  }

  if (!totalWeight) return null;

  const prefs = {};
  Object.keys(sums).forEach((k) => {
    prefs[k] = sums[k] / totalWeight;
  });

  const topNotes = Object.entries(tastingCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([note]) => note);

  return { attributes: prefs, topNotes };
}

function scoreCoffee(coffee, pref) {
  let score = 0;
  const keys = ["acidity", "sweetness", "bitterness", "body", "aroma"];

  keys.forEach((k) => {
    const cVal = coffee.attributes?.[k] ?? 0;
    const pVal = pref.attributes[k] ?? 0;
    score -= Math.abs(cVal - pVal);
  });

  const notes = coffee.tasting_notes || [];
  const shared = notes.filter((n) => pref.topNotes.includes(n));
  score += shared.length * 1.5;
  score += (coffee.rating_avg || 0) * 0.5;

  return score;
}

export async function getAiRecommendations(req, res, next) {
  try {
    const userId = req.user.id;

    const reviews = await Review.find({ user_id: userId })
      .populate("coffee")
      .lean();

    const pref = computeUserPreference(reviews);

    if (!pref) {
      const best = await Coffee.find({ available: true })
        .sort({ rating_avg: -1 })
        .limit(6)
        .lean();

      return res.json({
        mode: "top_rated",
        items: best,
        preference: null,
      });
    }

    const candidateCoffees = await Coffee.find({ available: true }).lean();

    const scored = candidateCoffees
      .map((c) => ({ coffee: c, score: scoreCoffee(c, pref) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    return res.json({
      mode: "personalized",
      preference: pref,
      items: scored.map((s) => s.coffee),
    });
  } catch (err) {
    next(err);
  }
}
