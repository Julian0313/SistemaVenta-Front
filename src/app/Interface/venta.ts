import { DetalleVenta } from "./detalle-venta"

export interface Venta {
    idVenta?: number,
    numeroDocumento?: string,
    tipoPago: string,
    total: string,
    fechaRegistro?: string,
    detalleVenta: DetalleVenta[]
}
