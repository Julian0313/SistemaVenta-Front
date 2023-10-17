import { Component, OnInit } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleVenta } from 'src/app/Interface/detalle-venta';
import { Producto } from 'src/app/Interface/producto';
import { Venta } from 'src/app/Interface/venta';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ProductoService } from 'src/app/Services/producto.service';
import { VentaService } from 'src/app/Services/venta.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.css']
})
export class VentaComponent implements OnInit {

  listaProductos: Producto[] = []
  listaProductosFiltro: Producto[] = []
  listaProductosVenta: DetalleVenta[] = []
  bloquearBotonRegistrar: boolean = false;
  productoSeleccionado!: Producto;
  tipodePagoporDefecto: string = "Efectivo";
  totalPagar: number = 0;
  formularioProductoVenta!: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

  retornarProductosPorFiltro(busqueda: any): Producto[] {
    const valorBuscado = typeof busqueda === "string" ? busqueda.toLocaleLowerCase() : busqueda.nombre.toLocaleLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLocaleLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private _utilidadServicio: UtilidadService
  ) {
    this.formularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
    this._productoServicio.lista().subscribe({
      next:(data)=>{
        if(data.status) {
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(p => p.esActivo == 1 && p.stock > 0);
        }         
      },
      error:(e)=>{}
    })

    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value=>{
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    })
  }

  ngOnInit(): void {

  }

  mostrarProducto(producto: Producto):string{
    return producto.nombre;
  }

  productoParaVenta(event: any){
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(){
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;

    this.listaProductosVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precio: String(_precio.toFixed(2)),
      total: String(_total.toFixed(2)),
    })

    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    })
  }

  eliminarProducto(detalle: DetalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.total),
    this.listaProductosVenta = this.listaProductosVenta.filter(p=>p.idProducto != detalle.idProducto);
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);
  }

  registrarVenta(){
    if(this.listaProductosVenta.length > 0)
    {
      this.bloquearBotonRegistrar = true;

      const request: Venta = {
        tipoPago: this.tipodePagoporDefecto,
        total: String(this.totalPagar.toFixed(2)),
        detalleVenta: this.listaProductosVenta
      }
      this._ventaServicio.registrar(request).subscribe({
        next:(response)=>{
          if(response.status){
            this.totalPagar = 0.00;
            this.listaProductosVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosVenta);

            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada!',
              text: `Numero de venta ${response.value.numeroDocumento}`
            })
          }else
            this._utilidadServicio.mostrarAlerta("No se pudo registrar la venta","Oops");
        },
        complete:()=>{
          this.bloquearBotonRegistrar = false;
        },
        error:(e) =>{}
      })
    }
  }
}
