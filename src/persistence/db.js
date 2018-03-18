import mongoose from 'mongoose';

const { DB_URL, DB_USER, DB_PASSWORD } = process.env;

export function init() {
  return mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URL}`);
}
