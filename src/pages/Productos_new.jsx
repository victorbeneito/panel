import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Producto() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    marca: '',
    categoria: '',
    imagenes: [],
    variantes: [],
    destacado: false
  });
  const [nuevaImagen, setNuevaImagen] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Carga productos desde backend
  useEffect(() => {
    fetchProductos();
  }, []);

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // const fetchProductos = async () => {
  //   try {
  //     const { data } = await axios.get('http://localhost:3000/productos', {
  //       headers: getHeaders()
  //     });
  //     setProductos(Array.isArray(data) ? data : []);
  //   } catch {
  //     setError('Error al cargar productos');
  //   }
  // };

  async function fetchProductos() {
    try {
      const { data } = await axios.get('http://localhost:3000/productos', {
        headers: getHeaders(),
      });
      console.log(data);
      setProductos(data.productos || data);
    } catch {
      setError('Error al cargar productos');
    }
  }

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gestión imágenes url
  const handleAgregarImagen = () => {
    const url = nuevaImagen.trim();
    if (url && !formData.imagenes.includes(url)) {
      setFormData(prev => ({
        ...prev,
        imagenes: [...prev.imagenes, url]
      }));
      setNuevaImagen('');
    }
  };

  const handleEliminarImagen = (url) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter(img => img !== url)
    }));
  };

  // Gestión variantes
  const handleAgregarVariante = () => {
    setFormData(prev => ({
      ...prev,
      variantes: [...prev.variantes, { color: '', imagen: '', tamaño: '', precio_extra: 0 }]
    }));
  };

  const handleCambiarVariante = (index, campo, valor) => {
    const nuevasVariantes = [...formData.variantes];
    nuevasVariantes[index][campo] = campo === 'precio_extra' ? Number(valor) : valor;
    setFormData(prev => ({ ...prev, variantes: nuevasVariantes }));
  };

  const handleEliminarVariante = (index) => {
    const nuevasVariantes = formData.variantes.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, variantes: nuevasVariantes }));
  };

  // Crear / actualizar producto
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/productos/${editingId}`, formData, {
          headers: getHeaders()
        });
      } else {
        await axios.post('http://localhost:3000/productos', formData, {
          headers: getHeaders()
        });
      }
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        marca: '',
        categoria: '',
        imagenes: [],
        variantes: [],
        destacado: false
      });
      setEditingId(null);
      setError('');
      fetchProductos();
    } catch {
      setError('Error al guardar producto');
    }
  };

  const handleEdit = producto => {
    setFormData({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || '',
      stock: producto.stock || '',
      marca: producto.marca?._id || '',
      categoria: producto.categoria?._id || '',
      imagenes: Array.isArray(producto.imagenes) ? producto.imagenes : [],
      variantes: Array.isArray(producto.variantes) ? producto.variantes : [],
      destacado: producto.destacado || false
    });
    setEditingId(producto._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await axios.delete(`http://localhost:3000/productos/${id}`, {
        headers: getHeaders()
      });
      fetchProductos();
    } catch {
      setError('Error al eliminar producto');
    }
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Productos</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4" noValidate>
        <input
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Nombre"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="number"
          name="precio"
          value={formData.precio}
          onChange={handleChange}
          placeholder="Precio"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          placeholder="ID Marca"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          placeholder="ID Categoría"
          className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        {/* Gestión imágenes URL */}
        <div>
          <input
            type="url"
            value={nuevaImagen}
            onChange={e => setNuevaImagen(e.target.value)}
            placeholder="URL de la imagen"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            onClick={handleAgregarImagen}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Agregar imagen
          </button>
          <ul className="mt-2 space-y-1">
            {formData.imagenes.map(url => (
              <li key={url} className="flex justify-between items-center py-1 border px-2 rounded">
                <a href={url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                  {url}
                </a>
                <button
                  type="button"
                  onClick={() => handleEliminarImagen(url)}
                  className="text-red-600 hover:underline ml-2"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Gestión variantes */}
        <div>
          <h3 className="font-semibold mb-2">Variantes</h3>
          {formData.variantes.map((v, i) => (
            <div key={i} className="mb-4 p-2 border rounded space-y-2">
              <input
                type="text"
                placeholder="Color"
                value={v.color}
                onChange={e => handleCambiarVariante(i, 'color', e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="url"
                placeholder="Imagen"
                value={v.imagen}
                onChange={e => handleCambiarVariante(i, 'imagen', e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="text"
                placeholder="Tamaño"
                value={v.tamaño}
                onChange={e => handleCambiarVariante(i, 'tamaño', e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <input
                type="number"
                placeholder="Precio extra"
                value={v.precio_extra}
                onChange={e => handleCambiarVariante(i, 'precio_extra', e.target.value)}
                className="w-full border rounded px-2 py-1"
              />
              <button
                type="button"
                onClick={() => handleEliminarVariante(i)}
                className="text-red-600 hover:underline"
              >
                Eliminar variante
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAgregarVariante}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Agregar variante
          </button>
        </div>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="destacado"
            checked={formData.destacado}
            onChange={handleChange}
          />
          <span>Destacado</span>
        </label>

        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
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

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <ul className="divide-y divide-gray-200 border-t border-b">
        {productos.map(p => (
          <li key={p._id} className="py-2 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {p.imagenes?.[0] && (
                <img src={p.imagenes[0]} alt={p.nombre} className="w-12 h-12 object-cover rounded" />
              )}
              <div>
                <div className="font-semibold">{p.nombre}</div>
                <div className="text-sm text-gray-600">Precio: {p.precio} €</div>
              </div>
            </div>
            <div>
              <button
                onClick={() => handleEdit(p)}
                className="text-indigo-600 hover:underline mr-4"
              >
                Editar
              </button>
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
