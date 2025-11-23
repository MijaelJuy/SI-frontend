'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';
import { createVisita } from '../../services/api';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';

interface FormVisita {
  asesor: string;
  clienteId: string;
  propiedadId: string;
  fecha: string;
  hora: string;
  resultado: string;
  comentario: string;
}

export default function VisitasPage() {
  const { visitas, fetchVisitas, clientes, fetchClientes, propiedades, fetchPropiedades } = useInmobiliariaStore();
  const [isModalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormVisita>();
  const [hora, setHora] = useState('09');
  const [minutos, setMinutos] = useState('00');
  const [ampm, setAmpm] = useState('AM');

  useEffect(() => {
    fetchVisitas();
    fetchClientes();
    fetchPropiedades();
  }, []);

  const onSubmit = async (data: FormVisita) => {
    try {
      const minutosFinal = minutos.padStart(2, '0') || '00';
      let hora24 = parseInt(hora);
      if (ampm === 'PM' && hora24 !== 12) hora24 += 12;
      if (ampm === 'AM' && hora24 === 12) hora24 = 0;
      data.hora = `${hora24.toString().padStart(2, '0')}:${minutosFinal}`;
      await createVisita(data);
      await fetchVisitas();
      setModalOpen(false);
      reset();
      setMinutos('00');
      alert('✅ Visita registrada');
    } catch (error) {
      alert('❌ Error al registrar');
    }
  };

  const handleMinutosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^\d{0,2}$/.test(val) && (val === '' || parseInt(val) < 60)) setMinutos(val);
  };
  const handleBlurMinutos = () => {
    if (minutos === '') setMinutos('00');
    else setMinutos(minutos.padStart(2, '0'));
  };
  const formatTime12h = (timeString: string) => {
    if (!timeString) return '';
    const [hoursStr, minutesStr] = timeString.split(':');
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutesStr} ${ampm}`;
  };
  const getBadgeColor = (resultado: string) => {
    if (resultado === 'Listo para comprar') return 'badge-success text-white font-bold';
    if (resultado === 'Posible comprador') return 'badge-info text-white font-bold';
    return 'badge-error text-white font-bold';
  };

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Bitácora de Visitas Físicas</h1>
          
          {/* 👇 BOTÓN CORREGIDO */}
          <button 
            onClick={() => setModalOpen(true)} 
            className="btn px-10 text-lg font-bold border-0 border-b-4 border-purple-600 shadow-lg backdrop-blur-md bg-white/80 text-gray-900 hover:bg-white dark:bg-black/40 dark:text-white dark:hover:bg-black/60"
          >
            + Registrar Visita
          </button>
        </div>

        {/* 👇 TABLA TRANSPARENTE */}
        <div className="bg-transparent my-4 overflow-hidden rounded-xl">
          <div className="card-body p-0">
            <table className="table">
              <thead className="bg-base-300/30 backdrop-blur-sm text-base-content">
                <tr><th>Fecha / Hora</th><th>Cliente</th><th>Propiedad Visitada</th><th>Asesor</th><th>Resultado</th><th>Comentario</th></tr>
              </thead>
              <tbody>
                {visitas.map((v) => (
                  <tr key={v.id} className="border-b border-base-300/20 hover:bg-base-300/10 transition-all">
                    <td><div className="font-bold">{v.fecha}</div><div className="text-xs text-gray-500 font-bold">{formatTime12h(v.hora)}</div></td>
                    <td className="font-bold text-secondary">{v.Cliente?.nombre}</td>
                    <td className="text-sm">{v.Propiedad?.direccion || '---'}</td>
                    <td>{v.asesor}</td>
                    <td><div className={`badge ${getBadgeColor(v.resultado)} p-3`}>{v.resultado}</div></td>
                    <td className="italic text-gray-500 text-xs max-w-xs truncate">{v.comentario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Registrar Nueva Visita">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-4">
             {/* ... (Formulario intacto) ... */}
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Cliente Visitado</span></label>
              <select {...register('clienteId', { required: true })} className="select select-bordered w-full h-12 text-lg">
                <option value="">Seleccione cliente...</option>
                {clientes.map(c => (<option key={c.id} value={c.id}>{c.nombre}</option>))}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Propiedad Visitada</span></label>
              <select {...register('propiedadId', { required: true })} className="select select-bordered w-full h-12 text-lg">
                <option value="">Seleccione la propiedad...</option>
                {propiedades.map(p => (<option key={p.id} value={p.id}>{p.tipo}: {p.direccion}</option>))}
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base">Asesor(a)</span></label>
              <input {...register('asesor', { required: true })} type="text" className="input input-bordered w-full h-12 px-4 text-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base">Fecha Visita</span></label>
                <input {...register('fecha', { required: true })} type="date" className="input input-bordered w-full h-12 px-4 text-lg" />
              </div>
              <div className="form-control">
                <label className="label pb-2"><span className="label-text font-bold text-base">Hora</span></label>
                <div className="flex gap-1 items-center h-12">
                  <select value={hora} onChange={(e) => setHora(e.target.value)} className="select select-bordered w-20 px-2 text-center h-full text-lg">
                    {['01','02','03','04','05','06','07','08','09','10','11','12'].map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                  <span className="text-xl font-bold">:</span>
                  <input type="text" value={minutos} onChange={handleMinutosChange} onBlur={handleBlurMinutos} className="input input-bordered w-20 px-2 text-center h-full text-lg" placeholder="00"/>
                  <select value={ampm} onChange={(e) => setAmpm(e.target.value)} className="select select-bordered w-24 px-2 bg-base-200 h-full text-lg"><option value="AM">AM</option><option value="PM">PM</option></select>
                </div>
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label pb-2"><span className="label-text font-bold text-base text-primary">Resultado</span></label>
              <select {...register('resultado', { required: true })} className="select select-bordered w-full h-12 text-lg">
                <option value="Listo para comprar">🟢 Listo para comprar</option>
                <option value="Posible comprador">🔵 Posible comprador</option>
                <option value="No le interesa">🔴 No le interesa</option>
              </select>
            </div>
            <div className="form-control w-full mt-2">
              <label className="label pb-2"><span className="label-text font-bold text-base">Comentario</span></label>
              <textarea {...register('comentario')} className="textarea textarea-bordered w-full h-24 resize-none text-lg p-4" placeholder="Detalles..." />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-6 text-lg h-12 shadow-lg font-bold bg-gradient-to-r from-blue-600 to-violet-600 border-none">
              Guardar Bitácora
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}