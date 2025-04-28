// src/lib/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

interface GlobalWithMongoose {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}
declare const global: GlobalWithMongoose;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB()  {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false, // Optional Mongoose option
    };
    if (!cached?.promise) {
      const opts = {
        bufferCommands: false,
      };
  
      cached!.promise = mongoose.connect(MONGODB_URI, opts);
    }
  
    try {
      const mongoose = await cached!.promise;
      cached!.conn = mongoose;
      return mongoose;
    } catch (e) {
      cached!.promise = null;
      throw e;
    }
  }
}
export default connectDB;
