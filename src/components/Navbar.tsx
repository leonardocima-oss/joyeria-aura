/**
 * COMPONENTE: src/components/Navbar.tsx
 * 
 * Barra de navegación superior de la tienda.
 * Muestra el logotipo de la joyería, enlaces a las secciones y el botón del carrito
 * con un contador numérico que se actualiza cuando agregas productos.
 */

import { Sparkles, ShoppingBag, Menu, X, Coins } from 'lucide-react';
import { useState } from 'react';
import type { Currency } from '../utils/currency.ts';

interface NavbarProps {
  totalCartItems: number;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenCart: () => void;
}

export function Navbar({ totalCartItems, currency, onCurrencyChange, onOpenCart }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. Logotipo y nombre de la joyería */}
          <a href="#inicio" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-amber-700/10 border border-amber-600/30 flex items-center justify-center text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif tracking-widest text-xl font-semibold text-stone-900 block leading-none">
                AURA
              </span>
              <span className="text-[10px] uppercase tracking-widest text-amber-800 font-sans font-medium">
                Joyería Fina
              </span>
            </div>
          </a>

          {/* 2. Menú de navegación de escritorio */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600 tracking-wide">
            <a href="#inicio" className="hover:text-amber-800 transition-colors">
              Inicio
            </a>
            <a href="#catalogo" className="hover:text-amber-800 transition-colors">
              Colección & Precios
            </a>
            <a href="#presentacion" className="hover:text-amber-800 transition-colors">
              Nuestra Historia
            </a>
            <a href="#garantia" className="hover:text-amber-800 transition-colors">
              Garantía y Calidad
            </a>
          </div>

          {/* 3. Selector de Divisa y Botón de Carrito */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Selector de Moneda */}
            <div className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200/80 px-2.5 py-1.5 rounded-full border border-stone-200 transition-colors">
              <Coins className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <select
                value={currency}
                onChange={(e) => onCurrencyChange(e.target.value as Currency)}
                className="bg-transparent text-xs font-semibold text-stone-800 focus:outline-none cursor-pointer pr-1"
                aria-label="Seleccionar divisa"
              >
                <option value="USD">USD ($)</option>
                <option value="MXN">MXN ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-stone-100 hover:bg-amber-50 text-stone-800 hover:text-amber-900 border border-stone-200 transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-xs"
              aria-label="Abrir carrito de compra"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider pr-1">
                Bolsa
              </span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-700 text-white font-sans text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Botón de menú para celulares */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
              aria-label="Alternar menú móvil"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú desplegable para dispositivos móviles */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-stone-50 px-4 pt-3 pb-5 space-y-3">
          <a
            href="#inicio"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium py-2 px-3 rounded hover:bg-white"
          >
            Inicio
          </a>
          <a
            href="#catalogo"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium py-2 px-3 rounded hover:bg-white"
          >
            Colección & Precios
          </a>
          <a
            href="#presentacion"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium py-2 px-3 rounded hover:bg-white"
          >
            Nuestra Historia
          </a>
          <a
            href="#garantia"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-stone-700 font-medium py-2 px-3 rounded hover:bg-white"
          >
            Garantía y Calidad
          </a>
        </div>
      )}
    </nav>
  );
}
