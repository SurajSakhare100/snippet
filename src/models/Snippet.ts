import mongoose, { Schema, Document } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  code: string;
  language: string;
  tags: string[];
  userId: mongoose.Types.ObjectId;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SnippetSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    tags: [{ type: String }],
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for faster queries
SnippetSchema.index({ userId: 1, createdAt: -1 });
SnippetSchema.index({ tags: 1 });

export default mongoose.models.Snippet || mongoose.model<ISnippet>('Snippet', SnippetSchema); 