'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';
import { createOperacion } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

export default function GestionPage() {
  const { operaciones, fetchOperaciones, propiedades, fetchPropiedades, clientes, fetchClientes } = useInmobiliariaStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const selectedPropiedadId = watch('propiedadId');
  
  useEffect(() => {
    fetchOperaciones();
    fetchPropiedades();
    fetchClientes();
  }, []);

  useEffect(() => {
    const propiedad = propiedades.find(p => p.id === selectedPropiedadId);
    if (propiedad) {
      setValue('tipoGestion', propiedad.modalidad);
    } else {
      setValue('tipoGestion', '');
    }
  }, [selectedPropiedadId, propiedades, setValue]);

  const onSubmit = async (data: any) => {
    try {
      data.precioFinal = Number(data.precioFinal);
      data.honorarios = Number(data.honorarios);
      await createOperacion(data);
      await fetchOperaciones();
      setModalOpen(false);
      reset();
      alert('✅ Gestión registrada');
    } catch (error) {
      alert('❌ Error al registrar');
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Gestión de Inmuebles (Cierres)</h1>
          
          {/* 👇 BOTÓN CORREGIDO */}
          <button 
            onClick={() => setModalOpen(true)} 
            className="btn px-10 text-lg font-bold border-0 border-b-4 border-purple-600 shadow-lg backdrop-blur-md bg-white/80 text-gray-900 hover:bg-white dark:bg-black/40 dark:text-white dark:hover:bg-black/60"
          >
            + Nueva Gestión
          </button>
        </div>

        {/* 👇 TABLA TRANSPARENTE */}
        <div className="bg-transparent my-4 overflow-hidden rounded-xl">
          <div className="card-body p-0">
            <table className="table">
              <thead className="bg-base-300/30 backdrop-blur-sm text-base-content">
                <tr><th>Fecha</th><th>Tipo</th><th>Propiedad</th><th>Precio Final</th><th>Comisión</th><th>Asesor</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {operaciones.map((op) => {
                  const prop = propiedades.find(p => p.id === op.propiedadId);
                  const simbolo = prop?.moneda === 'PEN' ? 'S/.' : '$';
                  return (
                    <tr key={op.id} className="border-b border-base-300/20 hover:bg-base-300/10 transition-all">
                      <td>{op.fechaOperacion}</td>
                      <td className="font-bold">{op.tipoGestion}</td>
                      <td>{op.Propiedad?.direccion}</td>
                      <td className="text-success font-bold">{simbolo} {op.precioFinal}</td>
                      <td>{op.honorarios}%</td>
                      <td>{op.asesor}</td>
                      <td><div className={`badge ${op.estado === 'Alta' ? 'badge-success' : 'badge-error'} badge-outline`}>{op.estado}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar Operación">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
             {/* ... (Formulario intacto) ... */}
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Propiedad</span></label>
              <select {...register('propiedadId', { required: true })} className="select select-bordered w-full h-12 text-lg">
                <option value="">Seleccione...</option>
                {propiedades.map(p => (<option key={p.id} value={p.id}>{p.direccion} ({p.moneda === 'PEN' ? 'S/.' : '$'} {p.precio})</option>))}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Cliente</span></label>
              <select {...register('clienteId')} className="select select-bordered w-full h-12 text-lg">
                <option value="">Seleccione...</option>
                {clientes.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base text-gray-500">Tipo</span></label>
                <input {...register('tipoGestion')} type="text" readOnly className="input input-bordered w-full h-12 text-lg bg-base-200 text-gray-500 cursor-not-allowed" placeholder="Automático..." />
              </div>
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base">Estado</span></label>
                <select {...register('estado')} className="select select-bordered w-full h-12 text-lg">
                  <option value="Alta">Alta (Concretado)</option>
                  <option value="Baja">Baja (Cancelado)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base">Fecha Op.</span></label>
                <input {...register('fechaOperacion', { required: true })} type="date" className="input input-bordered w-full h-12 px-4 text-lg" />
              </div>
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base">Fecha Contrato</span></label>
                <input {...register('fechaContrato')} type="date" className="input input-bordered w-full h-12 px-4 text-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base text-success">Precio Final</span></label>
                <input {...register('precioFinal', { required: true })} type="number" className="input input-bordered w-full h-12 px-4 text-lg" />
              </div>
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base">Comisión %</span></label>
                <input {...register('honorarios', { required: true })} type="number" className="input input-bordered w-full h-12 px-4 text-lg" placeholder="Ej: 5" />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Asesor</span></label>
              <input {...register('asesor', { required: true })} type="text" className="input input-bordered w-full h-12 px-4 text-lg" />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-6 text-lg h-12 shadow-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-none">
              Registrar Gestión
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}