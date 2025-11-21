import React, { useEffect, useState } from 'react';
import clienteAxios from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '', direccion: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientes();
  }, []);

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchClientes() {
    try {
      const { data } = await clienteAxios.get('/clientes', {
        headers: getHeaders()
      });
      setClientes(data.clientes || data);
    } catch {
      setError('No se pudieron cargar los clientes');
    }
  }

  const handleChange = e => {
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await clienteAxios.put(`/clientes/${editingId}`, formData, {
          headers: getHeaders()
        });
      } else {
        await clienteAxios.post('/clientes', formData, {
          headers: getHeaders()
        });
      }
      setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
      setEditingId(null);
      setError('');
      fetchClientes();
    } catch {
      setError('Error al guardar el cliente');
    }
  };

  const handleEdit = cliente => {
    setFormData({ nombre: cliente.nombre, email: cliente.email, telefono: cliente.telefono, direccion: cliente.direccion });
    setEditingId(cliente._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar cliente?')) return;
    try {
      await clienteAxios.delete(`/clientes/${id}`, {
        headers: getHeaders()
      });
      fetchClientes();
    } catch {
      setError('Error al eliminar cliente');
    }
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Nombre" required
        />
        <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="email" value={formData.email} onChange={handleChange} placeholder="Email" type="email" required
        />
        <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Teléfono"
        />
        <input className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Dirección"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          {editingId ? 'Actualizar' : 'Crear'}
        </button>
      </form>
      <button
        type="button"
        onClick={handleVolver}
        className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        Volver al panel de control
      </button>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <ul className="divide-y divide-gray-200 border-t border-b">
        {clientes.map(c => (
          <li key={c._id} className="flex justify-between items-center py-2">
            <span>{c.nombre} | {c.email} | {c.telefono}</span>
            <div>
              <button
                onClick={() => handleEdit(c)}
                className="text-indigo-600 hover:underline mr-4"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(c._id)}
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
