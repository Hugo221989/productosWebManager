import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Product, Producto } from 'src/app/models/producto';
import { ValorNutricional, InfoBasica, Descripcion, InfoVitaminas, Sabor } from 'src/app/models/productoOtrosDatos';

export default class Utils {
    public productForm: FormGroup;

    static initProductForm(fb: FormBuilder) { 
        let productForm: FormGroup = fb.group({
            'nombre': new FormControl(''),
            'nombreEng': new FormControl(''),
            'precio': new FormControl('', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]),
            'tamano': new FormControl(''),
            'saborSeleccionado': new FormControl(''),
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

    static initValorNutricionalForm(fb: FormBuilder){
        let valorNutricionalForm:FormGroup = fb.group({
          'dosis': new FormControl(''),
          'dosisEnvase': new FormControl(''),
          'dosisDiaria': new FormControl(''),
          'ingredientes': new FormControl(''),
          'ingredientesEng': new FormControl(''),
          'otrosIngredientes': new FormControl(''),
          'otrosIngredientesEng': new FormControl(''),
          'conservacion': new FormControl(''),
          'conservacionEng': new FormControl(''),
          'alergias': new FormControl(''),
          'alergiasEng': new FormControl(''),
          'modoEmpleo': new FormControl(''),
          'modoEmpleoEng': new FormControl(''),
          'advertencias': new FormControl(''),
          'advertenciasEng': new FormControl('')
        })
        return valorNutricionalForm; 
      }
    
      static initInfoBasicaForm(fb: FormBuilder){
        let infoBasicaForm:FormGroup = fb.group({
          'valorEnergetico': new FormControl(''),
          'proteinas': new FormControl(''),
          'hidratos': new FormControl(''),
          'azucares': new FormControl(''),
          'grasas': new FormControl(''),
          'saturadas': new FormControl(''),
          'sodio': new FormControl('')
        })
        return infoBasicaForm; 
      }
    
      static initDescripcionForm(fb: FormBuilder){
        let descripcionForm:FormGroup = fb.group({
          'titulo': new FormControl(''),
          'tituloEng': new FormControl(''),
          'subtitulo': new FormControl(''),
          'subtituloEng': new FormControl(''),
          'apartado': new FormControl(''),
          'apartadoEng': new FormControl(''),
          'caracteristicas': new FormControl(''),
          'caracteristicasEng': new FormControl(''),
          'beneficios': new FormControl(''),
          'beneficiosEng': new FormControl('')
        })
        return descripcionForm; 
      }
    
      static initInfoVitaminasForm(fb: FormBuilder){
        //let infoVitaminasForm = new FormArray([]);
        let infoVitaminasForm:FormGroup = fb.group({
          vitas: fb.array([
            /* fb.group({
                nombre: new FormControl('', Validators.required),
                valor: new FormControl('', Validators.required)
            }) */
          ])
        })
        return infoVitaminasForm; 
      }

      static fillProductFormData(productForm: FormGroup, product: Product){
        let producto = product.producto;

          productForm.controls['nombre'].setValue(producto.nombre);
          productForm.controls['nombreEng'].setValue(producto.nombreEng);
          productForm.controls['precio'].setValue(producto.precio);
          productForm.controls['tamano'].setValue(producto.tamano);
          productForm.controls['saborSeleccionado'].setValue(producto.saborSeleccionado);
          productForm.controls['cantidad'].setValue(producto.cantidad);
          productForm.controls['puntuacion'].setValue(producto.puntuacion);
          productForm.controls['disponible'].setValue(producto.disponible);
          productForm.controls['precioFinal'].setValue(producto.precioFinal);
          productForm.controls['descuento'].setValue(producto.descuento);
          productForm.controls['categoriaPadre'].setValue(product.categoriaPadre);
          productForm.controls['categoria'].setValue(product.categoria);
          productForm.controls['subCategoria'].setValue(product.subCategoria);

          return productForm;
      }
    
      static fillValorNutricionalForm(valorNutricionalForm:FormGroup, valorNutricional: ValorNutricional){

          valorNutricionalForm.controls['dosis'].setValue(valorNutricional.dosis);
          valorNutricionalForm.controls['dosisEnvase'].setValue(valorNutricional.dosisEnvase);
          valorNutricionalForm.controls['dosisDiaria'].setValue(valorNutricional.dosisDiaria);
          valorNutricionalForm.controls['ingredientes'].setValue(valorNutricional.ingredientes);
          valorNutricionalForm.controls['ingredientesEng'].setValue(valorNutricional.ingredientesEng);
          valorNutricionalForm.controls['otrosIngredientes'].setValue(valorNutricional.otrosIngredientes);
          valorNutricionalForm.controls['otrosIngredientesEng'].setValue(valorNutricional.otrosIngredientesEng);
          valorNutricionalForm.controls['conservacion'].setValue(valorNutricional.conservacion);
          valorNutricionalForm.controls['conservacionEng'].setValue(valorNutricional.conservacionEng);
          valorNutricionalForm.controls['alergias'].setValue(valorNutricional.alergias);
          valorNutricionalForm.controls['alergiasEng'].setValue(valorNutricional.alergiasEng);
          valorNutricionalForm.controls['advertencias'].setValue(valorNutricional.advertencias);
          valorNutricionalForm.controls['advertenciasEng'].setValue(valorNutricional.advertenciasEng);
          valorNutricionalForm.controls['modoEmpleo'].setValue(valorNutricional.modoEmpleo);
          valorNutricionalForm.controls['modoEmpleoEng'].setValue(valorNutricional.modoEmpleoEng);

          return valorNutricionalForm;
      }
    
      static fillInfoBasicaForm(infoBasicaForm:FormGroup ,infoBasica: InfoBasica){

          infoBasicaForm.controls['valorEnergetico'].setValue(infoBasica.valorEnergetico);
          infoBasicaForm.controls['proteinas'].setValue(infoBasica.proteinas);
          infoBasicaForm.controls['hidratos'].setValue(infoBasica.hidratos);
          infoBasicaForm.controls['azucares'].setValue(infoBasica.azucares);
          infoBasicaForm.controls['grasas'].setValue(infoBasica.grasas);
          infoBasicaForm.controls['saturadas'].setValue(infoBasica.saturadas);
          infoBasicaForm.controls['sodio'].setValue(infoBasica.sodio);

          return infoBasicaForm;
      }
    
      static fillDescripcionForm(descripcionForm:FormGroup, descripcion: Descripcion){

          descripcionForm.controls['titulo'].setValue(descripcion.titulo);
          descripcionForm.controls['tituloEng'].setValue(descripcion.tituloEng);
          descripcionForm.controls['subtitulo'].setValue(descripcion.subtitulo);
          descripcionForm.controls['subtituloEng'].setValue(descripcion.subtituloEng);
          descripcionForm.controls['apartado'].setValue(descripcion.apartado);
          descripcionForm.controls['apartadoEng'].setValue(descripcion.apartadoEng);
          descripcionForm.controls['caracteristicas'].setValue(descripcion.caracteristicas);
          descripcionForm.controls['caracteristicasEng'].setValue(descripcion.caracteristicasEng);
          descripcionForm.controls['beneficios'].setValue(descripcion.beneficios);
          descripcionForm.controls['beneficiosEng'].setValue(descripcion.beneficiosEng);
        
          return descripcionForm;
      }

      static updateProductMainData(product: Product, productForm:FormGroup){
        let producto: Producto = product.producto;
        producto.nombre = productForm.value.nombre;
        producto.nombreEng = productForm.value.nombreEng;
        producto.precio = productForm.value.precio;
        producto.tamano = productForm.value.tamano;
        producto.puntuacion = productForm.value.puntuacion;
        producto.disponible = productForm.value.disponible;
        producto.precioFinal = productForm.value.precioFinal;
        producto.descuento = productForm.value.descuento;
        product.categoriaPadre = productForm.value.categoriaPadre;
        product.categoria = productForm.value.categoria;
        product.subCategoria = productForm.value.subCategoria;
        product.producto = producto;
        return product;
      }

      static updateProductoInfoBasica(producto:Producto, infoBasicaForm:FormGroup){
        let infoBasica: InfoBasica = producto.valorNutricional.infoBasica;
        infoBasica.valorEnergetico = infoBasicaForm.value.valorEnergetico;
        infoBasica.proteinas = infoBasicaForm.value.proteinas;
        infoBasica.hidratos = infoBasicaForm.value.hidratos;
        infoBasica.azucares = infoBasicaForm.value.azucares;
        infoBasica.grasas = infoBasicaForm.value.grasas;
        infoBasica.saturadas = infoBasicaForm.value.saturadas;
        infoBasica.sodio = infoBasicaForm.value.sodio;
        producto.valorNutricional.infoBasica = infoBasica;
        return producto;
      }

      static updateProductoInfoVitaminas(producto:Producto, infoVitaminasForm:FormGroup){
          let infoVitaminasArray: InfoVitaminas[] = [];
          let vitaminasFields = this.getInfoVitaminasFormArray(infoVitaminasForm).controls;
          for(let vitaminasField of vitaminasFields){
            let infoVitaminas: InfoVitaminas = {
                nombre: vitaminasField.get('nombre').value,
                valor: vitaminasField.get('valor').value
            }
            infoVitaminasArray.push(infoVitaminas);
          }
          producto.valorNutricional.infoVitaminas = infoVitaminasArray;
          return producto;
      }
      static getInfoVitaminasFormArray(infoVitaminasForm:FormGroup): FormArray {
        return infoVitaminasForm.get('vitas') as FormArray;
      }

      static updateProductoDescripcion(producto:Producto, descripcionForm:FormGroup){
        let descripcion: Descripcion = producto.descripcion;
        descripcion.titulo = descripcionForm.value.titulo;
        descripcion.tituloEng = descripcionForm.value.tituloEng;
        descripcion.subtitulo = descripcionForm.value.subtitulo;
        descripcion.subtituloEng = descripcionForm.value.subtituloEng;
        descripcion.apartado = descripcionForm.value.apartado;
        descripcion.apartadoEng = descripcionForm.value.apartadoEng;
        descripcion.caracteristicas = descripcionForm.value.caracteristicas;
        descripcion.caracteristicasEng = descripcionForm.value.caracteristicasEng;
        descripcion.beneficios = descripcionForm.value.beneficios;
        descripcion.beneficiosEng = descripcionForm.value.beneficiosEng;
        producto.descripcion = descripcion;
        return producto;
      }

      static updateProductoFlavours(producto:Producto, flavours:Sabor[]){
        producto.sabores = flavours;
        return producto;
      }

      static updateProductoNutritionalValue(producto:Producto, valorNutricionalForm:FormGroup){
        let valorNutricional: ValorNutricional = producto.valorNutricional;
        valorNutricional.dosis = valorNutricionalForm.value.dosis;
        valorNutricional.dosisEnvase = valorNutricionalForm.value.dosisEnvase;
        valorNutricional.dosisDiaria = valorNutricionalForm.value.dosisDiaria;
        valorNutricional.ingredientes = valorNutricionalForm.value.ingredientes;
        valorNutricional.ingredientesEng = valorNutricionalForm.value.ingredientesEng;
        valorNutricional.otrosIngredientes = valorNutricionalForm.value.otrosIngredientes;
        valorNutricional.otrosIngredientesEng = valorNutricionalForm.value.otrosIngredientesEng;
        valorNutricional.conservacion = valorNutricionalForm.value.conservacion;
        valorNutricional.conservacionEng = valorNutricionalForm.value.conservacionEng;
        valorNutricional.alergias = valorNutricionalForm.value.alergias;
        valorNutricional.alergiasEng = valorNutricionalForm.value.alergiasEng;
        valorNutricional.modoEmpleo = valorNutricionalForm.value.modoEmpleo;
        valorNutricional.modoEmpleoEng = valorNutricionalForm.value.modoEmpleoEng;
        valorNutricional.advertencias = valorNutricionalForm.value.advertencias;
        valorNutricional.advertenciasEng = valorNutricionalForm.value.advertenciasEng;
        producto.valorNutricional = valorNutricional;
        return producto;
      }

      static createDateFromString(dateString: string){
        const dateArray = dateString.split("/");
        const year = dateArray[2];
        const month = dateArray[1];
        const day = dateArray[0];
        return new Date(year+'-'+month+'-'+day);
      }


      static initPreProductForm(fb: FormBuilder) { 
        let preProductForm: FormGroup = fb.group({
            'nombre': new FormControl('', Validators.required),
            'mainDirectory': new FormControl('', Validators.required),
            'imagesDirectory': new FormControl('', Validators.required),
            'categoriaPadre': new FormControl('', Validators.required),
            'categoria': new FormControl('', Validators.required),
            'subCategoria': new FormControl('', Validators.required),
          });
        return preProductForm; 
    }

}