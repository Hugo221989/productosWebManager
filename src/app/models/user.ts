export class CustomerBasic {
    id: number;
    nombre: string;
    apellido: string;
    usuario: string;
    email: string;
    links: Links[];
}

export class Customer {
    id: number;
    nombre: string;
    apellido: string;
    usuario: string;
    nacimiento: Date;
    email: string;
    telefono: string;
    genero: Genero;
    direccion: UsuarioDireccion;
    links: Links[];
}

export class User {
    id: number;
    nombre: string;
    apellido: string;
    usuario: string;
    nacimiento: Date;
    email: string;
    telefono: string;
    admin: boolean;
    direccion: UsuarioDireccion;
    genero: Genero;
}

export class Links {
    rel: string;
    href: string;
}

export class Genero {
    id: number;
    nombre: string;
}

export class UsuarioDireccion{
    id?: number;
    destinatario: string;
    calle: string;
    piso: string;
    codigoPostal: string;
    localidad: string;
    telefono?: string;
    datosAdicionales: string;
}

export class AuthUser {
    accessToken: string;
    email: string;
    id: number;
    rememberLogin: boolean;
    username: string;
}

export class Language {
    key: string;
    value: string;
  }