document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestSalida.entity_api = 'api/salidas';
    beanRequestSalida.operation = 'paginate';
    beanRequestSalida.type_request = 'GET';

    $('#FrmSalida').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        beanRequestSalida.operation = 'paginate';
        beanRequestSalida.type_request = 'GET';
        processAjaxSalida();

    });

    $('#sizePageSalida').change(function () {
        beanRequestSalida.operation = 'paginate';
        beanRequestSalida.type_request = 'GET';
        processAjaxSalida();
    });

    /* FECHAS*/
    $('#txtFechaIFilterSalida').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        locale: 'es',
        icons: calIcons
    });


    $('#txtFechaIFilterSalida').on('keyup.datetimepicker', function (e) {
        console.log(e.target.value);
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
    $('#txtFechaFFilterSalida').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        locale: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterSalida').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterSalida').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterSalida').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterSalida').value = '';
    };

    processAjaxSalida();
});

var addSalida = (salidaselec) => {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtFechaEmisionSalida').value = (salidaselec == undefined) ? getDateJava() + " " + getHourStringJava() : salidaselec.fecha;

    documentoSelected = (salidaselec == undefined) ? undefined : salidaselec.cliente;
    document.querySelector('#checkComprobanteSalida').checked == (documentoSelected == undefined) ? true : false;
    document.querySelector('#txtNumeroDocumento').value = (documentoSelected == undefined) ? "" : salidaselec.numero_documento;
    document.querySelector('#txtDocumentoProducto').value = "";

    clienteSelected = (salidaselec == undefined) ? undefined : salidaselec.cliente;
    document.querySelector('#txtClienteUbicacionProducto').value = (clienteSelected == undefined) ? "" : clienteSelected.nombre;
    document.querySelector('#tbodyPresentacionC').innerHTML = "";


};

var toListSalida = (beanPagination) => {
    document.querySelector('#tbodySalida').innerHTML = '';
    document.querySelector('#titleManagerSalida').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] SALIDAS';
    let row;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationSalida'));
        row = `
      <!-- Widget Item -->
      <div class="dt-widget__item border-bottom pr-4">
        <!-- Widget Info -->
        <div class="dt-widget__info  ">
          <div class="dt-card__title text-left">
            <cite class="f-12" title="lISTA VACÍA">No hay Salidas</cite>
          </div>
        </div>
        <!-- /widget info -->
  
      </div>
      <!-- /widgets item -->
      `;
        document.querySelector('#tbodySalida').innerHTML += row;
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }

    beanPagination.list.forEach((salida) => {
        if (salida.idsalida == null) {
            row = `
            <div class="m-0 p-3">

                <!-- Card Body -->
                <div class="dt-card">

                  <!-- Media -->
                  <div class="media">

                    <i class="icon icon-invoice-new icon-5x mr-xl-5 mr-1 mr-sm-3 align-self-center"></i>

                    <!-- Media Body -->
                    <div class="media-body">
                      <ul class="invoice-list">
                       
                        <li class="invoice-list__item">
                        <span class="invoice-list__number">${salida.total} x SC</span> 
                        <span class="invoice-list__number">${salida.total_otro} x KG</span>
                          <span class="invoice-list__label">Cantidad</span>
                          <span class="custom-tooltip bg-success">${"S/." + salida.monto}</span>
                        </li>
                      </ul>
                    </div>
                    <!-- /media body -->

                  </div>
                  <!-- /media -->

                </div>
                <!-- /card body -->

              </div>
                `;
            document.querySelector('#tbodySalida').innerHTML += row;
            return;
        }
        row = `
                  <!-- Widget Item -->
                  <div class="dt-widget__item">
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${salida.fecha}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${salida.cliente.nombre + " " + salida.cliente.apellido}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-center">
                        <p class="dt-widget__subtitle ">${tipoSalida(salida.tipo_salida)}
                        </p>
                      <p class="dt-widget__subtitle ">${tipoEstadoSalida(salida.estado)}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      
                      <a class="dt-widget__subtitle detalle-salida text-center molino-cursor-mano" idsalida="${salida.idsalida}" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="" data-content="" data-original-title="Productos">
                            <p class="dt-widget__subtitle ">${salida.total} x SC</p>
                            <p class="dt-widget__subtitle ">${salida.total_otro} X KG </p>
                        </a>
                    </div>
                    
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${salida.numero_documento == null ? "---" : tipoDocumento(salida.documento.tipo_documento)}
                      </p>
                      <p class="dt-widget__subtitle ">${salida.numero_documento == null ? "" : salida.documento.serie + "-" + salida.numero_documento}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${servicioEstadoSalida(salida.servicio_estado)}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${salida.usuario.usuario}
                      </p>
                    </div>
                    <!-- /widget info -->
                   
                    <!-- Widget Extra -->
                    <div class="dt-widget__extra">
                    <div class="dt-task" style="min-width: 85px;">
                    <div class="dt-task__redirect">
                      <!-- Action Button Group -->
                      <div class="action-btn-group">
                      `;
        if (salida.numero_documento == null) {
            if (salida.estado == 2) {
                row += `
                <button
                    type="button"
                    class="btn btn-default text-warning dt-fab-btn ver-salida" idsalida='${salida.idsalida}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Ver</em>"
                  >
                    <i class="icon icon-eye icon-1x"></i>
                  </button>
                  `;
            } else {
                row += `
                <button
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-salida" idsalida='${salida.idsalida}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-1x"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn anular-salida" idsalida='${salida.idsalida}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Anular</em>"
                  >
                    <i class="icon icon-circle-remove-o icon-1x"></i>
                  </button>
                  `;
            }

        } else {
            row += `
            <button
                type="button"
                class="btn btn-default text-warning dt-fab-btn editar-salida" idsalida='${salida.idsalida}'
                data-toggle="tooltip"
                data-html="true"
                title=""
                data-original-title="<em>Ver</em>"
              >
                <i class="icon icon-eye icon-1x"></i>
              </button>
              `;

        }


        row += `
                        </div>
                      <!-- /action button group -->
                    </div>
                    </div>
                    <!-- /widget extra -->
                  </div>
                  <!-- /widgets item -->
              `;
        document.querySelector('#tbodySalida').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });

    addEventsSalidas();
    beanRequestSalida.operation = 'paginate';
    beanRequestSalida.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageSalida').value),
        document.querySelector('#pageSalida'),
        processAjaxSalida, beanRequestSalida,
        $('#paginationSalida')
    );
    if (beanRequestSalida.operation == 'paginate')
        document.querySelector('#txtFilterSalida').focus();
};

var addEventsSalidas = () => {
    document.querySelectorAll('.ver-salida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            salidaSelected = findBySalida(btn.getAttribute('idsalida'));
            if (salidaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la salida para poder editar'
                );
            }
            metodo = true;
            beanRequestSalida.operation = 'detalle/paginate';
            beanRequestSalida.type_request = 'GET';
            displaySalida("show");
            processAjaxDetalleSalida("detalle-ver");
            addClass(document.querySelector("#FrmSalidaModal").parentElement, "d-none");
            addSalida(salidaSelected);
            addClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");
        };
    });
    document.querySelectorAll('.editar-salida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            salidaSelected = findBySalida(btn.getAttribute('idsalida'));
            if (salidaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la salida para poder editar'
                );
            }
            metodo = true;
            beanRequestSalida.operation = 'detalle/paginate';
            beanRequestSalida.type_request = 'GET';
            displaySalida("show");
            processAjaxDetalleSalida("detalle-ver");
            removeClass(document.querySelector("#FrmSalidaModal").parentElement, "d-none");

            addSalida(salidaSelected);
            addClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");
        };
    });
    document.querySelectorAll('.detalle-salida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            salidaSelected = findBySalida(btn.getAttribute('idsalida'));
            if (salidaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la salida para obtener productos'
                );
            }
            beanRequestSalida.operation = 'detalle/paginate';
            beanRequestSalida.type_request = 'GET';
            $(btn).popover("show");
            processAjaxDetalleSalida(btn);

        };
    });
    document.querySelectorAll('.anular-salida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            salidaSelected = findBySalida(btn.getAttribute('idsalida'));
            beanRequestSalida.operation = 'delete';
            beanRequestSalida.type_request = 'DELETE';
            processAjaxSalida();
        };
    });

};

var findBySalida = (idsalida) => {
    let salida_;
    beanPaginationSalida.list.forEach((salida) => {
        if (idsalida == salida.idsalida) {
            salida_ = salida;
            return;
        }
    });
    return salida_;
};

var validateFormSalida = () => {
    if (document.querySelector('#txtNombreSalida').value == '') {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenSalida').focus();
        return false;
    }
    return true;
};
var displaySalida = (display = "hide") => {

    if (display == "show") {
        removeClass(document.querySelector("#addSalidaHtml"), "d-none");
        addClass(document.querySelector("#listSalidaHtml"), "d-none");

    } else {
        removeClass(document.querySelector("#listSalidaHtml"), "d-none");
        addClass(document.querySelector("#addSalidaHtml"), "d-none");

    }

}

function tipoDocumento(key) {
    switch (parseInt(key)) {
        case 1:
            return "BOLETA";
        case 2:
            return "FACTURA";
        case 3:
            return "TICKET";
        case 4:
            return "ORDEN SALIDA";
        case 5:
            return "ORDEN SALIDA";
        case 6:
            return "OTRO";
        default:
            return "--";
    }
}

function tipoEstadoSalida(key) {
    switch (parseInt(key)) {
        case 1:
            return '<span class="badge badge-pill badge-success mb-1 mr-1">Registrado</span>';
        default:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1">Anulado</span>';

    }
}
function tipoSalida(key) {
    switch (parseInt(key)) {
        case 2:
            return '<span class="badge badge-pill badge-info mb-1 mr-1">Salida</span>';
        case 4:
            return '<span class="badge badge-pill badge-warning mb-1 mr-1">Venta</span>';
        default:
            return '';

    }
}
function servicioEstadoSalida(key) {
    switch (parseInt(key)) {
        case 1:
            return '<span class="badge badge-pill badge-info mb-1 mr-1">Pagado</span>';
        default:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1">Deuda</span>';

    }
}