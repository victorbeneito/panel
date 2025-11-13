import axios from 'axios';

const API_URL = 'http://localhost:3000';

// Obtiene el token del localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Peticiones protegidas:
export function getPedidos() {
  return axios.get(`${API_URL}/pedidos`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

export function getClientes() {
  return axios.get(`${API_URL}/clientes`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
}

// Puedes añadir más servicios para productos, marcas, etc:
export function getProductos() {
  return axios.get(`${API_URL}/productos`);
}

// etc...
