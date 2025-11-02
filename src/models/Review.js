import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  coffee_id: {
    type: mongoose.Types.ObjectId,
    ref: 'Coffee',
    required: true,
    index: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true
  }
}, { timestamps: true });

ReviewSchema.index({ user_id: 1, coffee_id: 1 }, { unique: true });

export default mongoose.model('Review', ReviewSchema);
