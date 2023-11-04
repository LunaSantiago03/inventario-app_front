import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryComponent } from '../category/category.component';
import { CategoryService } from 'src/app/services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Valoracion } from 'src/app/models/valoracion';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  productList = new Array<Product>()
  categoryList = new Array<Category>();
  productForm: FormGroup = new FormGroup({});
  productForm1: FormGroup = new FormGroup({});
  productUpdate: FormGroup = new FormGroup({});
  update: boolean = false;
  Valoracion = Valoracion;
  submitted = false;
  submittedU = false;
  
  
  constructor(private productService: ProductService, private categoryService: CategoryService){}

  ngOnInit(): void{
    this.getAll()
    this.getAllCategories();
    this.productUpdate = new FormGroup({
      id: new FormControl('', Validators.required),
      nombre: new FormControl('',Validators.required),
      cantidad: new FormControl('',Validators.required),
      precio: new FormControl('',Validators.required),
      disponible: new FormControl('',Validators.required),
      valoracion: new FormControl('',Validators.required),
      categoria: new FormControl('',Validators.required)
    })
    this.productForm1 = new FormGroup({
      valoracion1: new FormControl('')
    })
    this.productForm = new FormGroup({
      id: new FormControl('', Validators.required),
      nombre: new FormControl('',Validators.required),
      cantidad: new FormControl('',Validators.required),
      precio: new FormControl('',Validators.required),
      disponible: new FormControl('',Validators.required),
      valoracion: new FormControl('',Validators.required),
      categoria: new FormControl('',Validators.required)
    });
  }
  checkFormCompletion() {
    this.submitted = true;
    if (this.productForm.valid) {
      this.save();
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }
  checkFormCompletionU() {
    this.submittedU = true;
    if (this.productUpdate.valid) {
      this.updateProduct();
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  getAll(){
    this.productService.getAll().subscribe(
      response=>{
      this.productList = response
      console.log(this.productList)
      }, 
    error=>{
      console.log(error)
    })
  }
  getAvaible(){
    this.productService.avaible().subscribe(
      response=>{
        this.productList = response
        console.log(this.productList)
        
      },
      error=>{
        console.log(error)
      }
    )
  }
  getValoracion(){
    if (this.productForm1.get('valoracion1')) {
      const v = this.productForm1.get('valoracion1')?.value.toString(); // Convertir el valor de enum a cadena
      this.productForm1.reset();
      this.productService.getValoracion(v).subscribe(
        response => {
          this.productList = response;
          console.log(this.productList);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
   getAllCategories() {
    this.categoryService.getAll().subscribe(
      (response: Category[]) => {
        this.categoryList = response;
        console.log('Categorías cargadas:', this.categoryList);
      },
      (error: any) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }


  createU(){
    let p = new Product();
    p.categories = [];
    if(this.productUpdate){
      const cateId = this.productUpdate.get('categoria')?.value
      const cateIdnumber = Number(cateId)
      const categoriaF = this.categoryList.find(ca => ca.id === cateIdnumber)
      const disponible = this.productUpdate.get('disponible')?.value;
      const d = disponible === '1'
      const valoracion = this.productUpdate.get('valoracion')?.value;
      
      if(categoriaF){
        p.id = this.productUpdate.get('id')?.value;
        p.nombre = this.productUpdate.get('nombre')?.value;
        p.cantidad = this.productUpdate.get('cantidad')?.value;
        p.precio = this.productUpdate.get('precio')?.value;
        p.disponible = d
        p.categories.push(categoriaF);
        p.valoracion = valoracion;
      }
    }
    return p;
  }

  create(){
    let p = new Product();
    p.categories = [];
    if(this.productForm){
      const cateId = this.productForm.get('categoria')?.value
      const cateIdnumber = Number(cateId)
      const categoriaF = this.categoryList.find(ca => ca.id === cateIdnumber)
      const disponible = this.productForm.get('disponible')?.value;
      const d = disponible === '1'
      const valoracion = this.productForm.get('valoracion')?.value;
      
      if(categoriaF){
        
        p.nombre = this.productForm.get('nombre')?.value;
        p.cantidad = this.productForm.get('cantidad')?.value;
        p.precio = this.productForm.get('precio')?.value;
        p.disponible = d
        p.categories.push(categoriaF);
        p.valoracion = valoracion;
      }
    }
    return p;
  }

  save() {
    const p = this.create();
    if (p) {
      this.productService.saveProduct(p).subscribe(response => {
        this.getAll();
        alert("Creacion exitosa!")
        this.productForm.reset()
      }, error => {
        console.log(error);
      });
    }
  }

  updateProduct(){
    const productoObservable = this.createU();
    if (productoObservable) {
        this.productService.update(productoObservable,productoObservable.id).subscribe(response => {
          this.getAll()
          alert("Modificacion Exitosa")
          this.productUpdate.reset()
        }, error => {
          console.log(error)
        });
      
    }
  }


  deleteProduct(id:number){
    this.productService.delete(id).subscribe (() =>{
      alert("Producto borrado con exito!")
      this.getAll();
    }, error=>{
      console.log(error)
    } )
  }
  get nombreNo(){
    return this.productForm.get('nombre')?.invalid && this.productForm.get('nombre')?.touched;
  }
}
