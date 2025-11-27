'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useInmobiliariaStore } from '../../store/useInmobiliariaStore';
import { createCliente, createInteres } from '../../services/api'; 
import Navbar from '../../components/Navbar';
import { 
  FaUser, FaIdCard, FaMapMarkerAlt, FaBirthdayCake, FaSave, 
  FaSearch, FaEye, FaPhone, FaHome, FaEnvelope, FaStickyNote, FaUserTie,
  FaBriefcase, FaRing, FaCalendarCheck
} from 'react-icons/fa';

interface FormClienteCompleto {
  nombre: string;
  dni: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  email: string;
  estadoCivil: string;
  ocupacion: string;
  fechaAlta: string;
  propiedadId?: string;
  asesorCliente?: string;
  observaciones?: string;
}

export default function ClientesPage() {
  const { 
    clientes, fetchClientes, 
    propiedades, fetchPropiedades, 
    intereses, fetchIntereses, 
    loading 
  } = useInmobiliariaStore();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<FormClienteCompleto>();

  const selectedPropiedadId = watch('propiedadId');
  const propiedadSeleccionada = propiedades.find(p => p.id === selectedPropiedadId);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchClientes();
    fetchPropiedades();
    fetchIntereses();
  }, []);

  const onSubmit = async (data: FormClienteCompleto) => {
    setIsSubmitting(true);
    try {
      const nuevoClienteResponse = await createCliente({
        nombre: data.nombre,
        dni: data.dni,
        fechaNacimiento: data.fechaNacimiento,
        direccion: data.direccion,
        telefono1: data.telefono,
        email: data.email,
        estadoCivil: data.estadoCivil,
        ocupacion: data.ocupacion,
        fechaAlta: data.fechaAlta
      });

      const nuevoId = nuevoClienteResponse.data?.id; 

      if (data.propiedadId && nuevoId) {
        await createInteres({
          clienteId: nuevoId,
          propiedadId: data.propiedadId,
          nota: `Asesor Cliente: ${data.asesorCliente || 'N/A'}. Obs: ${data.observaciones || ''}`
        });
        await fetchIntereses();
      }

      await fetchClientes();
      setModalOpen(false);
      reset();
      alert('✅ Cliente registrado con éxito');
    } catch (error) {
      alert('❌ Error al registrar');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewDetail = (cliente: any) => {
    setSelectedCliente(cliente);
    setDetailOpen(true);
  };

  const filteredClientes = clientes.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.dni.includes(searchTerm)
  );

  const interesesDelCliente = selectedCliente ? intereses.filter(i => i.clienteId === selectedCliente.id) : [];
  const interesPrincipal = interesesDelCliente.length > 0 ? interesesDelCliente[interesesDelCliente.length - 1] : null;
  
  let asesorClienteGuardado = 'No especificado';
  let observacionesGuardadas = '';
  
  if (interesPrincipal?.nota) {
      const partes = interesPrincipal.nota.split('. Obs: ');
      if (partes[0].includes('Asesor Cliente: ')) {
          asesorClienteGuardado = partes[0].replace('Asesor Cliente: ', '');
      }
      if (partes.length > 1) {
          observacionesGuardadas = partes[1];
      } else {
          observacionesGuardadas = interesPrincipal.nota;
      }
  }

  const handleNumberInput = (e: React.FormEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Navbar />
      <main className="container mx-auto p-6 max-w-7xl">
        
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-900">Cartera de Clientes</h1>
            <p className="text-gray-500 mt-1">Gestiona a tus compradores potenciales.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative w-full md:w-64">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input type="text" placeholder="Buscar Cliente..." className="input input-bordered w-full pl-10 bg-white shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <button onClick={() => setModalOpen(true)} className="btn btn-primary shadow-lg border-none bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6">+ Nuevo</button>
          </div>
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                <tr>
                  <th className="py-4 pl-6">Nombre</th>
                  <th>Celular</th>
                  <th>Contacto</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                   <tr><td colSpan={4} className="text-center py-8">Cargando...</td></tr>
                ) : filteredClientes.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="pl-6 py-4">
                      <div className="font-bold text-gray-900 text-lg">{c.nombre}</div>
                      <div className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full w-fit mt-1">CLIENTE</div>
                    </td>
                    <td><div className="flex items-center gap-2 font-bold text-gray-700"><FaPhone className="text-green-500"/> {c.telefono1 || '---'}</div></td>
                    <td>
                        <div className="flex flex-col gap-1 text-sm text-gray-600">
                            <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-red-300 text-xs"/> {c.direccion}</span>
                            <span className="flex items-center gap-2"><FaEnvelope className="text-blue-300 text-xs"/> {c.email || 'Sin email'}</span>
                        </div>
                    </td>
                    <td>
                      <button onClick={() => handleViewDetail(c)} className="btn btn-sm btn-ghost text-blue-600 hover:bg-blue-100 tooltip" data-tip="Ver Ficha Completa"><FaEye className="text-lg" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL DE REGISTRO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
             <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="bg-indigo-900 text-white p-6 flex justify-between items-center">
                    <h3 className="font-bold text-2xl flex items-center gap-3"><FaUser className="text-indigo-300"/> Registrar Nuevo Cliente</h3>
                    <button onClick={() => setModalOpen(false)} className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20">✕</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="p-8 bg-gray-50 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* COLUMNA IZQ */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-500 uppercase text-sm border-b pb-2">Datos Personales</h4>
                        <div className="form-control w-full"><label className="label font-bold text-gray-700">Nombre del Cliente</label><input {...register('nombre', { required: true })} type="text" className="input input-bordered w-full bg-white" placeholder="Ej: María Gómez" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control w-full"><label className="label font-bold text-gray-700">DNI</label><input {...register('dni', { required: true, minLength: 8, maxLength: 8 })} type="text" className="input input-bordered w-full bg-white font-mono" maxLength={8} onInput={handleNumberInput} /></div>
                            <div className="form-control w-full"><label className="label font-bold text-gray-700">Nacimiento</label><input {...register('fechaNacimiento', { required: true })} type="date" className="input input-bordered w-full bg-white" max={today} /></div>
                        </div>
                         <div className="form-control w-full"><label className="label font-bold text-gray-700">Teléfono</label><input {...register('telefono')} type="text" className="input input-bordered w-full bg-white" placeholder="900 000 000" maxLength={9} onInput={handleNumberInput} /></div>
                         <div className="form-control w-full"><label className="label font-bold text-gray-700">Email</label><input {...register('email')} type="email" className="input input-bordered w-full bg-white" placeholder="cliente@email.com" /></div>
                        <div className="form-control w-full"><label className="label font-bold text-gray-700">Dirección</label><input {...register('direccion', { required: true })} type="text" className="input input-bordered w-full bg-white" /></div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="form-control w-full"><label className="label font-bold text-gray-700">Estado Civil</label><select {...register('estadoCivil')} className="select select-bordered w-full bg-white"><option value="">Seleccione...</option><option value="Soltero/a">Soltero/a</option><option value="Casado/a">Casado/a</option><option value="Divorciado/a">Divorciado/a</option><option value="Viudo/a">Viudo/a</option></select></div>
                            <div className="form-control w-full"><label className="label font-bold text-gray-700">Ocupación</label><input {...register('ocupacion')} type="text" className="input input-bordered w-full bg-white" placeholder="Ej: Ingeniero" /></div>
                        </div>
                         <div className="form-control w-full"><label className="label font-bold text-gray-700">Fecha de Registro</label><input {...register('fechaAlta')} type="date" className="input input-bordered w-full bg-white" defaultValue={today} /></div>
                    </div>
                    {/* COLUMNA DER */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-gray-500 uppercase text-sm border-b pb-2">Interés Inmobiliario (Opcional)</h4>
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <div className="form-control w-full mb-4"><label className="label font-bold text-indigo-900">Jalar Propiedad</label><select {...register('propiedadId')} className="select select-bordered w-full bg-gray-50"><option value="">-- Seleccione Propiedad --</option>{propiedades.map(p => (<option key={p.id} value={p.id}>{p.direccion}</option>))}</select></div>
                            {propiedadSeleccionada && (
                                <div className="text-sm space-y-2 mb-4 bg-indigo-50 p-3 rounded-lg border border-indigo-100 text-gray-700">
                                    <p><span className="font-bold">Dirección:</span> {propiedadSeleccionada.direccion}</p>
                                    <p><span className="font-bold">Precio:</span> {propiedadSeleccionada.moneda} {propiedadSeleccionada.precio}</p>
                                    <p><span className="font-bold">Operación:</span> {propiedadSeleccionada.modalidad}</p>
                                    <p><span className="font-bold">Tipo:</span> {propiedadSeleccionada.tipo}</p>
                                    <p><span className="font-bold">Asesor Prop.:</span> {propiedadSeleccionada.asesor || 'No asignado'}</p>
                                </div>
                            )}
                            <div className="form-control w-full mb-2"><label className="label font-bold text-gray-700">Asesor del Cliente</label><input {...register('asesorCliente')} type="text" className="input input-bordered w-full bg-gray-50" placeholder="Quién atiende al cliente" /></div>
                            <div className="form-control w-full"><label className="label font-bold text-gray-700">Observaciones</label><textarea {...register('observaciones')} className="textarea textarea-bordered w-full h-20 bg-gray-50" placeholder="Notas sobre el interés..." /></div>
                        </div>
                    </div>
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-gray-200 flex justify-end gap-4">
                        <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost text-gray-500">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="btn btn-primary px-12 font-bold bg-gradient-to-r from-blue-600 to-indigo-600 border-none text-lg shadow-lg"><FaSave className="mr-2"/> {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}</button>
                    </div>
                </form>
             </div>
          </div>
        )}

        {/* MODAL DE DETALLE MEJORADO */}
        {isDetailOpen && selectedCliente && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
                    
                    {/* HEADER CON GRADIENTE */}
                    <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
                        
                        <div className="relative flex justify-between items-start">
                            <div className="flex items-start gap-6">
                                <div className="avatar placeholder">
                                    <div className="bg-gradient-to-br from-green-400 to-emerald-600 text-white rounded-2xl w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-2xl ring-4 ring-white/30">
                                        {selectedCliente.nombre.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-3">{selectedCliente.nombre}</h2>
                                    <div className="flex flex-wrap items-center gap-2 text-white/90">
                                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                                            <FaIdCard className="text-lg"/> 
                                            <span className="font-mono font-semibold">{selectedCliente.dni}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                                            <FaCalendarCheck className="text-lg"/> 
                                            <span className="font-medium">Alta: {selectedCliente.fechaAlta || 'No registrado'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setDetailOpen(false)} className="btn btn-circle btn-ghost text-white hover:bg-white/20 hover:rotate-90 transition-all duration-300">✕</button>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            
                            {/* DATOS PERSONALES */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b-2 border-blue-500">
                                    <FaUser className="text-blue-600"/> DATOS PERSONALES
                                </h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Teléfono */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-green-100 p-3 rounded-lg">
                                                <FaPhone className="text-green-600 text-xl"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Teléfono</p>
                                                <p className="font-bold text-gray-800 text-lg">{selectedCliente.telefono1 || 'No registrado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fecha de Nacimiento */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-pink-100 p-3 rounded-lg">
                                                <FaBirthdayCake className="text-pink-600 text-xl"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Cumpleaños</p>
                                                <p className="font-semibold text-gray-800 text-sm">
                                                    {selectedCliente.fechaNacimiento 
                                                      ? new Date(selectedCliente.fechaNacimiento + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                                                      : 'No registrado'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email - ANCHO COMPLETO */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <FaEnvelope className="text-blue-600 text-xl"/>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                                <p className="font-semibold text-gray-800">{selectedCliente.email || 'No registrado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Dirección - ANCHO COMPLETO */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow sm:col-span-2">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-red-100 p-3 rounded-lg">
                                                <FaMapMarkerAlt className="text-red-600 text-xl"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Dirección</p>
                                                <p className="font-semibold text-gray-800">{selectedCliente.direccion}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Estado Civil */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-purple-100 p-3 rounded-lg">
                                                <FaRing className="text-purple-600 text-xl"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Estado Civil</p>
                                                <p className="font-semibold text-gray-800">{selectedCliente.estadoCivil || 'No especificado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ocupación */}
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-orange-100 p-3 rounded-lg">
                                                <FaBriefcase className="text-orange-600 text-xl"/>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase">Ocupación</p>
                                                <p className="font-semibold text-gray-800">{selectedCliente.ocupacion || 'No especificado'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* INTERÉS PRINCIPAL */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 pb-2 border-b-2 border-indigo-500">
                                    <FaHome className="text-indigo-600"/> INTERÉS PRINCIPAL
                                </h3>
                                
                                {interesPrincipal && interesPrincipal.Propiedad ? (
                                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border-2 border-indigo-200 shadow-lg">
                                        
                                        {/* Propiedad */}
                                        <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                                            <p className="text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-1">
                                                <FaMapMarkerAlt/> Propiedad Seleccionada
                                            </p>
                                            <p className="font-bold text-gray-900 text-xl">{interesPrincipal.Propiedad.direccion}</p>
                                        </div>
                                        
                                        {/* Detalles en Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-4">
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <p className="text-xs text-gray-500 font-bold mb-1">Precio</p>
                                                <p className="font-bold text-green-600 text-lg">{interesPrincipal.Propiedad.moneda} {interesPrincipal.Propiedad.precio}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <p className="text-xs text-gray-500 font-bold mb-1">Operación</p>
                                                <p className="font-bold text-gray-800">{interesPrincipal.Propiedad.modalidad}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <p className="text-xs text-gray-500 font-bold mb-1">Tipo</p>
                                                <p className="font-bold text-gray-800">{interesPrincipal.Propiedad.tipo}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg shadow-sm">
                                                <p className="text-xs text-gray-500 font-bold mb-1">Asesor Prop</p>
                                                <p className="font-bold text-gray-800">{interesPrincipal.Propiedad.asesor || 'N/A'}</p>
                                            </div>
                                        </div>

                                        {/* Asesor del Cliente */}
                                        <div className="bg-white p-4 rounded-xl mb-4 shadow-sm">
                                            <p className="text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-1">
                                                <FaUserTie/> Asesor del Cliente
                                            </p>
                                            <p className="font-bold text-gray-900 text-lg">{asesorClienteGuardado}</p>
                                        </div>

                                        {/* Observaciones */}
                                        {observacionesGuardadas && (
                                            <div className="bg-white p-4 rounded-xl shadow-sm">
                                                <p className="text-xs font-bold text-indigo-600 uppercase mb-2 flex items-center gap-1">
                                                    <FaStickyNote/> Observaciones
                                                </p>
                                                <p className="text-sm text-gray-700 italic leading-relaxed">{observacionesGuardadas}</p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 p-8 rounded-2xl border-2 border-dashed border-gray-300 h-full flex flex-col items-center justify-center text-center">
                                        <div className="bg-gray-200 p-6 rounded-full mb-4">
                                            <FaHome className="text-6xl text-gray-400"/>
                                        </div>
                                        <p className="font-bold text-gray-500 text-xl mb-2">Sin Interés Principal</p>
                                        <p className="text-sm text-gray-400 max-w-xs">No se seleccionó una propiedad al momento de registrar a este cliente.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FOOTER */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 flex justify-end border-t-2 border-gray-200">
                        <button onClick={() => setDetailOpen(false)} className="btn btn-primary btn-lg px-10 bg-gradient-to-r from-blue-600 to-indigo-600 border-none shadow-lg hover:shadow-xl transition-all">
                            Cerrar Ficha
                        </button>
                    </div>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}