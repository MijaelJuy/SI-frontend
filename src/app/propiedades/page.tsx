'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';
import { createPropiedad } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

interface FormPropiedad {
  tipo: string;
  modalidad: string;
  direccion: string;
  precio: number;
  moneda: string;
  area: number;
  areaConstruida: number;
  descripcion: string;
  propietarioId: string;
}

export default function PropiedadesPage() {
  const { propiedades, fetchPropiedades, propietarios, fetchPropietarios, loading } = useInmobiliariaStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormPropiedad>();

  useEffect(() => {
    fetchPropiedades();
    fetchPropietarios();
  }, []);

  const onSubmit = async (data: FormPropiedad) => {
    try {
      data.precio = Number(data.precio);
      data.area = Number(data.area);
      data.areaConstruida = Number(data.areaConstruida);
      await createPropiedad(data);
      await fetchPropiedades();
      setModalOpen(false);
      reset();
      alert('🏠 Propiedad registrada');
    } catch (error) {
      alert('❌ Error al registrar');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Inventario de Propiedades</h1>
          
          {/* 👇 BOTÓN CORREGIDO */}
          <button 
            onClick={() => setModalOpen(true)} 
            className="btn px-10 text-lg font-bold border-0 border-b-4 border-purple-600 shadow-lg backdrop-blur-md bg-white/80 text-gray-900 hover:bg-white dark:bg-black/40 dark:text-white dark:hover:bg-black/60"
          >
            + Nueva Propiedad
          </button>
        </div>

        {loading ? <div className="text-center">Cargando...</div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {propiedades.map((p) => (
              <div key={p.id} className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-all">
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-2">
                      <div className="badge badge-primary">{p.tipo}</div>
                      <div className="badge badge-outline">{p.modalidad}</div>
                    </div>
                    <div className="text-xl font-bold text-success">
                      {p.moneda === 'PEN' ? 'S/.' : '$'} {Number(p.precio).toLocaleString()}
                    </div>
                  </div>
                  <h2 className="card-title text-xl mb-1">{p.direccion}</h2>
                  <p className="text-sm text-gray-500 line-clamp-2 min-h-[2.5rem] mb-4">{p.descripcion}</p>
                  <div className="divider my-2"></div>
                  <div className="text-sm"><span className="font-bold text-primary">Dueño: {p.Propietario?.nombre}</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar Nueva Propiedad">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
            {/* ... (Formulario intacto) ... */}
             <div className="grid grid-cols-3 gap-4">
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Tipo</span></label>
                <select {...register('tipo')} className="select select-bordered w-full h-12 text-lg">
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Terreno">Terreno</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Modalidad</span></label>
                <select {...register('modalidad')} className="select select-bordered w-full h-12 text-lg">
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                  <option value="Anticresis">Anticresis</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Dueño</span></label>
                <select {...register('propietarioId', { required: true })} className="select select-bordered w-full h-12 text-lg">
                  <option value="">Seleccione...</option>
                  {propietarios.map((prop) => (<option key={prop.id} value={prop.id}>{prop.nombre}</option>))}
                </select>
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Dirección</span></label>
              <input {...register('direccion', { required: true })} type="text" className="input input-bordered w-full h-12 px-4 text-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4 bg-base-200 p-4 rounded-xl">
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Moneda</span></label>
                <select {...register('moneda')} className="select select-bordered w-full h-12 text-lg">
                  <option value="USD">Dólares ($)</option>
                  <option value="PEN">Soles (S/.)</option>
                </select>
              </div>
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Precio</span></label>
                <input {...register('precio', { required: true })} type="number" className="input input-bordered w-full h-12 px-4 text-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Área T.</span></label>
                <input {...register('area', { required: true })} type="number" className="input input-bordered w-full h-12 px-4 text-lg" placeholder="m²" />
              </div>
              <div className="form-control w-full">
                <label className="label pb-2"><span className="label-text font-bold text-base">Área C.</span></label>
                <input {...register('areaConstruida')} type="number" className="input input-bordered w-full h-12 px-4 text-lg" placeholder="m²" />
              </div>
            </div>
            <div className="form-control w-full mt-2">
              <label className="label pb-2"><span className="label-text font-bold text-base">Descripción</span></label>
              <textarea {...register('descripcion')} className="textarea textarea-bordered w-full h-24 resize-none text-lg p-4" placeholder="Ej: Tiene jardín, cochera doble..." />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-6 text-lg h-12 shadow-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-none">
              Guardar Propiedad
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}