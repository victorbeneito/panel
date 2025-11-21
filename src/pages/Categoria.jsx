import React, { useEffect, useState } from 'react';
import clienteAxios from '../config/axiosClient';
import { useNavigate } from 'react-router-dom';

export default function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({ nombre: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategorias();
  }, []);

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

 async function fetchCategorias() {
  try {
    const { data } = await clienteAxios.get('/categorias', {
      headers: getHeaders()
    });
    setCategorias(Array.isArray(data) ? data : []);
  } catch {
    setError('Error al cargar categorías');
    setCategorias([]);
  }
}


  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await clienteAxios.put(`/categorias/${editingId}`, formData, {
          headers: getHeaders()
        });
      } else {
        await clienteAxios.post('/categorias', formData, {
          headers: getHeaders()
        });
      }
      setFormData({ nombre: '' });
      setEditingId(null);
      setError('');
      fetchCategorias();
    } catch {
      setError('Error al guardar categoría');
    }
  };

  const handleEdit = categoria => {
    setFormData({ nombre: categoria.nombre });
    setEditingId(categoria._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar categoría?')) return;
    try {
      await clienteAxios.delete(`/categorias/${id}`, {
        headers: getHeaders()
      });
      fetchCategorias();
    } catch {
      setError('Error al eliminar categoría');
    }
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
        <h1 className="text-2xl font-bold mb-4">Categorías</h1>
        <div className="text-red-600 mb-4">{error}</div>
        <button
          type="button"
          onClick={handleVolver}
          className="mb-4 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Volver al panel de control
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Categorías</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
          required
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
      <ul className="divide-y divide-gray-200 border-t border-b">
        {(Array.isArray(categorias) ? categorias : []).map(c => (
          <li key={c._id || Math.random()} className="py-2 flex justify-between items-center">
            <div>{c.nombre}</div>
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
