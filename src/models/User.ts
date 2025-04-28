import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  provider?: string;
  subscription: {
    status: 'free' | 'pro';
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    currentPeriodEnd?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    image: { type: String },
    provider: { type: String, enum: ['credentials', 'google'], default: 'credentials' },
    subscription: {
      status: { type: String, enum: ['free', 'pro'], default: 'free' },
      stripeCustomerId: { type: String },
      stripeSubscriptionId: { type: String },
      currentPeriodEnd: { type: Date },
    },
  },
  { timestamps: true }
);

// Add index for provider
UserSchema.index({ provider: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema); 