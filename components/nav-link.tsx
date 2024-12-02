'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"

export function NavLink({ path, label, icon }: { path: string; label: string; icon?: React.ReactNode }) { // cria um componente NavLink que recebe path, label e icon
  const pathname = usePathname();
  const isActive = pathname === path; // verifica se a rota atual é a mesma que a rota do link 

  return ( // retorna um link com a classe css de acordo com a rota atual
    <Link
      href={path}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition ${
        isActive
          ? "text-indigo-600 border-b-2 border-indigo-500"
          : "text-gray-900 hover:text-indigo-500"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}