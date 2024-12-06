import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/testdb');
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});
