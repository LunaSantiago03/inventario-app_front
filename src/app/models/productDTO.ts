import { Valoracion } from "./valoracion";

export class ProductDTO{
    id: number;
  nombre: string;
  cantidad: number;
  precio: number;
  disponible: boolean
  valoracion: Valoracion;
}