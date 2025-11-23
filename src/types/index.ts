// Definición de Propietario
export interface Propietario {
  id: string;
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  createdAt?: string; // Opcional porque al crear no lo tenemos
  updatedAt?: string;
}

// Definición de Propiedad
export interface Propiedad {
  id: string;
  direccion: string;
  precio: number | string; // Puede venir como texto del input o numero de la BD
  moneda: string;
  tipo: 'Venta' | 'Alquiler' | string;
  modalidad: 'Venta' | 'Alquiler' | 'Anticresis';
  descripcion: string;
  area: number;
  areaConstruida: number;
  propietarioId: string;
  Propietario?: Propietario;
}

// Definición de Cliente
export interface Cliente {
  id: string;
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
}

// Definición de Interés (El match)
export interface Interes {
  id: string;
  estado: string;
  nota?: string;
  clienteId: string;
  propiedadId: string;
  Cliente?: Cliente;     // Para mostrar el nombre del interesado
  Propiedad?: Propiedad; // Para mostrar qué casa quiere
  createdAt?: string; 
  updatedAt?: string;
}

// Respuesta genérica de tu API (Backend)
// Esto nos ayuda a leer los mensajes: { message: "Éxito", data: ... }
export interface ApiResponse<T> {
  message: string;
  data: T;
  error?: string;
}

// Definición de Operación (Gestión)
export interface Operacion {
  id: string;
  tipoGestion: string; // Venta, Alquiler...
  estado: string;      // Alta, Baja
  fechaOperacion: string;
  fechaContrato: string;
  precioFinal: number;
  honorarios: number;
  asesor: string;
  propiedadId: string;
  clienteId?: string;
  Propiedad?: Propiedad;
  Cliente?: Cliente;
}

export interface Visita {
  id: string;
  asesor: string;
  fecha: string;
  hora: string;
  resultado: string;
  comentario?: string;
  clienteId: string;
  propiedadId: string;
  Cliente?: Cliente;
  Propiedad?: Propiedad;
}

export interface Seguimiento {
  id: string;
  tipoAccion: string;
  fecha: string;
  respuesta: string;
  clienteId: string;
  propiedadId: string;
  Cliente?: Cliente;
  Propiedad?: Propiedad;
}

// Definición de Usuario (Login)
export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

// Respuesta del Login
export interface AuthResponse {
  message: string;
  token: string;
  usuario: Usuario;
}