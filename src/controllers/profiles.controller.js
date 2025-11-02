
import Profile from "../models/Profile.js";

export async function getMyProfile(req, res) {
  try {
    const userId = req.user?._id ?? req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    const doc = await Profile.findOneAndUpdate(
      { user_id: userId },
      { $setOnInsert: { user_id: userId } },
      { new: true, upsert: true }
    ).lean();

    return res.json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal error" });
  }
}


export async function upsertMyProfile(req, res) {
  const updated = await Profile.findOneAndUpdate(
    { user_id: req.user.id },
    { $set: { ...req.body, user_id: req.user.id } },
    { upsert: true, new: true }
  );
  res.json(updated);
}
