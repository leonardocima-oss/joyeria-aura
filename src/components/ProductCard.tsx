/**
 * COMPONENTE: src/components/ProductCard.tsx
 * 
 * Tarjeta individual para mostrar cada joya.
 * Muestra la fotografía, nombre, material, precio claramente legible
 * y el botón de acción para agregar el producto a la compra.
 */

import { Plus, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../data/products.ts';
import { formatCurrency, Currency } from '../utils/currency.ts';

interface ProductCardProps {
  product: Product;
  currency?: Currency;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, currency = 'USD', onAddToCart }: ProductCardProps) {
  const [justAdded, setJustAdded] = useState(false);

  // Función para manejar el clic y dar respuesta visual al usuario
  const handleAdd = () => {
    if (!product.inStock) return; // Evita agregar al carrito productos agotados
    onAddToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  // Formateador dinámico según la divisa activa (USD, MXN, EUR)
  const formattedPrice = formatCurrency(product.price, currency);

  return (
    <article className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col">
      {/* 1. Contenedor de la Imagen con insignia */}
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={product.imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            product.inStock ? 'group-hover:scale-105' : 'grayscale-30 opacity-80'
          }`}
          loading="lazy"
        />

        {/* Insignia destacada (si existe) */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-700 text-white shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {product.badge}
          </span>
        )}

        {/* Aviso de Agotado sobre la imagen */}
        {(!product.inStock || product.stock === 0) && (
          <div className="absolute inset-0 bg-stone-950/35 flex items-center justify-center pointer-events-none">
            <span className="bg-stone-900/95 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-md shadow-lg border border-stone-700">
              Agotado (0 en stock)
            </span>
          </div>
        )}

        {/* Insignia de metal noble */}
        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 backdrop-blur-xs text-white">
          {product.metal}
        </span>
      </div>

      {/* 2. Información del producto */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5 font-medium gap-2">
          <span className="uppercase tracking-wider text-amber-800 truncate">{product.category}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
            !product.inStock || product.stock === 0
              ? 'text-rose-700 bg-rose-50 border border-rose-200'
              : product.stock === 1
              ? 'text-amber-800 bg-amber-100/80 border border-amber-300 font-bold animate-pulse'
              : product.stock <= 3
              ? 'text-amber-800 bg-amber-50 border border-amber-200'
              : 'text-emerald-700 bg-emerald-50'
          }`}>
            {!product.inStock || product.stock === 0
              ? 'Agotado (0 disp.)'
              : product.stock === 1
              ? '¡Última pieza!'
              : `${product.stock} disponibles`}
          </span>
        </div>

        <h3 className="font-serif text-lg font-semibold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="text-xs text-stone-600 mt-2 mb-4 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* 3. Precio y Botón de Añadir */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-500 block">Precio</span>
            <span className="text-xl font-bold text-stone-900 font-sans tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock || product.stock === 0}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              !product.inStock || product.stock === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed border border-stone-200 shadow-none'
                : justAdded
                ? 'bg-emerald-600 text-white cursor-pointer'
                : 'bg-stone-900 hover:bg-amber-700 text-white shadow-xs cursor-pointer'
            }`}
          >
            {!product.inStock || product.stock === 0 ? (
              'Agotado'
            ) : justAdded ? (
              <>
                <Check className="w-4 h-4" />
                Agregado
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Comprar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
