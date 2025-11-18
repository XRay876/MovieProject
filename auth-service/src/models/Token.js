import { Schema, model } from 'mongoose';

const tokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    accessToken: {
      type: String,
      required: true
    },
    refreshToken: {
      type: String,
      required: true
    },
    userAgent: {
      type: String
    },
    ip: {
      type: String
    },
    isRevoked: {
      type: Boolean,
      default: false
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = model('Token', tokenSchema);

export default Token;
