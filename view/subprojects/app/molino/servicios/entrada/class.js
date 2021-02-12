class Entrada {
    constructor(identrada, fecha = null, documento, numero_documento,
        detalle, cliente, total, total_otro, estado = 4, monto = 0) {
        this.identrada = identrada;
        this.fecha = fecha;
        this.documento = documento;
        this.numero_documento = numero_documento;
        this.detalle = detalle;
        this.cliente = cliente;
        this.total = total;
        this.total_otro = total_otro;
        this.tipo_entrada = 1;
        this.estado = estado;
        this.monto = monto;
        this.usuario = { idusuario: user_session.idusuario };
        // this.personal = 1;
    }
}

class Detalle_Entrada {
    constructor(
        iddetalle_entrada,
        presentacion,
        factor_conversion,
        cantidad = 0,
        cantidad_otro = 0,
        existencia = 0,
        existencia_otro = 0,
        precio_servicio,
        precio = 0

    ) {
        this.iddetalle_entrada = iddetalle_entrada;
        this.factor_conversion = factor_conversion;
        this.cantidad = cantidad;
        this.cantidad_otro = cantidad_otro;
        this.existencia = existencia;
        this.existencia_otro = existencia_otro;
        this.entrada = new Entrada();
        this.presentacion = presentacion;
        this.precio_servicio = precio_servicio;
        this.precio = precio;

    }
}

class PresentacionEntrada {
    constructor(
        idpresentacion,
        existencia,
        existencia_otro,
        ubicacionproducto = undefined,
        existencia_inicial = 0,
        existencia_inicial_otro = 0


    ) {
        this.idpresentacion = idpresentacion;
        this.existencia = existencia;
        this.existencia_inicial = existencia_inicial;
        this.existencia_otro = existencia_otro;
        this.existencia_inicial_otro = existencia_inicial_otro;
        this.ubicacion_producto = ubicacionproducto;
    }
}

var listDetalleEntrada = [];

