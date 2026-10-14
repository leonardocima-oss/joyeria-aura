/**
 * ARCHIVO: src/services/stockService.ts
 * 
 * Capa de servicio conectada a Google Cloud Firestore (Colección 'Stock-exis').
 * Administra, sincroniza y contabiliza automáticamente el inventario disponible:
 * - Anillos (Stock-anill)
 * - Collares (Stock-coll)
 * - Pulseras (Stock-puls)
 * - Aretes (Stock-aret)
 * - Relojes (Stock-reloj)
 */

import { db } from './firebase.ts';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot, 
  collection, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';

export interface CategoryStock {
  idDoc: string;
  categoria: string;
  cantidad: number;
  descripcion: string;
}

// 1. DICCIONARIO DE CATEGORÍAS Y SUS DOCUMENTOS EN FIRESTORE
export const CATEGORIAS_STOCK_CONFIG = [
  { idDoc: 'Stock-anill', categoria: 'Anillos', cantidad: 7, descripcion: 'Anillos de varios modelos y gemas' },
  { idDoc: 'Stock-coll', categoria: 'Collares', cantidad: 14, descripcion: 'Collares y gargantillas finas' },
  { idDoc: 'Stock-puls', categoria: 'Pulseras', cantidad: 6, descripcion: 'Pulseras eslabón veneciano' },
  { idDoc: 'Stock-aret', categoria: 'Aretes', cantidad: 5, descripcion: 'Aretes perla australiana y circonias' },
  { idDoc: 'Stock-reloj', categoria: 'Relojes', cantidad: 4, descripcion: 'Relojes de lujo Rolex y alta gama' },
];

// Mapeo rápido de nombre de categoría al ID del documento en Firestore
export const MAPA_CATEGORIA_A_DOC: Record<string, string> = {
  Anillos: 'Stock-anill',
  Collares: 'Stock-coll',
  Pulseras: 'Stock-puls',
  Aretes: 'Stock-aret',
  Relojes: 'Stock-reloj',
};

// 2. FUNCIÓN PARA CREAR Y SINCRONIZAR TODAS LAS CATEGORÍAS EN FIRESTORE
export async function sincronizarStockCategoriasEnFirebase(): Promise<void> {
  try {
    for (const cat of CATEGORIAS_STOCK_CONFIG) {
      const docRef = doc(db, 'Stock-exis', cat.idDoc);
      const snapshot = await getDoc(docRef);

      // Si el documento no existe en Firestore, lo crea con los valores base
      if (!snapshot.exists()) {
        await setDoc(docRef, {
          categoria: cat.categoria,
          cantidad: cat.cantidad,
          descripcion: cat.descripcion,
          creadoEn: serverTimestamp(),
        });
        console.log(`✅ Creado documento ${cat.idDoc} en colección Stock-exis de Firebase.`);
      }
    }
  } catch (error) {
    console.warn('Nota de sincronización de stock:', error);
  }
}

// 3. FUNCIÓN PARA LEER EL STOCK DE TODAS LAS CATEGORÍAS
export async function obtenerStockTodasCategorias(): Promise<Record<string, number>> {
  try {
    const coleccionRef = collection(db, 'Stock-exis');
    const querySnapshot = await getDocs(coleccionRef);

    const stockMap: Record<string, number> = {};

    querySnapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const nombreCat = data.categoria || docSnapshot.id;
      const cant = typeof data.cantidad === 'number' ? data.cantidad : 5;
      stockMap[nombreCat] = Math.max(0, cant);
    });

    console.log('📦 Inventario por categoría leído de Firebase Firestore:', stockMap);
    return stockMap;
  } catch (error) {
    console.error('❌ Error al consultar Stock-exis en Firebase:', error);
    return {};
  }
}

// 4. FUNCIÓN EN TIEMPO REAL: Escucha cambios automáticos en la colección de Firebase
export function escucharStockCategoriasEnTiempoReal(alActualizar: (stockMap: Record<string, number>) => void) {
  const coleccionRef = collection(db, 'Stock-exis');

  return onSnapshot(coleccionRef, (snapshot) => {
    const stockMap: Record<string, number> = {};
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      const nombreCat = data.categoria || docSnapshot.id;
      const cant = typeof data.cantidad === 'number' ? data.cantidad : 5;
      stockMap[nombreCat] = Math.max(0, cant);
    });

    alActualizar(stockMap);
  });
}

// 5. FUNCIÓN ATÓMICA DE CONTABILIZACIÓN: Resta automáticamente el inventario en Firebase cuando alguien compra
export async function descontarStockPorCategoriaEnFirebase(
  articulosVendidos: { categoria: string; cantidad: number }[]
): Promise<void> {
  try {
    // Sumamos cuántas piezas se vendieron de cada categoría en este pedido
    const cantidadesPorCat: Record<string, number> = {};
    for (const art of articulosVendidos) {
      if (art.categoria) {
        cantidadesPorCat[art.categoria] = (cantidadesPorCat[art.categoria] || 0) + art.cantidad;
      }
    }

    // Actualizamos atómicamente cada documento en la colección 'Stock-exis' en Firebase
    for (const [categoria, cantidad] of Object.entries(cantidadesPorCat)) {
      const idDoc = MAPA_CATEGORIA_A_DOC[categoria];
      if (idDoc) {
        const docRef = doc(db, 'Stock-exis', idDoc);
        await updateDoc(docRef, {
          cantidad: increment(-cantidad),
          ultimaVenta: serverTimestamp(),
        });
        console.log(`📉 [AUTOMÁTICO] Inventario restado en Firebase: -${cantidad} en categoría ${categoria} (${idDoc})`);
      }
    }
  } catch (error) {
    console.error('❌ Error al descontar inventario en Firebase:', error);
  }
}