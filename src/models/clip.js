import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const connection = mongoose.createConnection(process.env.MONGO_URL);

const { Schema } = mongoose;

const clipSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    clipUrl: { type: String, required: true },
  },
);

export default connection.model('Clip', clipSchema);
