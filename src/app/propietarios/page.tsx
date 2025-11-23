'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';
import { createPropietario } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

interface FormPropietario {
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
}

export default function PropietariosPage() {
  const { propietarios, fetchPropietarios, loading } = useInmobiliariaStore();
  const [isModalOpen, setModalOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormPropietario>();

  useEffect(() => {
    fetchPropietarios();
  }, []);

  const onSubmit = async (data: FormPropietario) => {
    try {
      await createPropietario(data);
      await fetchPropietarios();
      setModalOpen(false);
      reset();
      alert('✅ Propietario registrado');
    } catch (error) {
      alert('❌ Error al registrar');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Gestión de Propietarios</h1>
          
          {/* 👇 BOTÓN CORREGIDO SOLICITADO */}
          {/* text-gray-900 (negro en claro) | dark:text-white (blanco en oscuro) | border-purple-600 (línea morada) */}
          <button 
            onClick={() => setModalOpen(true)} 
            className="btn px-10 text-lg font-bold border-0 border-b-4 border-purple-600 shadow-lg backdrop-blur-md bg-white/80 text-gray-900 hover:bg-white dark:bg-black/40 dark:text-white dark:hover:bg-black/60"
          >
            + Nuevo Propietario
          </button>
        </div>

        {/* 👇 TABLA TRANSPARENTE (INTACTA) */}
        <div className="bg-transparent my-4 overflow-hidden rounded-xl">
          <div className="card-body p-0">
            {loading ? <div className="text-center p-4">Cargando...</div> : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead className="bg-base-300/30 backdrop-blur-sm text-base-content">
                    <tr>
                      <th>Nombre</th>
                      <th>DNI</th>
                      <th>Cumpleaños</th>
                      <th>Dirección</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propietarios.map((p) => (
                      <tr key={p.id} className="border-b border-base-300/20 hover:bg-base-300/10 transition-all">
                        <td className="font-bold text-lg">{p.nombre}</td>
                        <td><div className="badge badge-ghost p-3 font-mono text-sm backdrop-blur-md bg-white/10 dark:bg-black/20">{p.dni}</div></td>
                        <td className="capitalize">{new Date(p.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</td>
                        <td>{p.direccion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar Nuevo Propietario">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-4">
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Nombre Completo</span></label>
              <input {...register('nombre', { required: true })} type="text" className="input input-bordered w-full h-12 px-4 text-lg" />
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">DNI (8 dígitos)</span></label>
              <input {...register('dni', { required: true, minLength: 8, maxLength: 8 })} type="text" inputMode="numeric" className="input input-bordered w-full h-12 px-4 text-lg font-mono tracking-widest" maxLength={8} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} />
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Fecha Nacimiento</span></label>
              <input {...register('fechaNacimiento', { required: true })} type="date" className="input input-bordered w-full h-12 px-4 text-lg" />
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Dirección</span></label>
              <input {...register('direccion', { required: true })} type="text" className="input input-bordered w-full h-12 px-4 text-lg" />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-6 text-lg h-12 shadow-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-none">
              Guardar Propietario
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}