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
        locale: 'es',
        icons: calIcons
    });



    /* FECHAS*/
    $('#txtFechaFFilterInventario').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        locale: 'es',
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
        //ENTRADA
        if (detalleentrada.entrada !== undefined) {
            row = `
            <tr class="${detalleentrada.entrada.estado == 2 ? 'text-danger' : ''}">
                <td class="p-2">${ detalleentrada.entrada.fecha}</td>
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
                       
                    `;
                if (detalleentrada.entrada.tipo_entrada == 1) {
                    row += `
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
                                           
                        `;
                } else {
                    row += `
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
                  
                    `;

                }

            }
        }


        //SALIDA
        if (detalleentrada.salida !== undefined) {
            row = `
            <tr class="${detalleentrada.salida.estado == 2 ? 'text-danger' : ''}">
                <td class="p-2">${ detalleentrada.salida.fecha}</td>
                <td class="p-2">${detalleentrada.salida.tipo_salida == 2 ? "SALIDA" : detalleentrada.salida.tipo_salida == 4 ? "VENTA" : ""}</td>`;
            if (detalleentrada.salida.tipo_salida == 2 || detalleentrada.salida.tipo_salida == 4) {
                row += `
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
                    row += `
                        <td class="p-2">
                        <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                                  </p>
                                  <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                                  </p>
                        </td>
                        
                        `;
                } else {
                    row += `
                    <td class="p-2">
                    <p class="dt-widget__subtitle text-center">${detalleentrada.existencia + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura}
                              </p>
                              <p class="dt-widget__subtitle text-center">${detalleentrada.existencia_otro + " " +
                        detalleentrada.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura}
                              </p>
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

var toListVenta = (beanPagination) => {
    document.querySelector('#tbodyVenta').innerHTML = '';
    document.querySelector('#titleManagerVenta').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] VENTAS';
    let row,
        $fragmentVenta = document.createDocumentFragment();
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationVenta'));
        row = `
      <!-- Widget Item -->
      <div class="dt-widget__item border-bottom pr-4">
        <!-- Widget Info -->
        <div class="dt-widget__info  ">
          <div class="dt-card__title text-left">
            <cite class="f-12" title="lISTA VACÍA">No hay Productos</cite>
          </div>
        </div>
        <!-- /widget info -->
  
      </div>
      <!-- /widgets item -->
      `;
        document.querySelector('#tbodyVenta').innerHTML += row;
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }

    beanPagination.list.forEach((venta) => {
        let $divItem = document.createElement("div"),
            $divSubItem = document.createElement("div"),
            $parrafoSubItem = document.createElement("p"),
            $parrafo2SubItem = document.createElement("p");

        addClass($divItem, "dt-widget__item");
        //
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        addClass($parrafo2SubItem, "dt-widget__subtitle");
        $parrafoSubItem.textContent = venta.fecha_emision.split(" ")[0];
        $parrafo2SubItem.textContent = venta.fecha_emision.split(" ")[1];
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        $parrafoSubItem.textContent = venta.cliente.nombre + " " + venta.cliente.apellido;
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        $parrafoSubItem.innerHTML = tipoEstadoPago(venta.estado);
        $parrafoSubItem.setAttribute("idventa", venta.idventa);
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("a");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle detalle-venta");
        $parrafoSubItem.innerText = "S/. " + numeroConComas(venta.total);
        $parrafoSubItem.setAttribute("idventa", venta.idventa);
        $parrafoSubItem.setAttribute("tabindex", "0");
        $parrafoSubItem.setAttribute("role", "button");
        $parrafoSubItem.setAttribute("data-toggle", "popover");
        $parrafoSubItem.setAttribute("data-trigger", "focus");
        $parrafoSubItem.setAttribute("title", "Productos");
        $parrafoSubItem.setAttribute("data-content", "");
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        $parrafo2SubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        addClass($parrafo2SubItem, "dt-widget__subtitle");
        $parrafoSubItem.textContent = venta.documento.tipo_documento == null ? "---" : tipoDocumento(venta.documento.tipo_documento);
        $parrafo2SubItem.textContent = (venta.documento.tipo_documento == 0) ? "" : (venta.documento.serie + "-" + venta.numero_documento);
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        $parrafoSubItem.innerText = venta.usuario.usuario;
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);

        //EXTRA
        $divSubItem = document.createElement("div");
        let $div2SubItem = document.createElement("div"),
            $div3SubItem = document.createElement("div"),
            $div4SubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("button");
        $parrafo2SubItem = document.createElement("button");
        addClass($divSubItem, "dt-widget__extra");
        addClass($div2SubItem, "dt-task");
        addClass($div3SubItem, "dt-task__redirect");
        addClass($div4SubItem, "action-btn-group");
        addClass($parrafoSubItem, "btn btn-default text-warning dt-fab-btn editar-venta");
        addClass($parrafo2SubItem, "btn btn-default text-danger dt-fab-btn anular-venta");
        $div2SubItem.style.minWidth = "35PX";
        $parrafoSubItem.setAttribute("type", "button");
        $parrafoSubItem.setAttribute("idventa", venta.idventa);
        $parrafoSubItem.setAttribute("data-toggle", "tooltip");
        $parrafoSubItem.setAttribute("data-html", true);
        $parrafoSubItem.setAttribute("title", "");
        $parrafoSubItem.setAttribute("data-original-title", "<em>Ver Venta</em>");

        $parrafo2SubItem.setAttribute("type", "button");
        $parrafo2SubItem.setAttribute("idventa", venta.idventa);
        $parrafo2SubItem.setAttribute("data-toggle", "tooltip");
        $parrafo2SubItem.setAttribute("data-html", true);
        $parrafo2SubItem.setAttribute("title", "");
        $parrafo2SubItem.setAttribute("data-original-title", "<em>Anular Venta</em>");

        $parrafoSubItem.innerHTML = '<i class="icon icon-eye icon-1x"></i>';
        $parrafo2SubItem.innerHTML = '<i class="icon icon-circle-remove-o icon-1x"></i>';
        $div4SubItem.appendChild($parrafoSubItem);
        $div4SubItem.appendChild($parrafo2SubItem);
        $div3SubItem.appendChild($div4SubItem);
        $div2SubItem.appendChild($div3SubItem)
        $divSubItem.appendChild($div2SubItem);
        $divItem.appendChild($divSubItem);


        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        $fragmentVenta.appendChild($divItem)
    });
    document.querySelector('#tbodyVenta').appendChild($fragmentVenta);
    addEventsVentas();
    beanRequestVenta.operation = 'paginate';
    beanRequestVenta.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageVenta').value),
        document.querySelector('#pageVenta'),
        processAjaxVenta, beanRequestVenta,
        $('#paginationVenta')
    );
    if (beanRequestVenta.operation == 'paginate')
        document.querySelector('#txtFilterVenta').focus();
};

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