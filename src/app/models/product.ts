import { Category } from "./category";
import { Valoracion } from "./valoracion";
export class Product{
  id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  disponible: boolean;
  valoracion: Valoracion;
  categories: Category[];
}