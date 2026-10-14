/**
 * COMPONENTE: src/components/CartDrawer.tsx
 * 
 * Panel lateral de compra y carrito de la tienda.
 * Administra la lista de piezas seleccionadas, calcula los totales
 * y permite simular el proceso de compra.
 * 
 * NOTA EDUCATIVA: Todos los cálculos se hacen en tiempo real en la memoria del navegador.
 * No se envían a ninguna base de datos externa todavía.
 */

import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import type { Product } from '../data/products.ts';
import { guardarPedido } from './OrderService.tsx';
import { formatCurrency, Currency, EXCHANGE_RATES } from '../utils/currency.ts';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  currency?: Currency;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onPurchaseSuccess?: (items: CartItem[]) => void;
}

export function CartDrawer({
  isOpen,
  currency = 'USD',
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPurchaseSuccess,
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // 1. ESTADO DEL FORMULARIO (Datos que escribe el cliente)
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
  });

  // 2. ESTADO DE ERRORES DE VALIDACIÓN (Guarda los mensajes de error de cada campo)
  const [formErrors, setFormErrors] = useState<{
    nombre?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
  }>({});

  if (!isOpen) return null;

  // Cálculo del total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const formatPrice = (val: number) => formatCurrency(val, currency);

  // 3. FUNCIÓN DE VALIDACIÓN: Revisa que cada dato cumpla con las reglas antes de continuar
  const validateForm = () => {
    const errors: { nombre?: string; email?: string; telefono?: string; direccion?: string } = {};

    // Validar nombre: al menos 3 letras
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre completo es obligatorio.';
    } else if (formData.nombre.trim().length < 2){
      errors.nombre = 'El nombre debe tener al menos 2 caracteres.';
    }

    // Validar correo: formato válido con @ y dominio
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio.';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Ingresa un correo electrónico válido (ejemplo: cliente@correo.com).';
    }

    // Validar teléfono: obligatorio para envíos de joyería de alto valor (mínimo 10 dígitos)
    const phoneDigits = formData.telefono.replace(/\D/g, '');
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es necesario para coordinar la entrega segura.';
    } else if (phoneDigits.length < 10) {
      errors.telefono = 'El teléfono debe contener al menos 10 dígitos numéricos.';
    }

    // Validar dirección de entrega
    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección de entrega es obligatoria para enviar las joyas.';
    } else if (formData.direccion.trim().length < 8) {
      errors.direccion = 'Por favor escribe la calle, número y ciudad completa.';
    }

    setFormErrors(errors);
    // Retorna true si no hubo ningún error (objeto de errores vacío)
    return Object.keys(errors).length === 0;
  };

  // 4. MANEJO DE LA CONFIRMACIÓN DE COMPRA
  const handleFinalizePurchase = async (e: React.FormEvent) => {
    e.preventDefault();

    // Si la validación falla, nos detenemos aquí
    if (!validateForm()) {
      return;
    }

    // 1. Obtenemos la tasa de cambio de la moneda elegida (USD, MXN o EUR)
    const tasa = EXCHANGE_RATES[currency] || 1;
    const totalEnDivisa = Number((totalAmount * tasa).toFixed(2));

    // 2. Empaquetamos la cuantificación por divisa dentro del pedido
    const orderData = {
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      fecha: new Date().toISOString(),
      cliente: formData,
      divisa: {
        moneda: currency,            // Ej. 'MXN'
        tasaCambio: tasa,            // Ej. 19.5
        totalBaseUSD: totalAmount,   // Ej. 210.00
        totalCobrado: totalEnDivisa, // Ej. 4095.00
      },
      articulos: items.map(item => ({
        id: item.product.id,
        nombre: item.product.name,
        categoria: item.product.category,
        precioBaseUSD: item.product.price,
        precioEnDivisa: Number((item.product.price * tasa).toFixed(2)),
        cantidad: item.quantity,
        subtotalEnDivisa: Number(((item.product.price * tasa) * item.quantity).toFixed(2)),
      })),
      total: totalEnDivisa,
    };

    // 3. Enviamos a Firebase mediante OrderService
    const respuesta = await guardarPedido(orderData);

    // Si el guardado fue exitoso, mostramos la pantalla verde y descontamos inventario en vivo
    if (respuesta.exito) {
      onPurchaseSuccess?.(items);
      setPurchaseSuccess(true);
      setTimeout(() => {
        onClearCart();
        setIsCheckingOut(false);
        setPurchaseSuccess(false);
        setFormData({ nombre: '', email: '', telefono: '', direccion: '' });
        setFormErrors({});
        onClose();
      }, 4000);
    }
  };  

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro para cerrar al hacer clic afuera */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Encabezado del carrito */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Tu Bolsa de Joyas
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {items.length === 0 ? 'Sin artículos' : `${items.length} modelo(s) seleccionado(s)`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cuerpo: Lista de artículos o pantalla de checkout */}
          <div className="flex-1 overflow-y-auto p-6">
            {purchaseSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-serif">¡Orden Registrada con Éxito!</h3>
                <p className="text-sm text-stone-600 mt-2">
                  Gracias por tu compra, <span className="font-semibold text-stone-800">{formData.nombre}</span>.
                </p>
                <div className="mt-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left">
                  <strong>Nota didáctica:</strong> Esta compra se ha completado en el estado local de React. En la etapa de Base de Datos, aprenderás a guardar esta orden en una base de datos real.
                </div>
              </div>
            ) : isCheckingOut ? (
              /* Formulario de Checkout con validación en tiempo real */
              <form onSubmit={handleFinalizePurchase} noValidate className="space-y-4">
                <div className="border-b border-stone-200 pb-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    ← Volver a la lista de productos
                  </button>
                  <h3 className="text-base font-bold text-stone-900 mt-2">Datos para el envío seguro</h3>
                  <p className="text-xs text-stone-500">Completa los datos para validar la orden de compra.</p>
                </div>

                {/* Campo: Nombre completo */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Nombre completo <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (formErrors.nombre) setFormErrors({ ...formErrors, nombre: undefined });
                    }}
                    placeholder="Ej. María González"
                    className={`w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 ${
                      formErrors.nombre
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400'
                        : 'border-stone-300 focus:ring-amber-700'
                    }`}
                  />
                  {formErrors.nombre && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.nombre}</p>
                  )}
                </div>

                {/* Campo: Correo electrónico */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Correo electrónico <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                    }}
                    placeholder="maria@ejemplo.com"
                    className={`w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 ${
                      formErrors.email
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400'
                        : 'border-stone-300 focus:ring-amber-700'
                    }`}
                  />
                  {formErrors.email && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.email}</p>
                  )}
                </div>

                {/* Campo: Teléfono de contacto */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Teléfono celular <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => {
                      setFormData({ ...formData, telefono: e.target.value });
                      if (formErrors.telefono) setFormErrors({ ...formErrors, telefono: undefined });
                    }}
                    placeholder="Ej. 55 1234 5678"
                    className={`w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 ${
                      formErrors.telefono
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400'
                        : 'border-stone-300 focus:ring-amber-700'
                    }`}
                  />
                  {formErrors.telefono && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.telefono}</p>
                  )}
                </div>

                {/* Campo: Dirección de entrega */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Dirección de entrega <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => {
                      setFormData({ ...formData, direccion: e.target.value });
                      if (formErrors.direccion) setFormErrors({ ...formErrors, direccion: undefined });
                    }}
                    placeholder="Calle, número exterior, colonia y ciudad"
                    className={`w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 ${
                      formErrors.direccion
                        ? 'border-rose-400 bg-rose-50/40 focus:ring-rose-400'
                        : 'border-stone-300 focus:ring-amber-700'
                    }`}
                  />
                  {formErrors.direccion && (
                    <p className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.direccion}</p>
                  )}
                </div>

                <div className="bg-stone-50 p-3 rounded-lg border border-stone-200 mt-4 text-xs space-y-1 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatPrice(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Envío asegurado:</span>
                    <span>GRATIS</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 pt-1 border-t border-stone-200 text-sm">
                    <span>Total a pagar:</span>
                    <span className="text-amber-800">{formatPrice(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-sm shadow-md transition-colors mt-4 flex items-center justify-center gap-2"
                >
                  Confirmar Pedido de Joyería
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : items.length === 0 ? (
              /* Carrito vacío */
              <div className="h-full flex flex-col items-center justify-center text-center text-stone-500 py-12">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                  <Trash2 className="w-6 h-6 text-stone-400" />
                </div>
                <p className="font-serif text-lg font-medium text-stone-700">Tu bolsa está vacía</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Explora las piezas de nuestro catálogo y agrégalas para ver el total calculado al instante.
                </p>
              </div>
            ) : (
              /* Lista de piezas en el carrito */
              <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 p-3 rounded-xl border border-stone-200 bg-stone-50/50"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-semibold text-stone-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-amber-800 font-bold mt-0.5">
                        {formatPrice(product.price)}
                      </p>

                      {/* Selector de cantidad (+ / -) */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(product.id, -1)}
                          className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xs"
                          aria-label="Disminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-1 text-stone-800">
                          {quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, 1)}
                          className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-xs"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>

                        <button
                          onClick={() => onRemoveItem(product.id)}
                          className="ml-auto text-stone-400 hover:text-rose-600 p-1"
                          title="Eliminar de la bolsa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pie del carrito con resumen y botón de compra */}
          {items.length > 0 && !isCheckingOut && !purchaseSuccess && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-4">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-800">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Envío asegurado:</span>
                  <span>Sin costo</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total estimado:</span>
                  <span className="text-amber-800 font-serif text-lg">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500 bg-white p-2.5 rounded-lg border border-stone-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Compra protegida y certificado de autenticidad incluido.</span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3.5 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-lg text-sm tracking-wider uppercase shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceder al Pago
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
