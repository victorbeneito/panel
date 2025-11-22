import React, { useState } from 'react';
import clienteAxios from '../config/axiosClient';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await clienteAxios.post('/auth/login', { email, password });
      if (response.data.token) {
        login(response.data.token); // Guarda token en context i localStorage
        navigate('/dashboard');     // Redirigix al dashboard/panel
      } else {
        setError('Credenciales inválidas');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Error de autenticación');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl mb-4">Iniciar sesión</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded mb-2"
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button type="submit" className="bg-indigo-600 text-white py-2 w-full rounded hover:bg-indigo-700 transition">
        Entrar
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
