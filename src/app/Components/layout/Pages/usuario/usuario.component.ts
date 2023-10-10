import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2'
import { Usuario } from 'src/app/Interface/usuario';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit, AfterViewInit {

  columnasTable: string[]=['nombreCompleto','correo','rolDescripcion','estado','acciones'];
  dataInicio: Usuario[]=[];
  dataListaUsuarios = new MatTableDataSource(this.dataInicio);
  @ViewChild(MatPaginator) paginacionTabla!: MatPaginator;

  constructor(
    private _dialog: MatDialog,
    private _usuarioServicio: UsuarioService,
    private _utilidadServicio: UtilidadService
  ){}

  obtenerUsuarios(){
    this._usuarioServicio.lista().subscribe({
      next:(data)=>{
        if(data.status)
        this.dataListaUsuarios.data = data.value;
        else
        this._utilidadServicio.mostrarAlerta("No se encontraron datos","Oops")
      },
      error:(e)=>{}
    })
  }
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuarios.paginator = this.paginacionTabla;
  }

  aplicarFiltroTabla(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuarios.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoUsuario(){
    this._dialog.open(ModalUsuarioComponent,{
      disableClose:true
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "true") this.obtenerUsuarios();
    })
  }

  editarUsuario(usuario: Usuario){
    this._dialog.open(ModalUsuarioComponent,{
      disableClose:true,
      data: usuario
    }).afterClosed().subscribe(resultado=>{
      if(resultado === "true") this.obtenerUsuarios();
    })
  }
  
  eliminarUsuario(usuario: Usuario){
  Swal.fire({
    title: "¿Desea eliminar el usuario?",
    text: usuario.nombreCompleto,
    icon: "warning",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Si, eliminar",
    showCancelButton: true,
    cancelButtonColor: "#d333",
    cancelButtonText: "No, volver"
  }).then((resultado)=>{
    if(resultado.isConfirmed){
      this._usuarioServicio.eliminar(usuario.idUsuario).subscribe({ next:(data)=>{
          if(data.status){
            this._utilidadServicio.mostrarAlerta("El usuario fue eliminado","Listo");
            this.obtenerUsuarios();
          }else{
            this._utilidadServicio.mostrarAlerta("No se pudo elimimar el usuario","Error");
          }
        },
        error:(e)=>{}
      })
    }
  })
  }
}
