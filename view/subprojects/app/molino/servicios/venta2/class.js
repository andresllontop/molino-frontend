class Venta {
  constructor(idventa, fecha_emision, fecha_vencimiento, documento, numero_documento, descripcion, cliente, subtotal, total, estado) {
    this.idventa = idventa;
    this.fecha_emision = fecha_emision;
    this.fecha_vencimiento = fecha_vencimiento;
    this.documento = documento;
    this.numero_documento = numero_documento;
    this.descripcion = descripcion;
    this.cliente = cliente;
    this.subtotal = subtotal;
    this.total = total;
    this.estado = estado;
    this.tipo_venta = 4;
    this.usuario = { idusuario: user_session.idusuario };

  }
}

class Detalle_Venta {
  constructor(
    iddetalle_venta,
    presentacion,
    cantidad = 0,
    existencia = 0,
    precio,
    porcentaje_igv,
    tipo_igv,
    descuento

  ) {
    this.iddetalle_venta = iddetalle_venta;
    this.cantidad = cantidad;
    this.existencia = existencia;
    this.venta = new Venta();
    this.presentacion = presentacion;
    this.precio = precio;
    this.porcentaje_igv = porcentaje_igv;
    this.tipo_igv = tipo_igv;
    this.descuento = descuento;
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
    this.tipo_pago = 1;
    this.metodo_pago = metodo_pago;
    this.monto = monto;
    this.estado = estado;
    this.referencia = referencia;
    this.venta = new Venta();
  }


}

var listDetalleVenta = [];
var listPagoVenta = [];

