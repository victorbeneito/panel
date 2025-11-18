import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------
// Componente de variante
function VarianteInput({ variante, index, onChange, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await axios.post('http://localhost:3000/api/upload-image', formData, {
        headers: { ...getHeaders(), 'Content-Type': 'multipart/form-data' },
      });
      if (data.ok) {
        onChange(index, { target: { name: 'imagen', value: data.url } });
      } else {
        setUploadError('Error al subir imagen');
      }
    } catch {
      setUploadError('Error en la subida');
    }
    setUploading(false);
  };

  return (
    <div className="border p-4 rounded mb-4 relative bg-gray-50 shadow-sm">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold"
        aria-label="Eliminar variante"
      >
        &times;
      </button>

      <input
        name="color"
        value={variante.color}
        onChange={(e) => onChange(index, e)}
        placeholder="Color"
        className="border rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2 w-full"
      />
      {uploading && <p className="text-blue-600">Subiendo imagen...</p>}
      {uploadError && <p className="text-red-600">{uploadError}</p>}
      {variante.imagen && (
        <img src={variante.imagen} alt="Variante" className="w-24 h-24 object-cover mb-2" />
      )}

      <input
        name="tamaño"
        value={variante.tamaño}
        onChange={(e) => onChange(index, e)}
        placeholder="Tamaño"
        className="border rounded p-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        name="precio_extra"
        type="number"
        min="0"
        value={variante.precio_extra}
        onChange={(e) => onChange(index, e)}
        placeholder="Precio extra"
        className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  );
}

// ----------------------------------------------------------

export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: '',
    marca: '',
    categoria: '',
    variantes: [{ color: '', imagen: '', tamaño: '', precio_extra: '' }],
    destacado: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
    fetchMarcasYCategorias();
  }, []);

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async function fetchProductos() {
    try {
      const { data } = await axios.get('http://localhost:3000/productos', {
        headers: getHeaders(),
      });
      setProductos(data.productos || data);
    } catch {
      setError('Error al cargar productos');
    }
  }

  async function fetchMarcasYCategorias() {
    try {
      const [resMarcas, resCategorias] = await Promise.all([
        axios.get('http://localhost:3000/marcas', { headers: getHeaders() }),
        axios.get('http://localhost:3000/categorias', { headers: getHeaders() }),
      ]);
      setMarcas(resMarcas.data);
      setCategorias(resCategorias.data);
    } catch (error) {
      console.error('Error al cargar marcas o categorías:', error);
    }
  }

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleVarianteChange = (index, e) => {
    const newVariantes = [...formData.variantes];
    newVariantes[index] = { ...newVariantes[index], [e.target.name]: e.target.value };
    setFormData((p) => ({ ...p, variantes: newVariantes }));
  };

  const agregarVariante = () => {
    setFormData((p) => ({
      ...p,
      variantes: [...p.variantes, { color: '', imagen: '', tamaño: '', precio_extra: '' }],
    }));
  };

  const eliminarVariante = (index) => {
    const newVariantes = formData.variantes.filter((_, i) => i !== index);
    setFormData((p) => ({ ...p, variantes: newVariantes }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/productos/${editingId}`, formData, {
          headers: getHeaders(),
        });
      } else {
        await axios.post('http://localhost:3000/productos', formData, {
          headers: getHeaders(),
        });
      }
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        marca: '',
        categoria: '',
        variantes: [{ color: '', imagen: '', tamaño: '', precio_extra: '' }],
        destacado: false,
      });
      setEditingId(null);
      setError('');
      fetchProductos();
    } catch {
      setError('Error al guardar producto');
    }
  };

  const handleEdit = (producto) => {
    setFormData({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      stock: producto.stock,
      marca: producto.marca?._id || '',
      categoria: producto.categoria?._id || '',
      variantes:
        producto.variantes.length > 0
          ? producto.variantes
          : [{ color: '', imagen: '', tamaño: '', precio_extra: '' }],
      destacado: producto.destacado || false,
    });
    setEditingId(producto._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;
    try {
      await axios.delete(`http://localhost:3000/productos/${id}`, {
        headers: getHeaders(),
      });
      fetchProductos();
    } catch {
      setError('Error al eliminar producto');
    }
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  // ----------------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h1 className="text-3xl font-bold mb-6">Gestión de Productos</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={handleChange}
            placeholder="Precio"
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          <input
            name="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Select de Marca */}
          <select
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecciona una marca</option>
            {marcas.map((m) => (
              <option key={m._id} value={m._id}>
                {m.nombre}
              </option>
            ))}
          </select>

          {/* Select de Categoría */}
          <select
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c._id} value={c._id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Variantes */}
        <h2 className="text-xl font-semibold mb-4">Variantes</h2>
        {formData.variantes.map((v, idx) => (
          <VarianteInput
            key={idx}
            variante={v}
            index={idx}
            onChange={handleVarianteChange}
            onRemove={eliminarVariante}
          />
        ))}
        <button
          type="button"
          onClick={agregarVariante}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Añadir Variante
        </button>

        {/* Checkbox de Producto destacado */}
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="destacado" className="text-lg text-gray-900">
            Producto destacado
          </label>
          <input
            type="checkbox"
            id="destacado"
            name="destacado"
            checked={formData.destacado || false}
            onChange={(e) =>
              setFormData({ ...formData, destacado: e.target.checked })
            }
            className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
        </div>

        {/* Botón Guardar */}
        <button
          type="submit"
          className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition"
        >
          {editingId ? 'Actualizar Producto' : 'Crear Producto'}
        </button>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </form>

      {/* Botón Volver */}
      <button
        type="button"
        onClick={handleVolver}
        className="my-8 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
      >
        Volver al panel de control
      </button>

      {/* Listado de productos */}
      <ul className="divide-y divide-gray-200 border-t border-b mt-8">
        {productos.map((p) => (
          <li key={p._id} className="py-4 flex justify-between items-center">
            <span>
              <strong>{p.nombre}</strong> - Precio: {p.precio} - Stock: {p.stock} - Marca:{' '}
              {p.marca?.nombre || 'N/A'} - Categoría: {p.categoria?.nombre || 'N/A'} {p.destacado && (
      <span className="ml-2 text-sm text-yellow-600 font-medium">
        • Producto Destacado
      </span>
    )}
            </span>
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
