import { Product } from "./product";

export class Category{
    id: number;
    nombre: string;
    descripcion: string;
    disponible: boolean;
    products: Product[];
}