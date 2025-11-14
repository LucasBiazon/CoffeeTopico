import Coffee from '../models/Coffee.js';

export async function recommendByWeather(req, res) {
  try {
    const tempC = parseFloat(req.query.temp_c);
    const isRaining = req.query.is_raining === 'true';
    const partOfDay = req.query.part_of_day || 'day';

    const coffees = await Coffee.find({ available: true }).lean();

    const scored = coffees
      .map((coffee) => {
        let score = 0;

        const attrs = coffee.attributes || {};
        const brewMethods = coffee.brew_methods || [];

        if (!Number.isNaN(tempC)) {
          if (tempC >= 26) {
            if (coffee.type === 'drink') score += 2;
            if (brewMethods.includes('cold-brew')) score += 4;
            if (brewMethods.includes('iced')) score += 3;
            if (coffee.roast === 'light' || coffee.roast === 'medium') score += 1;
            if ((attrs.acidity || 0) >= 3) score += 1;
          } else if (tempC <= 18) {
            if (coffee.type === 'drink') score += 2;
            if (brewMethods.includes('espresso') || brewMethods.includes('mokapot')) {
              score += 3;
            }
            if (brewMethods.includes('steam-milk')) score += 2;
            if (coffee.roast === 'dark') score += 2;
            if ((attrs.body || 0) >= 4) score += 1;
          } else {
            if (coffee.type === 'bean') score += 1;
            if (coffee.roast === 'medium') score += 2;
            if ((attrs.acidity || 0) >= 2 && (attrs.acidity || 0) <= 4) score += 1;
          }
        }

        if (isRaining) {
          if ((attrs.aroma || 0) >= 4) score += 1;
          if (coffee.roast === 'dark') score += 1;
        }

        if (partOfDay === 'morning') {
          if (brewMethods.includes('v60') || brewMethods.includes('kalita')) {
            score += 2;
          }
        } else if (partOfDay === 'night') {
          if ((attrs.acidity || 0) <= 2) score += 1;
        }

        return { coffee, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((item) => item.coffee);

    return res.json({
      items: scored,
      meta: {
        temp_c: Number.isNaN(tempC) ? null : tempC,
        is_raining: isRaining,
        part_of_day: partOfDay,
      },
    });
  } catch (err) {
    console.error('recommendByWeather error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function recommendByAI(req, res) {
  try {
    const {
      favorites = [],
      avoid_contains = [],
      max_price,
      preferred_type,
      preferred_roast = [],
      desired_attributes = {},
    } = req.body || {};

    const allCoffees = await Coffee.find({ available: true }).lean();

    let targetAttrs = { acidity: 3, sweetness: 3, bitterness: 2, body: 3, aroma: 3 };

    const favoriteCoffees = allCoffees.filter((c) => favorites.includes(String(c._id)));
    if (favoriteCoffees.length > 0) {
      const sum = { acidity: 0, sweetness: 0, bitterness: 0, body: 0, aroma: 0 };
      favoriteCoffees.forEach((c) => {
        const a = c.attributes || {};
        sum.acidity += a.acidity ?? 3;
        sum.sweetness += a.sweetness ?? 3;
        sum.bitterness += a.bitterness ?? 2;
        sum.body += a.body ?? 3;
        sum.aroma += a.aroma ?? 3;
      });
      targetAttrs = {
        acidity: sum.acidity / favoriteCoffees.length,
        sweetness: sum.sweetness / favoriteCoffees.length,
        bitterness: sum.bitterness / favoriteCoffees.length,
        body: sum.body / favoriteCoffees.length,
        aroma: sum.aroma / favoriteCoffees.length,
      };
    }

    targetAttrs = {
      ...targetAttrs,
      ...desired_attributes,
    };

    function distance(attrs = {}) {
      const a = {
        acidity: attrs.acidity ?? 3,
        sweetness: attrs.sweetness ?? 3,
        bitterness: attrs.bitterness ?? 2,
        body: attrs.body ?? 3,
        aroma: attrs.aroma ?? 3,
      };
      const d2 =
        (a.acidity - targetAttrs.acidity) ** 2 +
        (a.sweetness - targetAttrs.sweetness) ** 2 +
        (a.bitterness - targetAttrs.bitterness) ** 2 +
        (a.body - targetAttrs.body) ** 2 +
        (a.aroma - targetAttrs.aroma) ** 2;
      return Math.sqrt(d2);
    }

    const recs = allCoffees
      .filter((c) => {
        if (avoid_contains.length > 0) {
          const contains = c.contains || [];
          if (contains.some((i) => avoid_contains.includes(i))) return false;
        }
        if (max_price != null && c.price && c.price.value != null) {
          if (c.price.value > max_price) return false;
        }
        return true;
      })
      .map((c) => {
        let score = 0;

        if (preferred_type && c.type === preferred_type) score += 2;
        if (preferred_roast.length > 0) {
          if (preferred_roast.includes(c.roast)) score += 2;
          else score -= 1;
        }

        const d = distance(c.attributes);
        score += 10 - d;
        if (favorites.includes(String(c._id))) {
          score += 3;
        }

        return { coffee: c, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((x) => x.coffee);

    return res.json({
      items: recs,
      meta: {
        favorites,
        avoid_contains,
        max_price: max_price ?? null,
        preferred_type: preferred_type ?? null,
        preferred_roast,
        target_attributes: targetAttrs,
      },
    });
  } catch (err) {
    console.error('recommendByAI error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
