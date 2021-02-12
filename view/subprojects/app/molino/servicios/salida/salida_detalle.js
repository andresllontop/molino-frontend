var processAjaxDetalleSalida = (detalle = undefined) => {

    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");

    let parameters_pagination = '';
    let json = '';
    if (detalle !== undefined) {
        if (detalle == "detalle-ver") {
            circleCargando.container = $(document.querySelector("#tbodySalidaDetalle").parentElement.parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#tbodySalidaDetalle").parentElement);
        } else {
            circleCargando.container = $(document.querySelectorAll(".popover-body")[0].parentElement);
            circleCargando.containerOcultar = $(document.querySelectorAll(".popover-body")[0]);
        }

    }


    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestSalida.operation) {
        case 'detalle/paginate':
            parameters_pagination += '?idsalida=' + salidaSelected.idsalida;
            break;

        default:
            if (document.querySelector('#txtFilterSalida').value != '') {
                document.querySelector('#pageSalida').value = 1;
            }
            parameters_pagination += '?nombre=' + limpiar_campo(document.querySelector('#txtFilterSalida').value
            ).toLowerCase();
            parameters_pagination += '&fechai=' + document.querySelector('#txtFechaIFilterSalida').value;
            parameters_pagination += '&fechaf=' + document.querySelector('#txtFechaFFilterSalida').value;
            parameters_pagination += '&page=' + document.querySelector('#pageSalida').value;
            parameters_pagination += '&size=' + document.querySelector('#sizePageSalida').value;
            break;
    }
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(beanRequestSalida, json, parameters_pagination,
        circleCargando.loader.firstElementChild);
    xhr.onload = () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                listDetalleSalida.length = 0;
                toListDetalleSalida(listDetalleSalida);
                document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            if (beanRequestSalida.operation == "detalle/paginate") {
                beanPaginationDetalleSalida = beanCrudResponse.beanPagination;
                if (detalle == "detalle-ver") {
                    listDetalleSalida = beanPaginationDetalleSalida.list;
                    toListDetalleSalida(listDetalleSalida);
                    return;
                }
                //  $('[data-toggle="popover"]').popover();
                let row = "";
                beanPaginationDetalleSalida.list.forEach((detalle) => {
                    row += detalle.presentacion.ubicacion_producto.producto.nombre + " - " +
                        detalle.cantidad + " " + detalle.presentacion.ubicacion_producto.producto.unidad_ingreso.abreviatura + " & " + detalle.cantidad_otro + " " + detalle.presentacion.ubicacion_producto.producto.unidad_salida.abreviatura + " || ";
                });
                row = row.substring(0, row.length - 3)
                detalle.setAttribute("data-content", row);
                $(detalle).popover("show");

            } else {
                beanPaginationSalida = beanCrudResponse.beanPagination;
                toListSalida(beanPaginationSalida);
            }

        }
    };
};
