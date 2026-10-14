/**
 * COMPONENTE: src/components/Hero.tsx
 * 
 * Sección de presentación elegante para la joyería.
 * Contiene el encabezado principal, una introducción al valor de las piezas
 * y accesos directos al catálogo con precios.
 */

import { ShieldCheck, Truck, Gem, ArrowDown } from 'lucide-react';

export function Hero() {
  return (
    <section id="inicio" className="relative bg-stone-900 text-stone-100 overflow-hidden py-20 lg:py-28">
      {/* Fondo con textura sutil y superposición */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80')`,
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Pequeña etiqueta de prestigio */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-6">
            <Gem className="w-4 h-4" />
            Colección 2026 • Joyas de Autor
          </div>

          {/* Título de presentación */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white mb-6 leading-tight">
            Elegancia atemporal esculpida en <span className="italic font-normal text-amber-300">oro y gemas</span>
          </h1>

          {/* Párrafo descriptivo de presentación */}
          <p className="text-stone-300 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-2xl">
            Descubre nuestra cuidada selección de piezas hechas a mano. Anillos, collares y aretes diseñados para conmemorar tus momentos más trascendentes con metales nobles certificados.
          </p>

          {/* Botones de acción */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#catalogo"
              className="px-6 py-3.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm tracking-wider uppercase transition-all shadow-lg hover:shadow-amber-600/30 flex items-center gap-2"
            >
              Ver Catálogo y Precios
              <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href="#presentacion"
              className="px-6 py-3.5 rounded-lg border border-stone-600 hover:border-stone-400 text-stone-200 hover:text-white font-medium text-sm tracking-wider uppercase transition-colors"
            >
              Nuestra Filosofía
            </a>
          </div>
        </div>

        {/* 3 Promesas de valor / Garantías */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-stone-800">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-stone-800 text-amber-400 border border-stone-700">
              <Gem className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Metales Nobles Auténticos</h4>
              <p className="text-xs text-stone-400 mt-1">Oro de 18k y Plata de Ley 925 verificados por peritos gemólogos.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-stone-800 text-amber-400 border border-stone-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Certificado de Garantía</h4>
              <p className="text-xs text-stone-400 mt-1">Cada joya incluye su tarjeta física de autenticidad y quilataje.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-stone-800 text-amber-400 border border-stone-700">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Envío Blindado y Seguro</h4>
              <p className="text-xs text-stone-400 mt-1">Empaque de lujo con seguro total contra pérdidas o incidentes.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
