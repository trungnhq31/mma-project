import mongoose from 'mongoose';

export async function connectMongo(): Promise<void> {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/evcare_db';
  await mongoose.connect(uri);
}

