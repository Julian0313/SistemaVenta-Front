import { Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DetalleVenta } from 'src/app/Interface/detalle-venta';
import { Venta } from 'src/app/Interface/venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.css']
})
export class ModalDetalleVentaComponent implements OnInit{
  fechaRegistro: string ="";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string ="";
  detalleVenta: DetalleVenta[]=[];
  columnasTabla:string[]=['producto','cantidad','precio','total']

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta){
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.total;
    this.detalleVenta = _venta.detalleVenta;
  }

  ngOnInit(): void {
    
  }
}
