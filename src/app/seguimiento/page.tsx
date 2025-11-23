'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';
import { createSeguimiento } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

interface FormSeguimiento {
  tipoAccion: string;
  fecha: string;
  respuesta: string;
  clienteId: string;
  propiedadId: string;
}

export default function SeguimientoPage() {
  const { seguimientos, fetchSeguimientos, clientes, fetchClientes, propiedades, fetchPropiedades, loading } = useInmobiliariaStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormSeguimiento>();

  useEffect(() => {
    fetchSeguimientos();
    fetchClientes();
    fetchPropiedades();
  }, []);

  const onSubmit = async (data: FormSeguimiento) => {
    try {
      await createSeguimiento(data);
      await fetchSeguimientos();
      setModalOpen(false);
      reset();
      alert('✅ Seguimiento registrado');
    } catch (error) {
      alert('❌ Error al registrar');
    }
  };

  const getActionIcon = (tipo: string) => {
    if (tipo === 'Llamada') return '📞';
    if (tipo === 'WhatsApp') return '💬';
    if (tipo === 'Correo') return '📧';
    return '🤝';
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Historial de Comunicaciones</h1>
          <button onClick={() => setModalOpen(true)} className="btn btn-primary">+ Nuevo Seguimiento</button>
        </div>

        {/* TABLA */}
        <div className="card bg-base-100 shadow-xl overflow-x-auto">
          <div className="card-body">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Acción</th>
                  <th>Cliente</th>
                  <th>Propiedad Relacionada</th>
                  <th>Respuesta / Detalle</th>
                </tr>
              </thead>
              <tbody>
                {seguimientos.map((s) => (
                  <tr key={s.id}>
                    <td>{s.fecha}</td>
                    <td>
                      <div className="badge badge-ghost gap-2 font-bold">
                        {getActionIcon(s.tipoAccion)} {s.tipoAccion}
                      </div>
                    </td>
                    <td className="font-bold text-secondary">{s.Cliente?.nombre}</td>
                    <td className="text-sm">{s.Propiedad?.direccion}</td>
                    <td className="italic text-gray-500">{s.respuesta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {seguimientos.length === 0 && <div className="text-center p-4 opacity-50">No hay seguimientos registrados.</div>}
          </div>
        </div>

        {/* FORMULARIO */}
        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar Comunicación">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 mt-2">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label-text font-bold">Tipo de Acción</label>
                <select {...register('tipoAccion')} className="select select-bordered w-full">
                  <option value="Llamada">📞 Llamada Telefónica</option>
                  <option value="WhatsApp">💬 Mensaje WhatsApp</option>
                  <option value="Correo">📧 Correo Electrónico</option>
                  <option value="Reunion">🤝 Reunión / Cita</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label-text">Fecha</label>
                <input {...register('fecha', { required: true })} type="date" className="input input-bordered w-full" />
              </div>
            </div>

            <div className="form-control">
              <label className="label-text font-bold">Cliente</label>
              <select {...register('clienteId', { required: true })} className="select select-bordered w-full">
                <option value="">Seleccione cliente...</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="form-control">
              <label className="label-text font-bold">Propiedad de Interés</label>
              <select {...register('propiedadId', { required: true })} className="select select-bordered w-full">
                <option value="">Seleccione propiedad...</option>
                {propiedades.map(p => <option key={p.id} value={p.id}>{p.direccion}</option>)}
              </select>
            </div>

            <div className="form-control mt-2">
              <label className="label-text font-semibold">Respuesta del Cliente / Notas</label>
              <textarea 
                {...register('respuesta')} 
                className="textarea textarea-bordered w-full h-24 resize-none" 
                placeholder="Ej: Contestó muy amable, pidió que le envíe fotos..." 
              />
            </div>

            <button className="btn btn-primary w-full mt-4">Guardar Registro</button>
          </form>
        </Modal>
      </main>
    </div>
  );
}