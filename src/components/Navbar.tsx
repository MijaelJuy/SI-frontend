'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSun, FaMoon, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useInmobiliariaStore } from '../store/useInmobiliariaStore';

export default function Navbar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();
  const { logout, currentUser } = useInmobiliariaStore();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="navbar bg-base-100 shadow-md px-6 z-50 relative">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl text-primary font-bold gap-2">
          🏠 <span className="hidden sm:inline">Sillar Inmobiliaria</span>
        </Link>
      </div>

      <div className="flex-none gap-4">
        <button className="btn btn-ghost btn-circle text-xl" onClick={toggleTheme} title="Cambiar tema">
          {isDarkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
        </button>

        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-xl">{currentUser?.nombre?.charAt(0).toUpperCase() || 'A'}</span> 
            </div>
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
            <li className="menu-title px-4 py-2 text-primary">
              Hola, {currentUser?.nombre || 'Asesor'} 👋
            </li>
            <li>
              <Link href="/perfil" className="justify-between">
                Mi Perfil
                <span className="badge badge-primary badge-sm">Ver</span>
              </Link>
            </li>
            <li>
              <Link href="/configuracion"><FaCog /> Configuración</Link>
            </li>
            <div className="divider my-0"></div>
            <li>
              <button onClick={handleLogout} className="text-error font-semibold">
                <FaSignOutAlt /> Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}