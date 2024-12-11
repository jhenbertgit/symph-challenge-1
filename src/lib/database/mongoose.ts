import mongoose, { Mongoose } from "mongoose";

/*eslint-disable @typescript-eslint/no-explicit-any */
const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectToDB = async (): Promise<Mongoose> => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URL) {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside .env.local"
    );
  }

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "hulagway",
      bufferCommands: false,
    });

  cached.conn = await cached.promise;

  // Ensure database creation by performing a write operation
  const TestSchema = new mongoose.Schema({ name: String });
  const TestModel = mongoose.model("Test", TestSchema);

  await TestModel.create({ name: "test" });

  return cached.conn;
};
