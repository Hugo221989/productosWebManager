import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

export default class Utils {
    public productForm: FormGroup;

    //constructor(private fb: FormBuilder){}

    static initProductForm(fb: FormBuilder) { 
        let productForm: FormGroup = fb.group({
            'nombre': new FormControl(''),
            'nombreEng': new FormControl(''),
            'precio': new FormControl('', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]),
            'tamano': new FormControl(new Date()),
            'saborSeleccionado': new FormControl('', Validators.required),
            'cantidad': new FormControl(''),
            'puntuacion': new FormControl(''),
            'disponible': new FormControl(''),
            //'foto': new FormControl(''),
            'precioFinal': new FormControl(''),
            'descuento': new FormControl(''),
            'categoriaPadre': new FormControl('', Validators.required),
            'categoria': new FormControl('', Validators.required),
            'subCategoria': new FormControl('', Validators.required),
          });
        return productForm; 
    }
    static doSomethingElse(val: string) { return val; }
}