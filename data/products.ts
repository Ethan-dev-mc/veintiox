export type Badge = 'Nuevo' | 'Más vendido' | 'Drop limitado' | null

export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  originalPrice?: number
  image: string
  badge: Badge
  stock: number
  sizes: string[]
  colors: string[]
  reviews: number
  rating: number
  isDropItem?: boolean
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Black Phantom',
    tagline: 'La oscuridad define el estilo',
    description: 'Gorra estructurada de 6 paneles en twill negro premium. Visera plana, ajuste snapback. La preferida de la calle.',
    price: 599,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
    badge: 'Más vendido',
    stock: 120,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Negro'],
    reviews: 214,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Urban Shadow',
    tagline: 'Silencio en movimiento',
    description: 'Diseño minimalista con logo bordado tonal. Tela ripstop resistente al viento. Para los que no necesitan gritar para ser vistos.',
    price: 649,
    image: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=600&q=80',
    badge: 'Nuevo',
    stock: 85,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Gris carbón'],
    reviews: 67,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Classic White',
    tagline: 'La pureza del hype',
    description: 'El clásico reinventado. Gorra blanca hueso con bordado minimalista en negro. Combina con todo, domina todo.',
    price: 549,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80',
    badge: null,
    stock: 200,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Blanco hueso'],
    reviews: 189,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Desert Storm',
    tagline: 'Edición limitada. Sin segunda vuelta.',
    description: 'Colorway beige táctico con parche woven exclusivo. Solo 50 unidades. Una vez agotada, no regresa.',
    price: 799,
    originalPrice: 899,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80',
    badge: 'Drop limitado',
    stock: 17,
    sizes: ['S/M', 'M/L'],
    colors: ['Beige táctico'],
    reviews: 43,
    rating: 4.9,
    isDropItem: true,
  },
  {
    id: '5',
    name: 'Midnight Blue',
    tagline: 'Donde termina el día, empieza el look',
    description: 'Azul medianoche profundo con logo reflectante. Visible de noche, impecable de día.',
    price: 649,
    image: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&q=80',
    badge: 'Nuevo',
    stock: 60,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Azul medianoche'],
    reviews: 31,
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Forest Camo',
    tagline: 'Desaparece. Destaca.',
    description: 'Camo forest de 4 colores con bordado dorado. Contraste brutal. Drop exclusivo sin restock.',
    price: 729,
    image: 'https://images.unsplash.com/photo-1620326873899-1d0e7e9b96d6?w=600&q=80',
    badge: 'Drop limitado',
    stock: 28,
    sizes: ['M/L', 'L/XL'],
    colors: ['Camo forest'],
    reviews: 55,
    rating: 4.9,
    isDropItem: true,
  },
  {
    id: '7',
    name: 'Rose Ghost',
    tagline: 'Suave por fuera. Fuego por dentro.',
    description: 'Rosa polvo apagado con detalles en crema. El favorito de temporada. Stock siempre bajo.',
    price: 579,
    image: 'https://images.unsplash.com/photo-1584736286279-5d85e3f80a49?w=600&q=80',
    badge: 'Más vendido',
    stock: 45,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Rosa polvo'],
    reviews: 178,
    rating: 4.8,
  },
  {
    id: '8',
    name: 'Arctic Silver',
    tagline: 'Frío por fuera. Único por dentro.',
    description: 'Tono plata metálico apagado con parche de cuero genuino. Acabado premium que habla solo.',
    price: 699,
    image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=600&q=80',
    badge: null,
    stock: 90,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Plata ártico'],
    reviews: 102,
    rating: 4.7,
  },
  {
    id: '9',
    name: 'Obsidian Red',
    tagline: 'La intensidad que no pide permiso',
    description: 'Rojo oscuro con logo bordado en negro. Sin estridencias. Impacto al nivel de los que saben.',
    price: 659,
    image: 'https://images.unsplash.com/photo-1620546659776-9e0e5be7b24d?w=600&q=80',
    badge: 'Nuevo',
    stock: 55,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Rojo obsidiana'],
    reviews: 44,
    rating: 4.8,
  },
  {
    id: '10',
    name: 'Raw Vintage',
    tagline: 'Hecho para durar. Diseñado para brillar.',
    description: 'Lavado vintage manual, cada pieza única. Parche de cuero grabado. La gorra que envejece mejor que tú.',
    price: 619,
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80',
    badge: 'Más vendido',
    stock: 75,
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Café vintage'],
    reviews: 133,
    rating: 4.9,
  },
]

export const dropProducts = products.filter((p) => p.isDropItem)
export const bestSellers = products.filter((p) => p.badge === 'Más vendido')
export const newArrivals = products.filter((p) => p.badge === 'Nuevo')
