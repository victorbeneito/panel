import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPedidos();
  }, []);

  async function fetchPedidos() {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:3000/pedidos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(data.pedidos || data);
    } catch {
      setError('Error al cargar pedidos');
    }
  }

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar pedido?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/pedidos/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPedidos();
    } catch {
      setError('Error al eliminar pedido');
    }
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <button
        type="button"
        onClick={handleVolver}
        className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        Volver al panel de control
      </button>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <ul className="divide-y divide-gray-200 border-t border-b">
        {pedidos.map(p => (
          <li key={p._id} className="py-2 flex justify-between items-center">
            <div>
              Cliente: {p.cliente_id?.nombre || 'Desconocido'} - Estado: {p.estado} - Fecha: {new Date(p.fecha).toLocaleDateString()}
            </div>
            <div>
              <button
                onClick={() => handleDelete(p._id)}
                className="text-red-600 hover:underline"
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

