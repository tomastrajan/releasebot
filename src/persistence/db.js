import mongoose from 'mongoose';

const { DB_URL, DB_USER, DB_PASSWORD } = process.env;

mongoose.set('debug', console.log.bind(console, 'Database EXEC -'));

export const initDb = async () => {
  console.log('Database INIT - START');
  const result = await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_URL}`);
  console.log('Database INIT - SUCCESS');
  return result;
};
