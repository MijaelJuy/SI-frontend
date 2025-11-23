'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';

export default function RegistroPage() {
  const router = useRouter();
  const { register } = useInmobiliariaStore();
  const [formData, setFormData] = useState({ nombre: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      alert('✅ Cuenta creada con éxito. Por favor inicia sesión.');
      router.push('/login'); // Redirigir al login para que entre
    } catch (error) {
      alert('❌ Error al registrar (quizás el correo ya existe)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-primary">Crear Cuenta</h2>
            <p className="text-sm text-gray-500">Únete al equipo de ventas</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="form-control">
              <label className="label"><span className="label-text">Nombre Completo</span></label>
              <input 
                type="text" 
                placeholder="Juan Pérez" 
                className="input input-bordered" 
                required
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Correo Electrónico</span></label>
              <input 
                type="email" 
                placeholder="ejemplo@sillar.com" 
                className="input input-bordered" 
                required
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Contraseña</span></label>
              <input 
                type="password" 
                placeholder="******" 
                className="input input-bordered" 
                required
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-secondary" disabled={loading}>
                {loading ? 'Registrando...' : 'Registrarse'}
              </button>
            </div>
          </form>

          <div className="text-center text-sm mt-4">
            ¿Ya tienes cuenta? <Link href="/login" className="link link-primary">Inicia sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
}