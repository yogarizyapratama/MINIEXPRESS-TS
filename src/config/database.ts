import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';
import path from 'path';

// Inisialisasi Sequelize untuk SQLite
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join('./database.sqlite'), // Pastikan path ini benar
});

// Fungsi untuk koneksi MongoDB
export const connectMongoDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Mongoose: Connected to MongoDB successfully');
  } catch (error) {
    console.error('Mongoose: Unable to connect to MongoDB:', error);
    throw error;
  }
};