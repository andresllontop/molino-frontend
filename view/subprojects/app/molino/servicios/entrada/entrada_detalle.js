var processAjaxDetalleEntrada = (detalle = undefined) => {

    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

    let parameters_pagination = '';
    let json = '';
    if (detalle !== undefined) {
        if (detalle == "detalle-ver") {
            circleCargando.container = $(document.querySelector("#tbodyEntradaDetalle").parentElement.parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#tbodyEntradaDetalle").parentElement);
        } else {
            circleCargando.container = $(document.querySelectorAll(".popover-body")[0].parentElement);
            circleCargando.containerOcultar = $(document.querySelectorAll(".popover-body")[0]);
        }

    }


    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestEntrada.operation) {
        case 'detalle/paginate':
            parameters_pagination += '?identrada=' + entradaSelected.identrada;
            break;

        default:
            if (document.querySelector('#txtFilterEntrada').value != '') {
                document.querySelector('#pageEntrada').value = 1;
            }
            parameters_pagination += '?nombre=' + limpiar_campo(document.querySelector('#txtFilterEntrada').value
            ).toLowerCase();
            parameters_pagination += '&fechai=' + document.querySelector('#txtFechaIFilterEntrada').value;
            parameters_pagination += '&fechaf=' + document.querySelector('#txtFechaFFilterEntrada').value;
            parameters_pagination += '&page=' + document.querySelector('#pageEntrada').value;
            parameters_pagination += '&size=' + document.querySelector('#sizePageEntrada').value;
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestEntrada, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                listDetalleEntrada.length = 0;
                toListDetalleEntrada(listDetalleEntrada);
                document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            if (beanRequestEntrada.operation == "detalle/paginate") {
                beanPaginationDetalleEntrada = beanCrudResponse.beanPagination;

                if (detalle == "detalle-ver") {
                    listDetalleEntrada = beanPaginationDetalleEntrada.list;
                    toListDetalleEntrada(listDetalleEntrada);
                    return;
                }
                //  $('[data-toggle="popover"]').popover();
                let row = "";
                beanPaginationDetalleEntrada.list.forEach((detalle) => {
                    row += detalle.presentacion.ubicacion_producto.producto.nombre + " - " +
                        detalle.cantidad + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura + " & " + detalle.cantidad_otro + " " + detalle.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura + " || ";
                });
                row = row.substring(0, row.length - 3)
                detalle.setAttribute("data-content", row);
                $(detalle).popover("show");

            } else {
                beanPaginationEntrada = beanCrudResponse.beanPagination;
                toListEntrada(beanPaginationEntrada);
            }

        }
    };
};
