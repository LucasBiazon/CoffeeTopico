import TasteProfile from '../models/Profile.js';

export async function getMyProfile(req, res) {
  const doc = await TasteProfile.findOne({ user_id: req.user.id });
  res.json(doc || null);
}

export async function upsertMyProfile(req, res) {
  const updated = await TasteProfile.findOneAndUpdate(
    { user_id: req.user.id },
    { $set: { ...req.body, user_id: req.user.id } },
    { upsert: true, new: true }
  );
  res.json(updated);
}
