import express from 'express';
import morgan from 'morgan';
import Router from './routes/auth.routes';
import AuthRoutes from './routes/auth.routes'
import { connectDB } from './config/db';


const app = express();
const PORT = process.env.PORT || 3000

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', AuthRoutes);

// app.listen(PORT, () => {
//     console.log("Corriendo")
// })

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Corriendo en ${PORT}`)
    })
});