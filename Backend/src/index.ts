import express from 'express';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import rolesRoutes from './routes/role.routes';
import menuRoutes from './routes/menu.routes'; // ✅ nuevo

import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/menu', menuRoutes); // ✅ añadido

// Conexión a la base de datos
connectDB()
  .then(() => {
    console.log("✅ Conectado a MongoDB");
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error("❌ Error conectando a MongoDB:", err);
  });
