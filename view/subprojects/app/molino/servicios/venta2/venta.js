document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addVenta();
    displayVenta("hide");
    beanRequestVenta.entity_api = 'api/ventas';
    beanRequestVenta.operation = 'paginate';
    beanRequestVenta.type_request = 'GET';
    processAjaxVenta();
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
    $('#txtFechaIFilterVenta').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        lang: 'es',
        icons: calIcons
    });


    $('#txtFechaIFilterVenta').on('keyup.datetimepicker', function (e) {
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
    $('#txtFechaFFilterVenta').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterVenta').onclick = function () {

        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterVenta').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterVenta').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterVenta').value = '';
    };

    document.querySelector('#btnAbrirNewVenta').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        removeClass(document.querySelector("#FrmVentaModal").parentElement, "d-none");
        document.querySelector('#txtClienteUbicacionProducto').disabled = true;
        removeClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");

        displayVenta("show");
    };
    document.querySelector(".cerrar-venta").onclick = () => {
        document.querySelector('#FrmVenta').dispatchEvent(new Event('submit'));
        displayVenta("hide");

    };


});

var addVenta = () => {
    if (document.querySelector("#btnCambiarPagoVenta").textContent.toUpperCase().charAt(0) == 'P' && ventaSelected.estado == 2) {
        document.querySelector('#btnCambiarPagoVenta').dispatchEvent(new Event('click'));
    } else if (document.querySelector("#btnCambiarPagoVenta").textContent.toUpperCase().charAt(0) == 'D' && ventaSelected.estado == 1) {
        document.querySelector('#btnCambiarPagoVenta').dispatchEvent(new Event('click'));
    }

    //document.querySelector('#txtFechaVenta').value = '';
    clienteSelected = ventaSelected.cliente;
    document.querySelector('#txtClienteUbicacionProducto').value = clienteSelected.nombre + " " + clienteSelected.apellido;

    document.querySelector('#txtClienteUbicacionProducto').disabled = false;
    addClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");

    listDetalleVenta = beanPaginationDetalleVenta.list;
    toListDetalleVenta(listDetalleVenta);
};


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
        $parrafoSubItem.setAttribute("data-content", " ");
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
            $(btn).popover("show");
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