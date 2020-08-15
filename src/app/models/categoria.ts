import { Producto } from './producto';
import { Links } from './user';

export class CategoriaPadre {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
    modulo: string;
    categoria: Categoria[];
}

export class Categoria {
    id: number;
    nombre: string;
    nombreEng: string;
    subCategoria: SubCategoria[];
    productos: Producto[];
    key: string;
}

export class SubCategoria {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
}

export class CategoriaPadreDto {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
    modulo: string;
    categorias: CategoriaDto[];
    links: Links[];
}

export class CategoriaDto {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
    subcategorias: SubCategoriaDto[];
    links: Links[];
}
export class SubCategoriaDto {
    id: number;
    nombre: string;
    nombreEng: string;
    key: string;
    links: Links[];
}
