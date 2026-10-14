/**
 * COMPONENTE: src/components/AboutSection.tsx
 * 
 * Sección de presentación de la joyería:
 * Explica la historia, tradición artesanal y los estándares de calidad.
 */

import { Award, Clock, HeartHandshake } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="presentacion" className="py-20 bg-stone-100/70 border-t border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Imagen ilustrativa del taller orfebre */}
          <div className="relative">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-stone-200">
              <img
                src="https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80"
                alt="Orfebre tallando joyas en el taller"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-amber-800 text-white p-5 rounded-xl shadow-xl hidden sm:block max-w-xs">
              <p className="font-serif text-2xl font-bold">Más de 25 años</p>
              <p className="text-xs text-amber-200 mt-1">Creando recuerdos eternos con maestros orfebres certificados.</p>
            </div>
          </div>

          {/* Texto de la presentación */}
          <div className="space-y-6">
            <div className="inline-block text-xs uppercase tracking-widest font-semibold text-amber-800 bg-amber-100/60 px-3 py-1 rounded-full">
              Tradición Orfebre
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal leading-tight">
              Cada joya cuenta una historia de <span className="italic text-amber-800">perfección y devoción</span>
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              En <strong>Aura Joyas</strong> combinamos técnicas milenarias de forja tradicional con diseño contemporáneo. Cada piedra preciosa es seleccionada minuciosamente bajo estrictos estándares éticos y de trazabilidad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <Award className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider">Metales Puros</h4>
                <p className="text-[11px] text-stone-500 mt-1">Oro 18k y Plata 925 sin níquel.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <HeartHandshake className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider">Ética Sostenible</h4>
                <p className="text-[11px] text-stone-500 mt-1">Gemas de origen responsable.</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200">
                <Clock className="w-5 h-5 text-amber-700 mb-2" />
                <h4 className="text-xs font-bold uppercase text-stone-800 tracking-wider">De por Vida</h4>
                <p className="text-[11px] text-stone-500 mt-1">Servicio de pulido gratuito.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
