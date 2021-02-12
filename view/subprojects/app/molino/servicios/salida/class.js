class Salida {
    constructor(idsalida, fecha = null, documento, numero_documento,
        detalle, cliente, total, total_otro, estado = 1, monto = 0) {
        this.idsalida = idsalida;
        this.fecha = fecha;
        this.documento = documento;
        this.numero_documento = numero_documento;
        this.detalle = detalle;
        this.cliente = cliente;
        this.total = total;
        this.total_otro = total_otro;
        this.tipo_salida = 2;
        this.estado = estado;
        this.monto = monto;
        this.usuario = { idusuario: user_session.idusuario };
        // this.personal = 1;
    }
}

class Detalle_Salida {
    constructor(
        iddetalle_salida,
        presentacion,
        factor_conversion,
        cantidad = 0,
        cantidad_otro = 0,
        existencia = 0,
        existencia_otro = 0,
        precio_servicio,
        precio

    ) {
        this.iddetalle_salida = iddetalle_salida;
        this.factor_conversion = factor_conversion;
        this.cantidad = cantidad;
        this.cantidad_otro = cantidad_otro;
        this.existencia = existencia;
        this.existencia_otro = existencia_otro;
        this.salida = new Salida();
        this.presentacion = presentacion;
        this.precio_servicio = precio_servicio;
        this.precio = precio;

    }
}

class PresentacionSalida {
    constructor(
        idpresentacion,
        existencia,
        existencia_otro
    ) {
        this.idpresentacion = idpresentacion;
        this.existencia = existencia;
        this.existencia_inicial = existencia_inicial;
        this.existencia_otro = existencia_otro;
        this.existencia_inicial_otro = existencia_inicial_otro;
    }
}

var listDetalleSalida = [];

