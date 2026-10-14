/**
 * ARCHIVO DE DATOS: src/data/products.ts
 * 
 * Aquí se definen los productos que se muestran en la tienda.
 * Para modificar un precio, nombre, foto o número de stock,
 * solo necesitas editar o añadir un elemento en este archivo.
 */

export interface Product {
  id: number;
  name: string;
  category: 'Anillos' | 'Collares' | 'Pulseras' | 'Aretes' | 'Relojes';
  price: number; // Precio en números (ejemplo: 120 equivale a $120.00)
  description: string;
  imageUrl: string;
  metal: string; // Ejemplo: 'Oro 18k', 'Plata 925'
  inStock: boolean;
  stock: number; // Número de piezas disponibles en inventario
  badge?: string; // Etiqueta opcional como 'Más Vendido' o 'Nuevo'
}

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Anillo Solitario Diamante Royale',
    category: 'Anillos',
    price: 450.00,
    description: 'Anillo solitario en oro blanco de 18k con gema brillante de corte princesa.',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    metal: 'Oro Blanco 18k',
    inStock: true,
    stock: 4,
    badge: 'Más Vendido',
  },
  {
    id: 2,
    name: 'Collar Colgante Esmeralda Sublime',
    category: 'Collares',
    price: 289.00,
    description: 'Cadena fina de oro de 18k con dije engastado de esmeralda colombiana cultivada.',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    metal: 'Oro Amarillo 18k',
    inStock: true,
    stock: 2,
    badge: 'Exclusivo',
  },
  {
    id: 3,
    name: 'Pulsera Eslabón Veneciano',
    category: 'Pulseras',
    price: 145.00,
    description: 'Pulsera clásica con eslabones entrelazados en plata de ley 925 pulida a mano.',
    imageUrl: '/src/assets/images/pulsera_veneciana_1791600529630.jpg',
    metal: 'Plata Ley 925',
    inStock: true,
    stock: 6,
  },
  {
    id: 4,
    name: 'Aretes Perla Australiana y Circonia',
    category: 'Aretes',
    price: 179.00,
    description: 'Pendientes elegantes con perlas cultivadas de agua dulce y detalles de circonias.',
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
    metal: 'Oro Rosa 14k',
    inStock: true,
    stock: 5,
    badge: 'Nuevo',
  },
  {
    id: 5,
    name: 'Anillo Eternidad en Oro Rosa',
    category: 'Anillos',
    price: 219.00,
    description: 'Banda continua con microengaste de piedras brillantes en acabado oro rosa.',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80',
    metal: 'Oro Rosa 18k',
    inStock: true,
    stock: 3,
  },
  {
    id: 6,
    name: 'Gargantilla Minimalista Estrella Polar',
    category: 'Collares',
    price: 195.00,
    description: 'Diseño sutil para lucir todos los días, elaborado en plata 925 con baño de rodio.',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    metal: 'Plata Ley 925',
    inStock: true,
    stock: 8,
  },
  {
    id: 7,
    name: 'Gargantilla Minimalista Estrella Mayor',
    category: 'Collares',
    price: 210.00,
    description: 'Dije estelar de ocho puntas con gema central brillante sobre fina cadena de plata 925.',
    imageUrl: '/src/assets/images/gargantilla_estrella_1791600684459.jpg',
    metal: 'Plata Ley 925',
    inStock: true,
    stock: 3,
    badge: 'Edición Especial',
  },
  {
    id: 8,
    name: 'Reloj Rolex Oro Rosa Con Diamantes',
    category: 'Relojes',
    price: 400.00,
    description: 'Reloj Fino de Oro Rosa con acabados con Diamantes.',
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.Bw0DuJ4i0LjdzAilbTka5AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    metal: 'Oro Rosa con Diamantes',
    inStock: true,
    stock: 4,
    badge: 'Edicion Especial',
  },
  {
    id: 9,
    name: 'Collar con Dije de Corazon de Diamante',
    category: 'Collares',
    price: 700.00,
    description: 'Collar con Dije de Corazon Hecho de Diamante Rojo.',
    imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.UfrsOZ16kPimpPAs6jD-RQHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3',
    metal: 'Oro de 18K con Diamante En Forma De Corazon Color Rojo',
    inStock: true,
    stock: 1,
    badge: 'Unica Edicion',
  },
  {
    id: 10,
    name:'Brazalete Oro Rosa con Incrustacion de Diamantes',
    category:'Brazalete',
    price:250.00,
    description:'Brazalete de Oro Rosa con Incrustacion de  para Dama Diamantes en Forma de trebol',
    imageUrl:'https://www.elpalaciodehierro.com/on/demandware.static/-/Sites-palacio-master-catalog/default/dw0113c1b5/images/43377009/ROSA%20CON%20OTRO%20COLOR/large/43377010_x1.jpg',
    metal:'Oro de 18K con Diamantes',
    inStock:true,
    stock: 6,
    badge:'Edicion Especial',
  },
  {
    id:11,
    name:'Reloj Rolex de 18K con Diamantes y Rubies',
    category: 'Reloj',
    price: 80.00,
    description:'Reloj Rolex de Oro con Acabados finos con DImanantes y Rubies',
    imageUrl:'https://www.frostnyc.com/cdn/shop/products/redfulldiamondarabic_1_1024x1024.jpg?v=1742232873',
    metal:'Oro de 18K con Incrustaciones de Diamantes y rubi9es',
    inStock:true,
    stock: 6,
    badge: 'Priemera Edicion',
  }
];
