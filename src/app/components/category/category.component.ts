import { APP_BOOTSTRAP_LISTENER, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { ProductDTO } from 'src/app/models/productDTO';
import { CategoryService } from 'src/app/services/category.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';



@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})

export class CategoryComponent implements OnInit{
  categoryList = new Array<Category>()
  categoryProducts = new Array<ProductDTO>;
  category = new Category()
  categoryID: number;
  categoriaForm : FormGroup = new FormGroup({})
  categoriaUpdate: FormGroup = new FormGroup({})

  submitted = false;
  submittedU = false;
  

  constructor(private categoryService: CategoryService ){}

  ngOnInit():void{
    this.getAll()
    this.categoriaUpdate = new FormGroup({
      id: new FormControl(this.category.id, Validators.required),
      nombre: new FormControl(this.category.nombre, Validators.required),
      descripcion: new FormControl(this.category.descripcion,Validators.required),
      disponible: new FormControl(this.category.disponible, Validators.required),

    }),

    this.categoriaForm = new FormGroup({
      nombre: new FormControl(this.category.nombre, Validators.required),
      descripcion: new FormControl(this.category.descripcion,Validators.required),
      disponible: new FormControl(this.category.disponible, Validators.required),

    })
  }

  get nombre(){ return this.categoriaForm.get('nombre')}
  get descripcion(){ return this.categoriaForm.get('descripcion')}
  get disponible(){ return this.categoriaForm.get('disponible')}

  get id(){ return this.categoriaUpdate.get('id')}
  get nombreU(){ return this.categoriaUpdate.get('nombre') }
  get descripcionU(){ return this.categoriaUpdate.get('descripcion')}
  get disponibleU(){ return this.categoriaUpdate.get('disponible')}
  
  


  checkFormC(){
    this.submitted = true;
    if(this.categoriaForm.valid){
      this.save();
    }else{
      alert("Por favor, complete todos los campos requeridos para crear");
    }
  }

  checkFormU(){
    this.submittedU = true;
    if(this.categoriaUpdate.valid ){
      this.updateCategory();
    }else{
      alert("Por favor, complete todos los campos requeridos para actualizar");
    }
  }
  

  getAll(){
    this.categoryService.getAll().subscribe(
      response=>{
        this.categoryList = response
        console.log(this.categoryList)
      },
      error=>{
        console.log(error)
      }
    )
  }
  getProductsByCategory(id: number) {
    if (this.categoryID) { // Verificar que categoryId tenga un valor válido
      this.categoryService.getCategoriesProducts(this.categoryID).subscribe(
        response => {
          this.categoryProducts = response;
          console.log(this.categoryProducts);
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  createU(){
    let ca = new Category();
    if(this.categoriaUpdate){
      const a = this.categoriaUpdate.get('disponible')?.value
      const ab = a ==='1'
      ca.id = this.categoriaUpdate.get('id')?.value
      ca.nombre = this.categoriaUpdate.get('nombre')?.value
      ca.descripcion = this.categoriaUpdate.get('descripcion')?.value
      ca.disponible = ab
      
    }
    return ca
  }

  create(){
    let ca = new Category();
    if(this.categoriaForm){
      const a = this.categoriaForm.get('disponible')?.value
      const ab = a ==='1'
      ca.nombre = this.categoriaForm.get('nombre')?.value
      ca.descripcion = this.categoriaForm.get('descripcion')?.value
      ca.disponible = ab
      
    }
    return ca
  }

  save(){
    const ca = this.create()
    if(ca){
      this.categoryService.save(ca).subscribe(response =>{
        this.getAll();
        this.categoriaForm.reset()
        alert("Creacion exitosa")
      },error=>{
        console.log(error)
      }
        )
    }
  }

  delete(id:number){
    this.categoryService.delete(id).subscribe (() =>{
      alert("Categoria borrada con exito!")
      this.getAll();
    }, error=>{
      console.log(error)
    } )
  }

  updateCategory(){
    const c = this.createU()
    if(c){
      this.categoryService.update(c).subscribe(response=>{
        this.getAll();
        alert("Se modifico la categoria")
        this.categoriaUpdate.reset()
      },error=>{
        console.log(error)
      })
    }
  }

  ha(){
    
    alert("hora")
  }
  

}
