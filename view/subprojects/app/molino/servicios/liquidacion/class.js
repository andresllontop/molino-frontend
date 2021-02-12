class Venta {
    constructor(idventa, fecha_emision, fecha_vencimiento,
        documento, numero_documento, descripcion,
        cliente, subtotal, total, total_igv, flete, cargo, estado = 1) {
        this.idventa = idventa;
        this.fecha_emision = fecha_emision;
        this.fecha_vencimiento = fecha_vencimiento;
        this.documento = documento;
        this.numero_documento = numero_documento;
        this.descripcion = descripcion;
        this.cliente = cliente;
        this.subtotal = subtotal;
        this.total = total;
        this.total_igv = total_igv;
        this.flete = flete;
        this.cargo = cargo;
        this.estado = estado;
        //liquidacion
        this.tipo_venta = 6;
        this.usuario = { idusuario: user_session.idusuario };

    }
}

class Detalle_Venta {
    constructor(
        iddetalle_venta,
        presentacion,
        cantidad,
        cantidad_actual,
        cantidad_otro,
        existencia,
        existencia_actual,
        existencia_otro,
        precio,
        porcentaje_igv,
        tipo_igv,
        descuento = 0,
        factor = 0

    ) {
        this.iddetalle_venta = iddetalle_venta;
        this.cantidad = (cantidad == "") ? 0 : cantidad;
        this.cantidad_actual = (cantidad_actual == "") ? 0 : cantidad_actual;
        this.cantidad_otro = (cantidad_otro == "") ? 0 : cantidad_otro;
        this.existencia = (existencia == "") ? 0 : existencia;
        this.existencia_actual = (existencia_actual == "") ? 0 : existencia_actual;
        this.existencia_otro = (existencia_otro == "") ? 0 : existencia_otro;
        this.venta = new Venta();
        this.presentacion = presentacion;
        this.precio = (precio == "") ? 0 : precio;
        this.porcentaje_igv = (porcentaje_igv == "") ? 0 : porcentaje_igv;
        this.tipo_igv = tipo_igv;
        this.descuento = (descuento == "") ? 0 : descuento;
        this.factor = factor;
    }
}

class PresentacionCompra {
    constructor(
        idpresentacion,
        existencia_inicial,
        existencia,
        producto = null
    ) {
        this.idpresentacion = idpresentacion;
        this.existencia = existencia;
        this.existencia_inicial = existencia_inicial;
        this.existencia_otro = existencia_otro;
        this.existencia_inicial_otro = existencia_inicial_otro;
        this.producto = producto;
    }
}
class PagoVenta {
    constructor(
        metodo_pago,
        monto,
        estado,
        referencia
    ) {
        //LIQUIDACION
        this.tipo_pago = 2;
        this.metodo_pago = metodo_pago;
        this.monto = monto;
        this.estado = estado;
        this.referencia = referencia;
        this.venta = new Venta();
    }


}

var listDetalleVenta = [];
var listPagoVenta = [];

