import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-3xl font-bold mb-4">Panel de Control</h1>
      <div className="mb-4">
        Bienvenido, <strong>{user?.email || 'Usuario'}</strong>
      </div>
      <button
        onClick={logout}
        className="mb-8 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Cerrar sesión
      </button>
      <nav>
        <ul className="space-y-2">
          <li><Link className="text-indigo-700 hover:underline" to="/categorias">Categorías</Link></li>
          <li><Link className="text-indigo-700 hover:underline" to="/marcas">Marcas</Link></li>
          <li><Link className="text-indigo-700 hover:underline" to="/productos">Productos</Link></li>
          <li><Link className="text-indigo-700 hover:underline" to="/clientes">Clientes</Link></li>
          <li><Link className="text-indigo-700 hover:underline" to="/pedidos">Pedidos</Link></li>
        </ul>
      </nav>
    </div>
  );
}
