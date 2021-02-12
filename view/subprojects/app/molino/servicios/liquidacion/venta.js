document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addVenta();
    displayVenta("hide");
    beanRequestVenta.entity_api = 'api/ventas';
    beanRequestVenta.operation = 'paginate';
    beanRequestVenta.type_request = 'GET';

    $('#FrmVenta').submit(function (event) {

        beanRequestVenta.operation = 'paginate';
        beanRequestVenta.type_request = 'GET';
        processAjaxVenta();
        event.preventDefault();
        event.stopPropagation();

    });

    $('#sizePageVenta').change(function () {
        beanRequestVenta.operation = 'paginate';
        beanRequestVenta.type_request = 'GET';
        processAjaxVenta();
    });

    /* FECHAS*/
    $('#FechaIFilterVenta').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        locale: 'es',
        icons: calIcons
    });


    /* FECHAS*/
    $('#FechaFFilterVenta').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        locale: 'es',
        icons: calIcons

    });

    document.querySelector('#btnEliminarFechaFFilterVenta').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterVenta').value = '';
    };

    document.querySelector('#btnAbrirNewVenta').onclick = function () {
        //$('[data-toggle="tooltip"]').tooltip("hide");
        removeClass(document.querySelector("#FrmVentaModal").parentElement, "d-none");
        document.querySelector('#txtClienteUbicacionProducto').disabled = true;
        removeClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");

        displayVenta("show");
    };
    document.querySelector(".cerrar-venta").onclick = () => {
        document.querySelector('#FrmVenta').dispatchEvent(new Event('submit'));
        displayVenta("hide");

    };
    processAjaxVenta();

});

var addVenta = (salidaselec) => {
    if (document.querySelector("#btnCambiarPagoVenta").textContent.toUpperCase().charAt(0) == 'P' && salidaselec.estado == 2) {
        document.querySelector('#btnCambiarPagoVenta').dispatchEvent(new Event('click'));
    } else if (document.querySelector("#btnCambiarPagoVenta").textContent.toUpperCase().charAt(0) == 'D' && salidaselec.estado == 1) {
        document.querySelector('#btnCambiarPagoVenta').dispatchEvent(new Event('click'));
    }

    document.querySelector('#txtFechaEmisionVenta').value = (salidaselec == undefined) ? getDateJava() + " " + getHourStringJava() : salidaselec.fecha;

    documentoSelected = (salidaselec == undefined) ? undefined : salidaselec.cliente;
    document.querySelector('#checkComprobanteVenta').checked == (documentoSelected == undefined) ? true : false;
    document.querySelector('#txtNumeroDocumento').value = (documentoSelected == undefined) ? "" : salidaselec.numero_documento;
    document.querySelector('#txtDocumentoProducto').value = "";

    clienteSelected = (salidaselec == undefined) ? undefined : salidaselec.cliente;
    document.querySelector('#txtClienteUbicacionProducto').value = (clienteSelected == undefined) ? "" : clienteSelected.nombre;
    document.querySelector('#tbodyPresentacionC').innerHTML = "";


    listDetalleVenta = beanPaginationDetalleVenta.list;
    toListDetalleVenta(listDetalleVenta);
};

var toListVenta = (beanPagination) => {
    document.querySelector('#tbodyVenta').innerHTML = '';
    document.querySelector('#titleManagerVenta').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] Liquidaciòn';
    let row;
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
        row = `
                  <!-- Widget Item -->
                  <div class="dt-widget__item">
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${venta.fecha_emision.split(" ")[0]}
                      </p>
                      <p class="dt-widget__subtitle ">${venta.fecha_emision.split(" ")[1]}
                      </p>
                    </div>
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${venta.cliente.nombre + " " + venta.cliente.apellido}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle" idventa='${venta.idventa}'>${tipoEstadoPago(venta.estado)}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <a tabindex="0" class="dt-widget__subtitle detalle-venta" 
                      idventa='${venta.idventa}'
                      role="button" data-toggle="popover"
                      data-trigger="focus"
                      title="Productos"
                      data-content="">S/. ${numeroConComas(venta.total)}</a>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${venta.documento.numero_actual == null ? "---" : venta.documento.comprobante.nombre}
                      </p>
                      <p class="dt-widget__subtitle ">${(venta.documento.numero_actual == null) ? "" : (venta.documento.serie + "-" + venta.numero_documento)}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Info -->
                    <div class="dt-widget__info ">
                      <p class="dt-widget__subtitle ">${venta.usuario.usuario}
                      </p>
                    </div>
                    <!-- /widget info -->
                    <!-- Widget Extra -->
                    <div class="dt-widget__extra">
                    <div class="dt-task" style="min-width: 35px;">
                    <div class="dt-task__redirect">
                      <!-- Action Button Group -->
                      <div class="action-btn-group">
                        <button
                          type="button"
                          class="btn btn-default text-warning dt-fab-btn editar-venta" idventa='${venta.idventa}'
                          data-toggle="tooltip"
                          data-html="true"
                          title=""
                          data-original-title="<em>Ver Venta</em>"
                        >
                          <i class="icon icon-eye icon-1x"></i>
                        </button>

                        <button
                          type="button"
                          class="btn btn-default text-danger dt-fab-btn anular-venta" idventa='${venta.idventa}'
                          data-toggle="tooltip"
                          data-html="true"
                          title=""
                          data-original-title="<em>Anular</em>"
                        >
                          <i class="icon icon-circle-remove-o icon-1x"></i>
                        </button>
                        </div>
                      <!-- /action button group -->
                    </div>
                    </div>
                    <!-- /widget extra -->
                  </div>
                  <!-- /widgets item -->
              `;
        document.querySelector('#tbodyVenta').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();
    });

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

var addEventsVentas = () => {
    document.querySelectorAll('.editar-venta').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            ventaSelected = findByVenta(btn.getAttribute('idventa'));
            if (ventaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la venta para poder visualizar'
                );
            }
            beanRequestVenta.operation = 'detalle/paginate';
            beanRequestVenta.type_request = 'GET';
            processAjaxVenta("detalle-ver");
            displayVenta("show");

        };
    });
    document.querySelectorAll('.editar-pago-venta').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            ventaSelected = findByVenta(btn.parentElement.getAttribute('idventa'));
            if (ventaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la venta para poder editar'
                );
            }
            beanRequestPagoVenta.operation = 'paginate';
            beanRequestPagoVenta.type_request = 'GET';
            $('#modalPagoVenta').modal('show');
            processAjaxPagoVenta();
        };
    });

    document.querySelectorAll('.detalle-venta').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            ventaSelected = findByVenta(btn.getAttribute('idventa'));
            if (ventaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la venta para poder editar'
                );
            }
            beanRequestVenta.operation = 'detalle/paginate';
            beanRequestVenta.type_request = 'GET';
            processAjaxVenta(btn);
        };
    });
    document.querySelectorAll('.anular-venta').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            ventaSelected = findByVenta(btn.getAttribute('idventa'));
            if (ventaSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la venta para poder visualizar'
                );
            }
            beanRequestVenta.operation = 'delete';
            beanRequestVenta.type_request = 'DELETE';
            processAjaxVenta();
        };
    });

};

var findByVenta = (idventa) => {
    let venta_;
    beanPaginationVenta.list.forEach((venta) => {
        if (idventa == venta.idventa) {
            venta_ = venta;
            return;
        }
    });
    return venta_;
};

var validateFormVenta = () => {
    if (document.querySelector('#txtNombreVenta').value == '') {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenVenta').focus();
        return false;
    }
    return true;
};

var displayVenta = (display = "hide") => {

    if (display == "show") {
        removeClass(document.querySelector("#addVentaHtml"), "d-none");
        addClass(document.querySelector("#listVentaHtml"), "d-none");

    } else {
        removeClass(document.querySelector("#listVentaHtml"), "d-none");
        addClass(document.querySelector("#addVentaHtml"), "d-none");

    }

}

function tipoEstadoPago(key) {
    switch (parseInt(key)) {
        case 1:
            return '<span class="badge badge-pill badge-success mb-1 mr-1 editar-pago-venta molino-cursor-mano">Pagado</span>';
        case 2:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1 editar-pago-venta molino-cursor-mano">Pendiente</span>';
        default:
            return "";
    }
}