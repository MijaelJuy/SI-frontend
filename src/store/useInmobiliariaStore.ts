import { create } from 'zustand';
import { 
  Propietario, Propiedad, Cliente, Interes, Operacion, Visita, Seguimiento, Usuario 
} from '../types';

import { 
  getPropietarios, getPropiedades, getClientes, getIntereses, 
  getOperaciones, getVisitas, getSeguimientos, loginUser, registerUser 
} from '../services/api';

interface InmobiliariaState {
  // Datos del Sistema
  propietarios: Propietario[];
  propiedades: Propiedad[];
  clientes: Cliente[];
  intereses: Interes[];
  operaciones: Operacion[];
  visitas: Visita[];
  seguimientos: Seguimiento[];
  loading: boolean;

  // Datos de Sesión
  currentUser: Usuario | null;
  isAuthenticated: boolean;

  // Acciones de Datos
  fetchPropietarios: () => Promise<void>;
  fetchPropiedades: () => Promise<void>;
  fetchClientes: () => Promise<void>;
  fetchIntereses: () => Promise<void>;
  fetchOperaciones: () => Promise<void>;
  fetchVisitas: () => Promise<void>;
  fetchSeguimientos: () => Promise<void>;

  // Acciones de Auth
  login: (creds: { email: string; password: string }) => Promise<void>;
  register: (creds: { nombre: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useInmobiliariaStore = create<InmobiliariaState>((set) => ({
  // Estado Inicial
  propietarios: [],
  propiedades: [],
  clientes: [],
  intereses: [],
  operaciones: [],
  visitas: [],
  seguimientos: [],
  loading: false,
  
  currentUser: null,
  isAuthenticated: false,

  // --- FUNCIONES DE DATOS ---
  fetchPropietarios: async () => {
    const data = await getPropietarios();
    set({ propietarios: data });
  },
  fetchPropiedades: async () => {
    const data = await getPropiedades();
    set({ propiedades: data });
  },
  fetchClientes: async () => {
    const data = await getClientes();
    set({ clientes: data });
  },
  fetchIntereses: async () => {
    const data = await getIntereses();
    set({ intereses: data });
  },
  fetchOperaciones: async () => {
    const data = await getOperaciones();
    set({ operaciones: data });
  },
  fetchVisitas: async () => {
    const data = await getVisitas();
    set({ visitas: data });
  },
  fetchSeguimientos: async () => {
    const data = await getSeguimientos();
    set({ seguimientos: data });
  },

  // --- FUNCIONES DE AUTH ---
  login: async (creds) => {
    const response = await loginUser(creds);
    // Guardamos el token en el navegador (para que no se salga al recargar)
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.usuario));
    set({ currentUser: response.usuario, isAuthenticated: true });
  },

  register: async (creds) => {
    await registerUser(creds);
    // Después de registrar, no logueamos automáticamente, pedimos que inicie sesión
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ currentUser: null, isAuthenticated: false });
  }
}));