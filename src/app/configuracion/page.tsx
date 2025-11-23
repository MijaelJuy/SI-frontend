'use client';
import Navbar from '../../components/Navbar';

export default function ConfiguracionPage() {
  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <main className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-2">
          ⚙️ Configuración del Sistema
        </h1>

        <div className="flex flex-col gap-6">
          
          {/* 1. APARIENCIA */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title border-b pb-2">🎨 Apariencia</h2>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <span className="label-text text-lg">Modo Oscuro Automático</span> 
                  <input type="checkbox" className="toggle toggle-primary" defaultChecked />
                </label>
                <p className="text-sm text-gray-500 mt-1">Ajustar automáticamente según la configuración del sistema.</p>
              </div>
            </div>
          </div>

          {/* 2. SEGURIDAD */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title border-b pb-2">🔐 Seguridad</h2>
              <div className="grid gap-4 max-w-md">
                <div className="form-control">
                  <label className="label font-bold">Cambiar Contraseña</label>
                  <input type="password" placeholder="Contraseña actual" className="input input-bordered mb-2" />
                  <input type="password" placeholder="Nueva contraseña" className="input input-bordered mb-2" />
                  <input type="password" placeholder="Confirmar nueva contraseña" className="input input-bordered" />
                </div>
                <button className="btn btn-outline btn-primary w-full">Actualizar Contraseña</button>
              </div>
            </div>
          </div>

          {/* 3. NOTIFICACIONES */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title border-b pb-2">🔔 Notificaciones</h2>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                  <span className="label-text">Recibir correo cuando se registre un nuevo cliente</span>
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-4">
                  <input type="checkbox" className="checkbox checkbox-primary" defaultChecked />
                  <span className="label-text">Recibir alerta de visitas programadas</span>
                </label>
              </div>
            </div>
          </div>

          {/* 4. SISTEMA */}
          <div className="card bg-base-100 shadow-xl border border-error">
            <div className="card-body">
              <h2 className="card-title text-error border-b pb-2">⚠️ Zona de Peligro</h2>
              <p className="text-sm text-gray-500">Si la aplicación falla, puedes limpiar los datos temporales.</p>
              
              {/* 👇 BOTÓN CORREGIDO: Agregué 'px-10' para hacerlo más ancho */}
              <button 
                className="btn btn-error text-white w-fit mt-2 px-10 shadow-md"
                onClick={() => {
                    if(confirm('¿Borrar datos locales? Tendrás que iniciar sesión de nuevo.')) {
                        localStorage.clear();
                        window.location.href = '/login';
                    }
                }}
              >
                Limpiar Caché Local y Salir
              </button>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}