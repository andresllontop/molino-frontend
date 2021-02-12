var beanPaginationInventario;
var inventarioSelected;
var beanRequestInventario = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestInventario.entity_api = 'api/inventarios';
    beanRequestInventario.operation = 'paginate';
    beanRequestInventario.type_request = 'GET';

    $('#FrmInventario').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        beanRequestInventario.operation = 'paginate';
        beanRequestInventario.type_request = 'GET';
        processAjaxInventario();

    });

    $('#sizePageInventario').change(function () {
        beanRequestInventario.operation = 'paginate';
        beanRequestInventario.type_request = 'GET';
        processAjaxInventario();
    });

    /* FECHAS*/
    $('#txtFechaIFilterInventario').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        lang: 'es',
        icons: calIcons
    });


    $('#txtFechaIFilterInventario').on('keyup.datetimepicker', function (e) {
        let valordate = e.target.value;
        valordate = eliminarCaracteres(valordate, "/");
        if (!(/^[0-9]*$/.test(valordate))) {
            return;
        }

        if (valordate.length > 0 && valordate.length <= 2) {
            if (valordate.length == 2) {
                e.target.value = valordate.concat("/");
            } else {
                e.target.value = valordate.concat("");
            }

        }
        if (valordate.length > 2 && valordate.length <= 4) {
            e.target.value = valordate.concat("/");
        }

        if (valordate.length > 4 && valordate.length <= 8) {
            e.target.value = valordate.concat("/");
        } else {

        }


    });


    /* FECHAS*/
    $('#txtFechaFFilterInventario').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterInventario').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterInventario').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterInventario').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterInventario').value = '';
    };

    document.querySelector(".cerrar-inventario").onclick = () => {
        displayUbicacion("show");

    };
});

function processAjaxInventario() {

    let parameters_pagination = '';
    let json = '';

    switch (beanRequestInventario.operation) {

        default:
            circleCargando.containerOcultar = $(document.querySelector("#tbodyInventario").parentNode);
            circleCargando.container = $(document.querySelector("#tbodyInventario").parentElement.parentElement);
            circleCargando.createLoader();
            circleCargando.toggleLoader("show");

            parameters_pagination +=
                '?filter=' + ubicacionSelected.ubicacion_producto.idubicacion_producto;
            parameters_pagination +=
                '&fechai=' + document.querySelector('#txtFechaIFilterInventario').value;
            parameters_pagination +=
                '&fechaf=' + document.querySelector('#txtFechaFFilterInventario').value;
            parameters_pagination +=
                '&page=1';
            parameters_pagination +=
                '&size=10';
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestInventario,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                showAlertTopEnd('success', 'Acción realizada exitosamente');

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationInventario = beanCrudResponse.beanPagination.list[0].list_entrada.concat(beanCrudResponse.beanPagination.list[0].list_salida);
            ordenarByFecha();
            toListInventario(beanPaginationInventario);
        }

    }, false);
}


function toListInventario(beanPagination) {
    document.querySelector('#tbodyInventario').innerHTML = '';

    let row;
    if (beanPagination.count_filter == 0) {

        row = `
        <tr>
            <td class="text-center" colspan="11">NO HAY PRODUCTOS EN EL ALMACEN</td>
        </tr>
        `;
        document.querySelector('#tbodyInventario').innerHTML += row;
        return;
    }


    beanPagination.forEach((detalleentrada) => {

        if (detalleentrada.entrada !== undefined) {
            row = `
            <tr>
                <td class="p-2">${detalleentrada.entrada.fecha}</td>
                <td class="p-2">${detalleentrada.entrada.tipo_entrada == 1 ? "ENTRADA" : detalleentrada.entrada.tipo_entrada == 3 ? "COMPRA" : detalleentrada.entrada.tipo_entrada == 5 ? "INVENTARIO INICIAL" : ""}</td>`;

            if (detalleentrada.entrada.tipo_entrada == 5) {
                row += ` 
                
                <td class="p-2">
                    <p class="dt-widget__subtitle text-center">${detalleentrada.cantidad + " " +
                    detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                    </p>
                     <p class="dt-widget__subtitle text-center">${detalleentrada.cantidad_otro + " " +
                    detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                    </p>
                    </td>
    
                             <td class="p-2">
                            </td>
                            <td class="p-2">
                            </td>
                            <td class="p-2">
                            </td>
                        `;
                if (detalleentrada.entrada.tipo_entrada == 1) {
                    row += `<td class="p-2">
                            </td>
                            <td class="p-2">
                            </td>
    
                            <td class="p-2">
                        <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                                  </p>
                                  <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                                  </p>
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(detalleentrada.precio_servicio.toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(parseFloat(detalleentrada.existencia * detalleentrada.precio_servicio * detalleentrada.presentacion.ubicacion_producto.producto.factor_conversion + detalleentrada.existencia_otro * detalleentrada.precio_servicio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                            `;
                } else {
                    row += `<td class="p-2">
                        </td>
                        <td class="p-2">
                        </td>
    
                        <td class="p-2">
                        <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                                  </p>
                                  <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                                  </p>
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(detalleentrada.precio_servicio.toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(parseFloat(detalleentrada.existencia * detalleentrada.precio_servicio * detalleentrada.presentacion.ubicacion_producto.producto.factor_conversion + detalleentrada.existencia_otro * detalleentrada.precio_servicio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        `;

                }

            }

            if (detalleentrada.entrada.tipo_entrada == 1 || detalleentrada.entrada.tipo_entrada == 3) {
                row += ` <td class="p-2">
                <p class="dt-widget__subtitle text-center">${detalleentrada.cantidad + " " +
                    detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                </p>
                 <p class="dt-widget__subtitle text-center">${detalleentrada.cantidad_otro + " " +
                    detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                </p>
                </td>
                         <td class="p-2">
                        </td>
                        <td class="p-2">
                        </td>
                        <td class="p-2">
                        </td>
                    `;
                if (detalleentrada.entrada.tipo_entrada == 1) {
                    row += `<td class="p-2">
                        </td>
                        <td class="p-2">
                        </td>
                        
                        <td class="p-2">
                        <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                                  </p>
                                  <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                                  </p>
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(detalleentrada.precio_servicio.toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(parseFloat(detalleentrada.existencia * detalleentrada.precio_servicio * detalleentrada.presentacion.ubicacion_producto.producto.factor_conversion + detalleentrada.existencia_otro * detalleentrada.precio_servicio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        
                        `;
                } else {
                    row += `<td class="p-2">
                    </td>
                    <td class="p-2">
                    </td>
    
                    <td class="p-2">
                    <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                              </p>
                              <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                              </p>
                    </td>
                    <td class="p-2">
                    S/. ${
                        numeroConComas(detalleentrada.precio_servicio.toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                    </td>
                    <td class="p-2">
                    S/. ${
                        numeroConComas(parseFloat(detalleentrada.existencia * detalleentrada.precio_servicio * detalleentrada.presentacion.ubicacion_producto.producto.factor_conversion + detalleentrada.existencia_otro * detalleentrada.precio_servicio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                    </td>
                    `;

                }

            }
        }


        if (detalleentrada.salida !== undefined) {
            row = `
            <tr>
                <td class="p-2">${detalleentrada.salida.fecha}</td>
                <td class="p-2">${ detalleentrada.salida.tipo_salida == 2 ? "SALIDA" : detalleentrada.salida.tipo_salida == 4 ? "VENTA" : ""}</td>`;

            if (detalleentrada.salida.tipo_salida == 2 || detalleentrada.salida.tipo_salida == 4) {
                row += `
                <td class="p-2">
                </td>
                <td class="p-2">
                </td>
                <td class="p-2">
                </td>
               
                `;

                row += `
                <td class="p-2 ">   
                <p class="dt-widget__subtitle text-center">${detalleentrada.cantidad + " " +
                    detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                </p>
                 <p class="dt-widget__subtitle text-center">${detalleentrada.cantidad_otro + " " +
                    detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                </p>
                </td>
    
    
                    `;
                if (detalleentrada.salida.tipo_salida == 2) {
                    row += `<td class="p-2">S/. ${
                        numeroConComas((detalleentrada.precio_servicio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        <td class="p-2">S/. ${
                        numeroConComas((((detalleentrada.cantidad * detalleentrada.factor_conversion) + detalleentrada.cantidad_otro) * detalleentrada.precio_servicio).toFixed(2))}
                        </td>
    
                        <td class="p-2">
                        <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                                  </p>
                                  <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                                  </p>
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(detalleentrada.precio_servicio.toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        <td class="p-2">
                        S/. ${
                        numeroConComas(parseFloat(detalleentrada.existencia * detalleentrada.precio_servicio * detalleentrada.presentacion.ubicacion_producto.producto.factor_conversion + detalleentrada.existencia_otro * detalleentrada.precio_servicio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                        </td>
                        `;
                } else {
                    row += `<td class="p-2">S/. ${
                        numeroConComas((detalleentrada.presentacion.ubicacion_producto.precio_venta).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                    </td>
                    <td class="p-2">S/. ${
                        numeroConComas((((detalleentrada.cantidad * detalleentrada.factor_conversion) + detalleentrada.cantidad_otro) * detalleentrada.precio_servicio).toFixed(2))}
                    </td>
                    <td class="p-2">
                    <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                              </p>
                              <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                              </p>
                    </td>
                    <td class="p-2">
                    S/. ${
                        numeroConComas((detalleentrada.presentacion.ubicacion_producto.precio_venta).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                    </td>
                    <td class="p-2">
                    S/. ${
                        numeroConComas(parseFloat(detalleentrada.existencia * detalleentrada.presentacion.ubicacion_producto.precio_venta * detalleentrada.presentacion.ubicacion_producto.producto.factor_conversion + detalleentrada.existencia_otro * detalleentrada.precio).toFixed(2)) + " x " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                    </td>
                    `;

                }

            }

        }


        row += `
        
     
        
        </tr> 
              `;
        document.querySelector('#tbodyInventario').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });


}

function ordenarByFecha() {
    beanPaginationInventario = beanPaginationInventario.sort((a, b) => {

        let fechaA = (a.entrada !== undefined) ? a.entrada.fecha : a.salida.fecha;
        let fechaB = (b.entrada !== undefined) ? b.entrada.fecha : b.salida.fecha;

        let compa = 0;
        if (fechaA > fechaB) {
            compa = 1;
        } else if (fechaA < fechaB) {
            compa = -1;
        }
        return compa;
    });
}