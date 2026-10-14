/**
 * ARCHIVO PRINCIPAL: src/App.tsx
 * 
 * Aquí ensamblamos todas las partes de la tienda:
 * 1. La barra de navegación (Navbar)
 * 2. La presentación de la joyería (Hero y AboutSection)
 * 3. El catálogo de productos con precios y filtros interactivos
 * 4. El panel de compras (CartDrawer)
 * 
 * GUÍA DE APRENDIZAJE:
 * - Para cambiar los productos o sus precios: edita "src/data/products.ts".
 * - Para cambiar el menú superior: edita "src/components/Navbar.tsx".
 * - Para cambiar el texto de bienvenida: edita "src/components/Hero.tsx".
 */

import { useState, useEffect } from 'react';
import { INITIAL_PRODUCTS, Product } from './data/products.ts';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { ProductCard } from './components/ProductCard.tsx';
import { CartDrawer, CartItem } from './components/CartDrawer.tsx';
import { Currency } from './utils/currency.ts';
import { Search, Sparkles, Filter, Info, Shield, Boxes } from 'lucide-react';
import { sincronizarStockCategoriasEnFirebase, escucharStockCategoriasEnTiempoReal } from './services/stockService.ts';

export default function App() {
  // 1. ESTADO: Catálogo de productos (cargados inicialmente desde data/products.ts)
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // 2. ESTADO: Divisa seleccionada (USD, MXN o EUR)
  const [currentCurrency, setCurrentCurrency] = useState<Currency>('USD');

  // 3. ESTADO: Filtros de la tienda
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');

  // 4. ESTADO: Carrito de compras
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 5. ESTADO: Inventario en tiempo real sincronizado con Google Firebase (Colección 'Stock-exis')
  const [categoryStocks, setCategoryStocks] = useState<Record<string, number>>({
    Anillos: 7,
    Collares: 14,
    Pulseras: 6,
    Aretes: 5,
    Relojes: 2,
  });

  // Efecto que conecta y sincroniza el inventario de cada categoría desde Firebase
  useEffect(() => {
    // Sincroniza los documentos en Firestore si no existen
    sincronizarStockCategoriasEnFirebase();

    // Escucha en tiempo real cualquier cambio hecho en la consola de Firebase
    const desuscribir = escucharStockCategoriasEnTiempoReal((stockMap) => {
      setCategoryStocks((prev) => ({ ...prev, ...stockMap }));
    });

    return () => desuscribir();
  }, []);

  // Categorías disponibles para los botones de filtrado
  const categories = ['Todos', 'Anillos', 'Collares', 'Pulseras', 'Aretes', 'Relojes'];

  // Función para agregar un producto al carrito
  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  };

  // Función para modificar la cantidad (+1 o -1)
  const handleUpdateQuantity = (productId: number, delta: number) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  // Función para eliminar un producto del carrito
  const handleRemoveItem = (productId: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  // Función para vaciar el carrito
  const handleClearCart = () => {
    setCartItems([]);
  };

  // Función para descontar automáticamente el stock de las joyas compradas en el catálogo en vivo
  const handleDeductProductStock = (purchasedItems: CartItem[]) => {
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const itemPurchased = purchasedItems.find((p) => p.product.id === prod.id);
        if (itemPurchased) {
          const nuevoStock = Math.max(0, prod.stock - itemPurchased.quantity);
          return {
            ...prod,
            stock: nuevoStock,
            inStock: nuevoStock > 0,
          };
        }
        return prod;
      })
    );
  };

  // Total de artículos en la bolsa (suma de cantidades)
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Filtrado y ordenamiento de productos
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.metal.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 1. BARRA DE NAVEGACIÓN */}
      <Navbar
        totalCartItems={totalCartCount}
        currency={currentCurrency}
        onCurrencyChange={setCurrentCurrency}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* 2. SECCIÓN DE PRESENTACIÓN (HERO) */}
      <Hero />

      {/* 3. GUÍA PARA EL DESARROLLADOR / ESTUDIANTE (Banner informativo plegable) */}
      <div className="bg-amber-50/80 border-b border-amber-200/80 py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-amber-900 gap-2">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Modo de Aprendizaje:</strong> Puedes editar los precios, nombres e imágenes en el archivo <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-amber-300">src/data/products.ts</code>.
            </span>
          </div>
          <span className="text-[11px] text-emerald-800 bg-emerald-100/90 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            🔥 Firebase Firestore Conectado en Vivo (joyeria-aura)
          </span>
        </div>
      </div>

      {/* 4. SECCIÓN DEL CATÁLOGO DE PRODUCTOS Y PRECIOS */}
      <section id="catalogo" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado del catálogo */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-800 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Nuestras Creaciones
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal">
            Catálogo Exclusivo con Precios
          </h2>
          <p className="text-stone-600 text-sm mt-3">
            Explora las joyas disponibles en tiempo real. Selecciona una categoría o busca por material (oro, plata, gemas).
          </p>
        </div>

        {/* Barra de Filtros, Búsqueda y Orden de Precios */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Botones de categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-stone-400 mr-1 shrink-0 hidden sm:block" />
            {categories.map((cat) => {
              const stockNum = cat === 'Todos'
                ? Object.values(categoryStocks).reduce((a, b) => a + b, 0)
                : categoryStocks[cat] ?? 0;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                      selectedCategory === cat
                        ? 'bg-amber-600/80 text-white'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {stockNum}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Buscador y Ordenador de Precios */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Input de búsqueda */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar joya o material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:bg-white transition-all"
              />
            </div>

            {/* Selector de orden de precio */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'default' | 'asc' | 'desc')}
              className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-700"
              aria-label="Ordenar por precio"
            >
              <option value="default">Orden original</option>
              <option value="asc">Precio: Menor a Mayor</option>
              <option value="desc">Precio: Mayor a Menor</option>
            </select>
          </div>
        </div>

        {/* Cuadrícula de Joyas */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500">
            <p className="font-serif text-lg font-medium text-stone-700">No encontramos productos con ese criterio</p>
            <p className="text-xs text-stone-400 mt-1">Prueba seleccionando otra categoría o borrando el término de búsqueda.</p>
            <button
              onClick={() => {
                setSelectedCategory('Todos');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currentCurrency}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. SECCIÓN DE PRESENTACIÓN E HISTORIA */}
      <AboutSection />

      {/* 6. GARANTÍA Y CONFIANZA */}
      <section id="garantia" className="py-16 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl text-stone-900 font-semibold mb-2">
            Garantía de Satisfacción Total
          </h3>
          <p className="text-stone-600 text-sm max-w-xl mx-auto mb-6">
            Cada adquisición en Aura Joyas cuenta con 30 días para cambios y certificado de pureza para metales y gemas.
          </p>
          <div className="inline-flex items-center gap-6 text-xs text-stone-500">
            <span>✓ Devolución asegurada</span>
            <span>✓ Asesoría personalizada</span>
            <span>✓ Taller propio</span>
          </div>
        </div>
      </section>

      {/* 7. PIE DE PÁGINA (FOOTER) */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-serif text-lg font-bold text-stone-100 tracking-wider">AURA JOYAS</span>
            <p className="text-stone-500 text-[11px] mt-1">Joyería fina tradicional y contemporánea.</p>
          </div>
          <div className="flex gap-6">
            <a href="#inicio" className="hover:text-stone-200 transition-colors">Inicio</a>
            <a href="#catalogo" className="hover:text-stone-200 transition-colors">Catálogo</a>
            <a href="#presentacion" className="hover:text-stone-200 transition-colors">Historia</a>
          </div>
          <p className="text-stone-600 text-[11px]">
            © {new Date().getFullYear()} Aura Joyas. Diseñado para aprender desarrollo web paso a paso.
          </p>
        </div>
      </footer>

      {/* 8. PANEL LATERAL DE COMPRA (CARRITO) */}
      <CartDrawer
        isOpen={isCartOpen}
        currency={currentCurrency}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onPurchaseSuccess={handleDeductProductStock}
      />
    </div>
  );
}
