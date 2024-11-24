"use client"
import { Menu, Phone, ShoppingCart } from "lucide-react"
import {NavLink} from './nav-link'

const routes = [
  { path: "/", label: "Home", icon: null }, // adiciona o link para a página inicial
  { path: "/carrinho", label: "Carrinho", icon: <ShoppingCart className="h-5 w-5 mr-1" /> }, // adiciona o link para a página de carrinho
  { path: "/compras", label: "Compras", icon: <ShoppingCart className="h-5 w-5 mr-1" /> }, // adiciona o link para a página de compras
];

export function Header() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-gray-800">MyStore</span>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            {routes.map((route) => (
              <NavLink
                key={route.path}
                path={route.path}
                label={route.label}
                icon={route.icon}
              />
            ))}
          </div>

          <div className="sm:hidden flex items-center">
            <Menu className="h-6 w-6 text-gray-800" />
          </div>
        </div>
      </div>
    </nav>
  );
}