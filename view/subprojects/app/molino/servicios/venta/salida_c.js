
var beanPaginationSalidaC;
var salidaCSelected;
var btnUnidadSelected = 0;
var beanRequestSalidaC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestSalidaC.entity_api = 'api/salidas';
    beanRequestSalidaC.operation = 'ventas/paginate';
    beanRequestSalidaC.type_request = 'GET';

    $("#ventanaModalSelectedSalidaC").detach().appendTo("#drawer-agregarSalida");

    $('#FrmSalidaC').submit(function (event) {
        beanRequestSalidaC.operation = 'ventas/paginate';
        beanRequestSalidaC.type_request = 'GET';
        processAjaxSalidaC();
        event.preventDefault();
        event.stopPropagation();
    });

    $('#ventanaModalSelectedSalidaC').on('hidden.bs.modal', function () {
        beanRequestSalidaC.operation = 'ventas/paginate';
        beanRequestSalidaC.type_request = 'GET';
    });

    //$("#addUnidadMedidaHtml").detach().appendTo("#drawer-agregarUnidadMedida");
    /*
    if (document.querySelector('#btnSeleccionarSalida') != undefined) {
      document.querySelector('#btnSeleccionarSalida').onclick = function () {
        if (salidaSelected != undefined) {
          $('#ventanaModalSelectedSalidaC').modal('show');
        } else {
          processAjaxSalidaC();
          $('#ventanaModalSelectedSalidaC').modal('show');
        }
      };
    }
  */

});

function processAjaxSalidaC() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';

    switch (beanRequestSalidaC.operation) {
        default:
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterSalidaC').value
                ).toLowerCase();
            parameters_pagination +=
                '&fechai=' + document.querySelector('#txtFechaIFilterEntrada').value;
            parameters_pagination +=
                '&fechaf=' + document.querySelector('#txtFechaFFilterEntrada').value;
            parameters_pagination +=
                '&page=' + document.querySelector('#pageSalidaC').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageSalidaC').value;
            circleCargando.containerOcultar = $(document.querySelector("#tbodySalidaC"));
            circleCargando.container = $(document.querySelector("#tbodySalidaC").parentElement);
            circleCargando.createLoader();

            break;
    }
    circleCargando.toggleLoader("show");
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestSalidaC,
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
            beanPaginationSalidaC = beanCrudResponse.beanPagination;
            toListSalidaC(beanPaginationSalidaC);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            beanPaginationSalidaC.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationSalidaC.count_filter++;
            toListSalidaC(beanPaginationSalidaC);
        }
    }, false);
}

function toListSalidaC(beanPagination) {
    document.querySelector('#tbodySalidaC').innerHTML = '';
    document.querySelector('#titleManagerSalidaC').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] VENTAS';
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationSalidaC'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterSalidaC').focus();
        return;
    }
    let row;
    row = `
						
    <!-- Widget Item -->
    <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info ">
            <p class="dt-widget__subtitle ">
           FECHA
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info ">
            <p class="dt-widget__subtitle ">
           CANTIDAD
            </p>
        </div>
        <!-- /widget info -->

        <!-- Widget Info -->
        <div class="dt-widget__info text-center">
            <p class="dt-widget__subtitle ">
           MONTO
            </p>
        </div>
        <!-- /widget info -->
    </div>
`;
    beanPagination.list.forEach((salida) => {
        if (salida.idsalida == null) {
            row += `
            <!-- Widget Item -->
            <div class="dt-widget__item mb-0 pb-2 bg-dark text-white">
                <!-- Widget Info -->
                <div class="dt-widget__info ">
                    <p class="dt-widget__subtitle ">
                    TOTAL
                    </p>
                </div>
                <!-- /widget info -->
                <!-- Widget Info -->
                <div class="dt-widget__info ">
                    <p class="dt-widget__subtitle ">
                    ${salida.total}
                    </p>
                </div>
                <!-- /widget info -->

                <!-- Widget Info -->
                <div class="dt-widget__info text-center">
                    <p class="dt-widget__subtitle ">
                    S/. ${numeroConComas(salida.monto)}
                    </p>
                </div>
                <!-- /widget info -->
            </div>
            `;
            return;
        }
        row += `
            <!-- Widget Item -->
            <div class="dt-widget__item mb-0 pb-2">
                <!-- Widget Info -->
                <div class="dt-widget__info ">
                    <p class="dt-widget__subtitle ">
                    ${salida.fecha}
                    </p>
                </div>
                <!-- /widget info -->
                <!-- Widget Info -->
                <div class="dt-widget__info ">
                    <p class="dt-widget__subtitle ">
                    ${salida.total}
                    </p>
                </div>
                <!-- /widget info -->

                <!-- Widget Info -->
                <div class="dt-widget__info text-center">
                    <p class="dt-widget__subtitle ">
                    S/. ${numeroConComas(salida.monto)}
                    </p>
                </div>
                <!-- /widget info -->
            </div>
			`;

    });
    document.querySelector('#tbodySalidaC').innerHTML = row;
    addEventsSalidaCes();
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageSalidaC').value),
        document.querySelector('#pageSalidaC'),
        processAjaxSalidaC, beanRequestSalidaC,
        $('#paginationSalidaC')
    );
    if (beanRequestSalidaC.operation == 'paginate') {
        document.querySelector('#txtFilterSalidaC').focus();
    }


}

function addEventsSalidaCes() {
    document
        .querySelectorAll('.click-selection-salida')
        .forEach(function (element) {
            element.onclick = function () {
                if (this.checked) {
                    for (
                        let index = 0;
                        index < this.parentElement.parentElement.children.length;
                        index++
                    ) {
                        this.parentElement.parentElement.children[
                            index
                        ].children[0].checked = false;
                    }
                    this.checked = true;
                    salidaCSelected = findBySalidaC(
                        this.getAttribute('idsalida')
                    );
                } else {
                    salidaCSelected = undefined;
                }

                if (salidaCSelected != undefined) {
                    switch (btnUnidadSelected) {
                        case 1:
                            salidaIngresoSelected = salidaCSelected;
                            document.querySelector(
                                '#txtSalidaIngresoProducto'
                            ).value = salidaCSelected.nombre.toUpperCase();
                            document.querySelectorAll(
                                '.unidad-medida-1'
                            ).forEach((data) => {
                                data.textContent = salidaCSelected.abreviatura;
                            });
                            break;
                        case 2:
                            salidaSalidaSelected = salidaCSelected;
                            document.querySelector(
                                '#txtSalidaSalidaProducto'
                            ).value = salidaCSelected.nombre.toUpperCase();
                            document.querySelectorAll(
                                '.unidad-medida-2'
                            ).forEach((data) => {
                                data.textContent = salidaCSelected.abreviatura;
                            });
                            break;
                        default:
                            salidaSelected = salidaCSelected;
                            document.querySelector(
                                '#txtSalidaProducto'
                            ).value = salidaCSelected.nombre.toUpperCase();
                            break;
                    }
                    $('#ventanaModalSelectedSalidaC').modal('hide');
                }
            };
        });
}

function findBySalidaC(idsalida) {
    return beanPaginationSalidaC.list.find(
        (salida) => {
            if (parseInt(idsalida) == salida.idsalida) {
                return salida;
            }


        }
    );
}
function validateFormSalida() {
    if (
        limpiar_campo(document.querySelector('#txtNombreSalida').value) == ''
    ) {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenSalida').focus();
        return false;
    }
    return true;
}
