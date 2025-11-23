'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useInmobiliariaStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
      alert('✅ ¡Bienvenido!');
      router.push('/'); // Redirigir al Dashboard
    } catch (error) {
      alert('❌ Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🏠</div>
            <h2 className="text-2xl font-bold text-primary">Sillar Inmobiliaria</h2>
            <p className="text-sm text-gray-500">Inicia sesión para gestionar</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              <button className="btn btn-primary" disabled={loading}>
                {loading ? 'Entrando...' : 'Ingresar'}
              </button>
            </div>
          </form>

          <div className="divider">O</div>
          
          <div className="text-center text-sm">
            ¿No tienes cuenta? <Link href="/registro" className="link link-primary">Regístrate aquí</Link>
          </div>
        </div>
      </div>
    </div>
  );
}