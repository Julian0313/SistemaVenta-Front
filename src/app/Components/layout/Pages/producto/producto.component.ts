import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2'
import { Producto } from 'src/app/Interface/producto';
import { ProductoService } from 'src/app/Services/producto.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit, AfterViewInit {
  columnasTabla: string[] = ['nombre', 'descripcionCategoria', 'stock', 'precio', 'estado','acciones'];
  dataInicio: Producto[] = [];
  dataListaProducto = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _dialog: MatDialog,
    private _productoServicio: ProductoService,
    private _utilidadServicio: UtilidadService
  ) { }

  obtenerProducto() {
    this._productoServicio.lista().subscribe({
      next: (data) => {
        if (data.status)
          this.dataListaProducto.data = data.value;
        else
          this._utilidadServicio.mostrarAlerta("No se encontraron datos", "Oops")
      },
      error: (e) => { }
    })
  }

  ngOnInit(): void {
    this.obtenerProducto();
  }

  ngAfterViewInit(): void {
    this.dataListaProducto.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProducto.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto() {
    this._dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerProducto();
    })
  }

  editarProducto(producto: Producto) {
    this._dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if (resultado === "true") this.obtenerProducto();
    })
  }

  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: "¿Desea eliminar el producto?",
      text: producto.nombre,
      icon: "warning",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Si, eliminar",
      showCancelButton: true,
      cancelButtonColor: "#d333",
      cancelButtonText: "No, volver"
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoServicio.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) {
              this._utilidadServicio.mostrarAlerta("El producto fue eliminado", "Listo");
              this.obtenerProducto();
            } else {
              this._utilidadServicio.mostrarAlerta("No se pudo elimimar el producto", "Error");
            }
          },
          error: (e) => { }
        })
      }
    })
  }
}
