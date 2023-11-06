import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';
import { CategoryService } from 'src/app/services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Valoracion } from 'src/app/models/valoracion';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit{

  productList = new Array<Product>()
  productListU = new Array<Product>()
  categoryList = new Array<Category>();
  productForm: FormGroup = new FormGroup({});
  productForm1: FormGroup = new FormGroup({});
  productUpdate: FormGroup = new FormGroup({});
  Valoracion = Valoracion;
  submitted = false;
  submittedU = false;
  product = new Product();
  
  constructor(private productService: ProductService, private categoryService: CategoryService){}

  ngOnInit(): void{
    this.getAll()
    this.getAllCategories();
    this.productUpdate = new FormGroup({
      id: new FormControl(this.product.id, Validators.required),
      nombre: new FormControl(this.product.nombre,Validators.required),
      cantidad: new FormControl(this.product.cantidad,Validators.required),
      precio: new FormControl(this.product.precio,Validators.required),
      disponible: new FormControl(this.product.disponible,Validators.required),
      valoracion: new FormControl(this.product.valoracion,Validators.required),
      categoria: new FormControl(this.product.categories,Validators.required)
    })
    this.productForm1 = new FormGroup({
      valoracion1: new FormControl('')
    })
    this.productForm = new FormGroup({
      nombre: new FormControl(this.product.nombre,Validators.required),
      cantidad: new FormControl(this.product.cantidad,Validators.required),
      precio: new FormControl(this.product.precio,Validators.required),
      disponible: new FormControl(this.product.disponible,Validators.required),
      valoracion: new FormControl(this.product.valoracion,Validators.required),
      categoria: new FormControl(this.product.categories,Validators.required)
    });
  }

  get nombre(){return this.productForm.get('nombre')}
  get cantidad(){return this.productForm.get('cantidad')}
  get precio(){return this.productForm.get('precio')}
  get disponible(){return this.productForm.get('disponible')}
  get valoracion(){return this.productForm.get('valoracion')}
  get categoria(){return this.productForm.get('categoria')}

  //para update
  get id(){return this.productUpdate.get('id')}
  get nombreU(){return this.productUpdate.get('nombre')}
  get cantidadU(){return this.productUpdate.get('cantidad')}
  get precioU(){return this.productUpdate.get('precio')}
  get disponibleU(){return this.productUpdate.get('disponible')}
  get valoracionU(){return this.productUpdate.get('valoracion')}
  get categoriaU(){return this.productUpdate.get('categoria')}U

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
      this.productListU = response
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
