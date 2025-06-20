// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UserForm from './modules/User/UserForm';
import Dashboard from './modules/Dashboard/Dashboard';
import ProductForm from './modules/Product/ProductForm';
import OrderForm from './modules/Order/OrderForm';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/users">Usuarios</Link></li>
          <li><Link to="/products">Productos</Link></li>
          <li><Link to="/orders">Pedidos</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserForm />} />
        <Route path="/products" element={<ProductForm />} />
        <Route path="/orders" element={<OrderForm />} />
      </Routes>
    </Router>
  );
}

export default App;
