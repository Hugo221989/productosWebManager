import { Sabor, Comentario, ValorNutricional, Descripcion, Foto } from './productoOtrosDatos';
import { Categoria, SubCategoria, CategoriaPadre } from './categoria';
import { Links } from './user';

export class PageModelProductBasic {
    links: Links[];
    content: ProductBasic[];
    page: Page;
}

export class ProductBasic {
    id: number;
    nombre: string;
    foto: string;
    tamano: string;
    precio: string;
    links: Links[];
}

export class Product {
    id: number;
    producto: Producto;
    categoriaPadre: number;
    categoria: number;
    subCategoria: number;
    links: Links[];
}

export class Producto {
    id: number;
    nombre: string;
    nombreEng: string;
    precio: string;
    tamano: number;
    sabores: Sabor[];
    saborSeleccionado: Sabor;
    cantidad: number;
    puntuacion: number;
    comentarios: Comentario[];
    disponible: boolean;
    fotos: Foto[];
    descuento: number;
    valorNutricional: ValorNutricional;
    descripcion: Descripcion;
    precioFinal: string;
    carpetaFoto: string;
    categoriaPadre: CategoriaPadre;
    categoria: Categoria;
    subCategoria: SubCategoria;
}

export class CatProductoDto{
    id: number;
    categoriaPadreNombre: string;
    categoriaPadreKey: string;
    categoriaPadreModulo: string;
    categoriaPadreId: number;
    categoriaNombre: string;
    categoriaKey: string;
    subCategoriaNombre: string;
    subCategoriaKey: string;
}

export class ProductoDto {
    id: number;
    categoriaPadre: string;
    categoria: string;
    subCategoria: string;
    nombre: string;
    nombreEng: string;
    precio: number;
    tamano: number;
    puntuacion: number;
    disponible: boolean;
    descuento: number;
    precioFinal: number;
    descripcion: string;
    foto: string;
}

export class Page {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
}