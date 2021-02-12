document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar

    $('#FrmEntrada').submit(function (event) {
        event.preventDefault();
        event.stopPropagation();
        beanRequestEntrada.operation = 'paginate';
        beanRequestEntrada.type_request = 'GET';
        processAjaxEntrada();

    });

    $('#sizePageEntrada').change(function () {
        beanRequestEntrada.operation = 'paginate';
        beanRequestEntrada.type_request = 'GET';
        processAjaxEntrada();
    });

    /* FECHAS*/
    $('#txtFechaIFilterEntrada').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        locale: 'es',
        icons: calIcons
    });


    /* FECHAS*/
    $('#txtFechaFFilterEntrada').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        locale: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterEntrada').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterEntrada').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterEntrada').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterEntrada').value = '';
    };
    processAjaxEntrada();

});

var addEntrada = (entradaselec = undefined) => {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtFechaEmisionEntrada').value = (entradaselec == undefined) ? getDateJava() + " " + getHourStringJava() : entradaselec.fecha;

    documentoSelected = (entradaselec == undefined) ? undefined : entradaselec.cliente;
    document.querySelector('#checkComprobanteEntrada').checked == (documentoSelected == undefined) ? true : false;
    document.querySelector('#txtNumeroDocumento').value = (documentoSelected == undefined) ? "" : entradaselec.numero_documento;
    document.querySelector('#txtDocumentoProducto').value = "";


    clienteSelected = (entradaselec == undefined) ? undefined : entradaselec.cliente;
    document.querySelector('#txtClienteUbicacionProducto').value = (clienteSelected == undefined) ? "" : clienteSelected.nombre;
    document.querySelector('#tbodyPresentacionC').innerHTML = "";


};

var toListEntrada = (beanPagination) => {
    document.querySelector('#tbodyEntrada').innerHTML = '';
    document.querySelector('#titleManagerEntrada').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] ENTRADAS';
    let row;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationEntrada'));
        row = `
      <!-- Widget Item -->
      <div class="dt-widget__item border-bottom pr-4">
        <!-- Widget Info -->
        <div class="dt-widget__info  ">
          <div class="dt-card__title text-left">
            <cite class="f-12" title="lISTA VACÍA">No hay Entradas</cite>
          </div>
        </div>
        <!-- /widget info -->
  
      </div>
      <!-- /widgets item -->
      `;
        document.querySelector('#tbodyEntrada').innerHTML += row;
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }

    beanPagination.list.forEach((entrada) => {
        if (entrada.identrada == null) {
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
                        <span class="invoice-list__number">${entrada.total} x SC</span> 
                        <span class="invoice-list__number">${entrada.total_otro} x KG</span>
                        <span class="invoice-list__label">Cantidad</span>
                        <span class="custom-tooltip bg-success">${"S/." + entrada.monto}</span>
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
            document.querySelector('#tbodyEntrada').innerHTML += row;
            return;
        }
        row = `
                  <!-- Widget Item -->
                  <div class="dt-widget__item">
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${entrada.fecha}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${entrada.cliente.nombre}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info text-center">
                      <p class="dt-widget__subtitle ">${tipoEstadoEntrada(entrada.estado)}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                        <a class="dt-widget__subtitle detalle-entrada text-center" identrada="${entrada.identrada}" tabindex="0" role="button" data-toggle="popover" data-trigger="focus" title="" data-content="" data-original-title="Productos">
                            <p class="dt-widget__subtitle ">${entrada.total} x SC</p>
                            <p class="dt-widget__subtitle ">${entrada.total_otro} X KG </p>
                        </a>
                    </div>
                    <!-- /widget info -->
                    
                    <!-- Widget Info -->
                    <div class="dt-widget__info">
                      <p class="dt-widget__subtitle ">${entrada.numero_documento == null ? "---" : tipoDocumento(entrada.documento.tipo_documento)}
                      </p>
                      <p class="dt-widget__subtitle ">${entrada.numero_documento == null ? "" : entrada.documento.serie + "-" + entrada.numero_documento}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${entrada.usuario.usuario}
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
        if (entrada.numero_documento == null) {
            if (entrada.estado == 2) {
                row += `
                <button
                    type="button"
                    class="btn btn-default text-warning dt-fab-btn ver-entrada" identrada='${entrada.identrada}'
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
                    class="btn btn-default text-info dt-fab-btn editar-entrada" identrada='${entrada.identrada}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-1x"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn anular-entrada" identrada='${entrada.identrada}'
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
                class="btn btn-default text-warning dt-fab-btn ver-entrada" identrada='${entrada.identrada}'
                data-toggle="tooltip"
                data-html="true"
                title=""
                data-original-title="<em>Ver</em>"
              >
                <i class="icon icon-eye icon-1x"></i>
              </button>
              `;
        }

        row + `
                        </div>
                      <!-- /action button group -->
                    </div>
                    </div>
                    <!-- /widget extra -->
                  </div>
                  <!-- /widgets item -->
              `;
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
        document.querySelector('#tbodyEntrada').innerHTML += row;

    });

    addEventsEntradas();
    beanRequestEntrada.operation = 'paginate';
    beanRequestEntrada.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageEntrada').value),
        document.querySelector('#pageEntrada'),
        processAjaxEntrada, beanRequestEntrada,
        $('#paginationEntrada')
    );
    if (beanRequestEntrada.operation == 'paginate')
        document.querySelector('#txtFilterEntrada').focus();
};

var addEventsEntradas = () => {
    document.querySelectorAll('.editar-entrada').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            entradaSelected = findByEntrada(btn.getAttribute('identrada'));
            if (entradaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la entrada para poder editar'
                );
            }
            metodo = true;
            beanRequestEntrada.operation = 'detalle/paginate';
            beanRequestEntrada.type_request = 'GET';
            displayEntrada("show");
            processAjaxDetalleEntrada("detalle-ver");
            addEntrada(entradaSelected);
            addClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");

        };
    });
    document.querySelectorAll('.ver-entrada').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            entradaSelected = findByEntrada(btn.getAttribute('identrada'));
            if (entradaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la entrada para poder editar'
                );
            }
            metodo = true;
            beanRequestEntrada.operation = 'detalle/paginate';
            beanRequestEntrada.type_request = 'GET';
            addClass(document.querySelector("#FrmEntradaModal").parentElement, "d-none");
            displayEntrada("show");
            processAjaxDetalleEntrada("detalle-ver");
            addEntrada(entradaSelected);
            addClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");


        };
    });
    document.querySelectorAll('.detalle-entrada').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            entradaSelected = findByEntrada(btn.getAttribute('identrada'));
            if (entradaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la entrada para obtener productos'
                );
            }
            beanRequestEntrada.operation = 'detalle/paginate';
            beanRequestEntrada.type_request = 'GET';
            $(btn).popover("show");
            processAjaxDetalleEntrada(btn);

        };
    });
    document.querySelectorAll('.anular-entrada').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            entradaSelected = findByEntrada(btn.getAttribute('identrada'));
            beanRequestEntrada.operation = 'delete';
            beanRequestEntrada.type_request = 'DELETE';
            processAjaxEntrada();
        };
    });

};

var findByEntrada = (identrada) => {
    let entrada_;
    beanPaginationEntrada.list.forEach((entrada) => {
        if (identrada == entrada.identrada) {
            entrada_ = entrada;
            return;
        }
    });
    return entrada_;
};

var validateFormEntrada = () => {
    if (document.querySelector('#txtNombreEntrada').value == '') {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenEntrada').focus();
        return false;
    }
    return true;
};
var displayEntrada = (display = "hide") => {

    if (display == "show") {
        removeClass(document.querySelector("#addEntradaHtml"), "d-none");
        addClass(document.querySelector("#listEntradaHtml"), "d-none");

    } else {
        removeClass(document.querySelector("#listEntradaHtml"), "d-none");
        addClass(document.querySelector("#addEntradaHtml"), "d-none");

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
            return "ORDEN ENTRADA";
        default:
            return "OTRO";
    }
}
function tipoEstadoEntrada(key) {
    switch (parseInt(key)) {
        case 1:
            return '<span class="badge badge-pill badge-success mb-1 mr-1">Registrado</span>';
        default:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1">Anulado</span>';

    }
}
