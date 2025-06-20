//Frontend/proyecto/src/core/menuRoutes.tsx
import Dashboard from "../modules/Dashboard/Dashboard";
import UserForm  from "../modules/User/UserForm";
import ProductForm from "../modules/Product/ProductForm";
import OrderForm from "../modules/Order/OrderForm";
import React from "react";
    

export interface AppRoute {
    path:string;
    element:JSX.Element;
    label?: string;
    icon?: string;
}


const routes: AppRoute[] = [
    {
        path: '/',
        element: <Dashboard />,
        label: 'Inicio',
        icon: 'HomeOutlined',
    },
    {
        path:'/users',
        element: <UserForm />,
        label: 'Usuarios',
        icon: 'UserOutlined',
    },
    {
        path:'/products',
        element: <ProductForm />,
        label: 'Productos',
        icon: 'ProductsOutlined',
    },
    {
        path: '/orders',
        element: <OrderForm />,
        label : 'Pedidos',
        icon: 'OrdersOutlined',
    },
]

export default routes;