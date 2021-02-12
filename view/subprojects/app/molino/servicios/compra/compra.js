document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //addCompra();
    displayCompra("hide");
    beanRequestCompra.entity_api = 'api/compras';
    beanRequestCompra.operation = 'paginate';
    beanRequestCompra.type_request = 'GET';
    processAjaxCompra();
    $('#FrmCompra').submit(function (event) {

        beanRequestCompra.operation = 'paginate';
        beanRequestCompra.type_request = 'GET';
        processAjaxCompra();
        event.preventDefault();
        event.stopPropagation();

    });

    $('#sizePageCompra').change(function () {
        beanRequestCompra.operation = 'paginate';
        beanRequestCompra.type_request = 'GET';
        processAjaxCompra();
    });

    /* FECHAS*/
    $('#txtFechaIFilterCompra').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: removeDays(new Date(), 30),
        lang: 'es',
        icons: calIcons
    });


    $('#txtFechaIFilterCompra').on('keyup.datetimepicker', function (e) {
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
    $('#txtFechaFFilterCompra').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        lang: 'es',
        icons: calIcons

    });


    document.querySelector('#btnEliminarFechaIFilterCompra').onclick = function () {

        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaIFilterCompra').value = '';
    };

    document.querySelector('#btnEliminarFechaFFilterCompra').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        document.querySelector('#txtFechaFFilterCompra').value = '';
    };

    document.querySelector('#btnAbrirNewCompra').onclick = function () {
        $('[data-toggle="tooltip"]').tooltip("hide");
        removeClass(document.querySelector("#FrmCompraModal").parentElement, "d-none");
        document.querySelector('#txtClienteUbicacionProducto').disabled = true;
        removeClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");

        displayCompra("show");
    };
    document.querySelector(".cerrar-compra").onclick = () => {
        document.querySelector('#FrmCompra').dispatchEvent(new Event('submit'));
        displayCompra("hide");

    };


});

var addCompra = () => {
    if (document.querySelector("#btnCambiarPagoCompra").textContent.toUpperCase().charAt(0) == 'P' && compraSelected.estado == 2) {
        document.querySelector('#btnCambiarPagoCompra').dispatchEvent(new Event('click'));
    } else if (document.querySelector("#btnCambiarPagoCompra").textContent.toUpperCase().charAt(0) == 'D' && compraSelected.estado == 1) {
        document.querySelector('#btnCambiarPagoCompra').dispatchEvent(new Event('click'));
    }

    //document.querySelector('#txtFechaCompra').value = '';
    clienteSelected = compraSelected.cliente;
    document.querySelector('#txtClienteUbicacionProducto').value = clienteSelected.nombre + " " + clienteSelected.apellido;

    document.querySelector('#txtClienteUbicacionProducto').disabled = false;
    addClass(document.querySelector('#txtClienteUbicacionProducto').nextElementSibling, "d-none");

    listDetalleCompra = beanPaginationDetalleCompra.list;
    toListDetalleCompra(listDetalleCompra);
};


var toListCompra = (beanPagination) => {
    document.querySelector('#tbodyCompra').innerHTML = '';
    document.querySelector('#titleManagerCompra').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] COMPRAS';
    let row,
        $fragmentCompra = document.createDocumentFragment();
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationCompra'));
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
        document.querySelector('#tbodyCompra').innerHTML += row;
        showAlertTopEnd('warning', 'No se encontraron resultados');
        return;
    }

    beanPagination.list.forEach((compra) => {
        let $divItem = document.createElement("div"),
            $divSubItem = document.createElement("div"),
            $parrafoSubItem = document.createElement("p"),
            $parrafo2SubItem = document.createElement("p");

        addClass($divItem, "dt-widget__item");
        //
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        addClass($parrafo2SubItem, "dt-widget__subtitle");
        $parrafoSubItem.textContent = compra.fecha_emision.split(" ")[0];
        $parrafo2SubItem.textContent = compra.fecha_emision.split(" ")[1];
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        $parrafoSubItem.textContent = compra.cliente.nombre + " " + compra.cliente.apellido;
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        $parrafoSubItem.innerHTML = tipoEstadoPago(compra.estado);
        $parrafoSubItem.setAttribute("idcompra", compra.idcompra);
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("a");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle detalle-compra");
        $parrafoSubItem.innerText = "S/. " + numeroConComas(compra.total);
        $parrafoSubItem.setAttribute("idcompra", compra.idcompra);
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
        $parrafoSubItem.textContent = compra.documento.tipo_documento == null ? "---" : tipoDocumento(compra.documento.tipo_documento);
        $parrafo2SubItem.textContent = (compra.documento.tipo_documento == 0) ? "" : (compra.documento.serie + "-" + compra.numero_documento);
        $divSubItem.appendChild($parrafoSubItem);
        $divItem.appendChild($divSubItem);
        //
        $divSubItem = document.createElement("div");
        $parrafoSubItem = document.createElement("p");
        addClass($divSubItem, "dt-widget__info");
        addClass($parrafoSubItem, "dt-widget__subtitle");
        $parrafoSubItem.innerText = compra.usuario.usuario;
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
        addClass($parrafoSubItem, "btn btn-default text-warning dt-fab-btn editar-compra");
        addClass($parrafo2SubItem, "btn btn-default text-danger dt-fab-btn anular-compra");
        $div2SubItem.style.minWidth = "35PX";
        $parrafoSubItem.setAttribute("type", "button");
        $parrafoSubItem.setAttribute("idcompra", compra.idcompra);
        $parrafoSubItem.setAttribute("data-toggle", "tooltip");
        $parrafoSubItem.setAttribute("data-html", true);
        $parrafoSubItem.setAttribute("title", "");
        $parrafoSubItem.setAttribute("data-original-title", "<em>Ver Compra</em>");

        $parrafo2SubItem.setAttribute("type", "button");
        $parrafo2SubItem.setAttribute("idcompra", compra.idcompra);
        $parrafo2SubItem.setAttribute("data-toggle", "tooltip");
        $parrafo2SubItem.setAttribute("data-html", true);
        $parrafo2SubItem.setAttribute("title", "");
        $parrafo2SubItem.setAttribute("data-original-title", "<em>Anular Compra</em>");

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

        $fragmentCompra.appendChild($divItem)
    });
    document.querySelector('#tbodyCompra').appendChild($fragmentCompra);
    addEventsCompras();
    beanRequestCompra.operation = 'paginate';
    beanRequestCompra.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageCompra').value),
        document.querySelector('#pageCompra'),
        processAjaxCompra, beanRequestCompra,
        $('#paginationCompra')
    );
    if (beanRequestCompra.operation == 'paginate')
        document.querySelector('#txtFilterCompra').focus();
};


var addEventsCompras = () => {
    document.querySelectorAll('.editar-compra').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            compraSelected = findByCompra(btn.getAttribute('idcompra'));
            if (compraSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la compra para poder visualizar'
                );
            }
            beanRequestCompra.operation = 'detalle/paginate';
            beanRequestCompra.type_request = 'GET';
            processAjaxCompra("detalle-ver");
            displayCompra("show");

        };
    });
    document.querySelectorAll('.editar-pago-compra').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            compraSelected = findByCompra(btn.parentElement.getAttribute('idcompra'));
            if (compraSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la compra para poder editar'
                );
            }
            beanRequestPagoCompra.operation = 'paginate';
            beanRequestPagoCompra.type_request = 'GET';
            $('#modalPagoCompra').modal('show');
            processAjaxPagoCompra();
        };
    });

    document.querySelectorAll('.detalle-compra').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            compraSelected = findByCompra(btn.getAttribute('idcompra'));
            if (compraSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la compra para poder editar'
                );
            }
            beanRequestCompra.operation = 'detalle/paginate';
            beanRequestCompra.type_request = 'GET';
            $(btn).popover("show");
            processAjaxCompra(btn);
        };
    });
    document.querySelectorAll('.anular-compra').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            compraSelected = findByCompra(btn.getAttribute('idcompra'));
            if (compraSelected == undefined) {
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la compra para poder visualizar'
                );
            }
            beanRequestCompra.operation = 'delete';
            beanRequestCompra.type_request = 'DELETE';
            processAjaxCompra();
        };
    });

};

var findByCompra = (idcompra) => {
    let compra_;
    beanPaginationCompra.list.forEach((compra) => {
        if (idcompra == compra.idcompra) {
            compra_ = compra;
            return;
        }
    });
    return compra_;
};

var validateFormCompra = () => {
    if (document.querySelector('#txtNombreCompra').value == '') {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenCompra').focus();
        return false;
    }
    return true;
};

var displayCompra = (display = "hide") => {

    if (display == "show") {
        removeClass(document.querySelector("#addCompraHtml"), "d-none");
        addClass(document.querySelector("#listCompraHtml"), "d-none");

    } else {
        removeClass(document.querySelector("#listCompraHtml"), "d-none");
        addClass(document.querySelector("#addCompraHtml"), "d-none");

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
            return '<span class="badge badge-pill badge-success mb-1 mr-1 editar-pago-compra molino-cursor-mano">Pagado</span>';
        case 2:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1 editar-pago-compra molino-cursor-mano">Pendiente</span>';
        default:
            return "";
    }
}