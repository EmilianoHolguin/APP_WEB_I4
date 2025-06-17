import mongoose from "mongoose";

const mongoUri = 'mongodb://admin:admin@localhost:27018/proyecto?authSource=admin';

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Conectado a MongoDB');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1);
  }
};
