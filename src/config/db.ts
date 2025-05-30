import mongoose from "mongoose";

const hosts = 'mongodb://admin:admin@0.0.0.0:27017/proyecto?authSource=admin';
const dbName = 'proyecto';  // Cambia según tu base de datos
const replicaSet = 'rs0';

const options = [
  `replicaSet=${replicaSet}`,
  'retryWrites=true',
  'w=majority',
  'readPreference=primary' // for operaciones con el nodo primario
].join('&');

const mongoUri = `mongodb://127.0.0.0:27017`;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(hosts, {
      serverSelectionTimeoutMS: 5000, // tiempo máximo para buscar servidor primario
    });
    console.log('✅ MongoDB replica set conectado');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB:', err);
    process.exit(1);
  }
};
