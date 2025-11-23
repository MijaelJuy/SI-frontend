'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useInmobiliariaStore } from '../store/useInmobiliariaStore';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Traemos la función manual para "re-loguear" desde el store si recargan la página
  // (Necesitaremos hacer un pequeño ajuste en el store para esto, ver abajo)
  const { isAuthenticated } = useInmobiliariaStore();

  useEffect(() => {
    const checkAuth = () => {
      // 1. Buscamos si hay datos guardados en el navegador
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      // 2. Definimos rutas públicas (donde cualquiera puede entrar)
      const publicPaths = ['/login', '/registro'];
      const isPublicPath = publicPaths.includes(pathname);

      // CASO A: No hay token y quiere entrar a zona privada
      if (!token && !isPublicPath) {
        router.push('/login'); // 🚫 ¡Fuera! Al login.
        return;
      }

      // CASO B: Ya tiene token pero quiere ir al login (lo mandamos al home)
      if (token && isPublicPath) {
        router.push('/'); 
        return;
      }

      // CASO C: Todo correcto, recuperamos la sesión en el Store visualmente
      if (token && user && !isAuthenticated) {
        useInmobiliariaStore.setState({ 
          currentUser: JSON.parse(user), 
          isAuthenticated: true 
        });
      }

      // Permitir ver la página
      setIsAuthorized(true);
    };

    checkAuth();
  }, [router, pathname, isAuthenticated]);

  // Mientras verificamos, no mostramos nada (o podrías poner un spinner)
  if (!isAuthorized) {
    return null; 
  }

  return <>{children}</>;
}