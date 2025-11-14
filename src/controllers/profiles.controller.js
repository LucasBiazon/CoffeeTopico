import Profile from "../models/Profile.js";

export async function getMyProfile(req, res, next) {
  try {
    const userId = req.user.id;
    let profile = await Profile.findOne({ user: userId }).lean();

    if (!profile) {
      profile = await Profile.create({ user: userId });
    }

    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function upsertMyProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const payload = {
      favoriteRoast: req.body.favoriteRoast,
      prefersMilk: req.body.prefersMilk,
      prefersSugar: req.body.prefersSugar,
      budgetMin: req.body.budgetMin,
      budgetMax: req.body.budgetMax,
      brewMethods: req.body.brewMethods,
    };

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: payload, $setOnInsert: { user: userId } },
      { new: true, upsert: true }
    ).lean();

    res.json(profile);
  } catch (err) {
    next(err);
  }
}
