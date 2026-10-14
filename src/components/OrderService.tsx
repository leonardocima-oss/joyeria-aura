/**
 * ARCHIVO DE ARQUITECTURA: src/components/OrderService.tsx
 * 
 * Capa de servicio conectada a Google Cloud Firestore.
 * Cuando un cliente confirma una compra, esta función envía los datos
 * a tu base de datos en tiempo real en Firebase.
 */

import { db } from '../services/firebase.ts';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { EXCHANGE_RATES } from '../utils/currency.ts';
import { descontarStockPorCategoriaEnFirebase } from '../services/stockService.ts';

export interface OrderItem {
  id: number;
  nombre: string;
  categoria?: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface OrderData {
  orderId: string;
  fecha: string;
  cliente: {
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
  };
  divisa?: {
    moneda: string;
    tasaCambio: number;
    totalBaseUSD: number;
    totalCobrado: number;
  };
  articulos: OrderItem[];
  total: number;
}

// 1. FUNCIÓN PARA CREAR EL APARTADO DE DIVISAS EN FIREBASE (Colección 'configuracion_divisas')
export async function registrarApartadoDivisasEnFirebase() {
  try {
    const divisas = [
      { id: 'USD', nombre: 'Dólar Estadounidense', simbolo: '$', tasa: 1.0, activo: true },
      { id: 'MXN', nombre: 'Peso Mexicano', simbolo: '$', tasa: 19.5, activo: true },
      { id: 'EUR', nombre: 'Euro', simbolo: '€', tasa: 0.92, activo: true },
    ];

    for (const divisa of divisas) {
      await setDoc(doc(db, 'configuracion_divisas', divisa.id), {
        ...divisa,
        actualizadoEn: serverTimestamp(),
      });
    }
    console.log('🪙 Colección "configuracion_divisas" creada y sincronizada en Firebase Firestore.');
  } catch (error) {
    console.warn('Nota: No se pudo sincronizar configuracion_divisas:', error);
  }
}

// 2. FUNCIÓN ENCARGADA DE GUARDAR EL PEDIDO CON CUANTIFICACIÓN POR CADA DIVISA
export async function guardarPedido(pedido: OrderData): Promise<{ exito: boolean; mensaje: string; docId?: string }> {
  try {
    // Calculamos la cuantificación en todas las monedas soportadas
    const totalBaseUSD = pedido.divisa?.totalBaseUSD ?? pedido.total;
    const totalEnUSD = Number(totalBaseUSD.toFixed(2));
    const totalEnMXN = Number((totalBaseUSD * (EXCHANGE_RATES.MXN || 19.5)).toFixed(2));
    const totalEnEUR = Number((totalBaseUSD * (EXCHANGE_RATES.EUR || 0.92)).toFixed(2));

    const monedaCobrada = pedido.divisa?.moneda || 'USD';
    const totalCobrado = pedido.divisa?.totalCobrado || totalBaseUSD;
    const tasaAplicada = pedido.divisa?.tasaCambio || 1;

    // Guardamos el pedido en la colección 'pedidos' de tu Cloud Firestore
    const coleccionPedidos = collection(db, 'pedidos');
    const docRef = await addDoc(coleccionPedidos, {
      orderId: pedido.orderId,
      fecha: pedido.fecha,
      cliente: pedido.cliente,

      // ========================================================
      // APARTADO 1: RESUMEN DE LA MONEDA EN QUE PAGÓ EL CLIENTE
      // ========================================================
      moneda_de_pago: monedaCobrada,
      total_cobrado: totalCobrado,
      tasa_de_cambio_utilizada: tasaAplicada,

      // ========================================================
      // APARTADO 2: CUANTIFICACIÓN EN TODAS LAS DIVISAS
      // ========================================================
      cuantificacion_por_divisa: {
        total_en_dolares_USD: totalEnUSD,
        total_en_pesos_MXN: totalEnMXN,
        total_en_euros_EUR: totalEnEUR,
        tasas_del_dia: {
          USD: 1.0,
          MXN: 19.5,
          EUR: 0.92,
        },
      },

      // Campos planos directos para filtrar en la consola de Firebase
      total_usd: totalEnUSD,
      total_mxn: totalEnMXN,
      total_eur: totalEnEUR,

      articulos: pedido.articulos,
      estado: 'Pendiente de entrega',
      creadoEn: serverTimestamp(),
    });

    console.log('🔥 ¡PEDIDO CON APARTADOS DE DIVISA GUARDADO EN FIREBASE! ID:', docRef.id);

    // Contabilización automática de almacén: descuenta el stock en Firebase en vivo
    await descontarStockPorCategoriaEnFirebase(
      pedido.articulos.map(a => ({ categoria: a.categoria || '', cantidad: a.cantidad }))
    );

    // Aseguramos que la colección de divisas también exista en Firestore
    registrarApartadoDivisasEnFirebase();

    // 2. Guardamos también una copia en localStorage por respaldo local
    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos_joyeria') || '[]');
    pedidosExistentes.push({ ...pedido, firestoreDocId: docRef.id });
    localStorage.setItem('pedidos_joyeria', JSON.stringify(pedidosExistentes));

    return {
      exito: true,
      mensaje: `Pedido ${pedido.orderId} registrado exitosamente en Firebase.`,
      docId: docRef.id,
    };
  } catch (error: any) {
    console.error('❌ Error al guardar en Firebase Firestore:', error);
    
    // Si ocurre un error de permisos o red, guardamos en local y avisamos
    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos_joyeria') || '[]');
    pedidosExistentes.push(pedido);
    localStorage.setItem('pedidos_joyeria', JSON.stringify(pedidosExistentes));

    return {
      exito: false,
      mensaje: error?.message || 'Error al conectar con la base de datos.',
    };
  }
}

// Función auxiliar para consultar los pedidos guardados localmente
export function obtenerHistorialPedidos(): OrderData[] {
  return JSON.parse(localStorage.getItem('pedidos_joyeria') || '[]');
}