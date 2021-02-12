/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationAlmacenC;
var almacenCSelected;
var beanRequestAlmacenC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestAlmacenC.entity_api = 'api/almacenes';
    beanRequestAlmacenC.operation = 'paginate';
    beanRequestAlmacenC.type_request = 'GET';
    /*ALMACEN ADD*/
    if (document.getElementById('addAlmacenHtml') != undefined) {
        removeClass(document.getElementById('addAlmacenHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
        addClass(document.getElementById('addAlmacenHtml'), 'modal fade');
        document.getElementById('addAlmacenHtml').style.zIndex = '1070';
        document.getElementById('addAlmacenHtml').style.backgroundColor =
            '#1312129e';
        removeClass(
            document.getElementById('addAlmacenHtml').firstChild.nextElementSibling,
            'h-100'
        );
        addClass(
            document.getElementById('addAlmacenHtml').firstChild.nextElementSibling,
            'modal-dialog modal-sm modal-dialog-centered'
        );

        addClass(
            document.getElementById('addAlmacenHtml').firstChild.nextElementSibling
                .firstChild.nextElementSibling,
            'modal-content dt-social-card animate-slide border border-w-2 border-indigo p-4'
        );
        /* AGREGAR BOTON X PARA CERRAR */
        let parrafo = document.createElement('div');
        let row = `
		<button type="button" class="close" data-dismiss="modal" aria-label="Close">
		<span aria-hidden="true">×</span>
		</button>
		`;

        parrafo.innerHTML = row;
        document
            .getElementById('addAlmacenHtml')
            .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
                parrafo
            );
        document.getElementById('FrmAlmacenModal').onsubmit = (event) => {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestAlmacenC.operation = 'add';
            beanRequestAlmacenC.type_request = 'POST';

            if (validateFormAlmacen()) {
                processAjaxAlmacenC();
            }
            event.preventDefault();
            event.stopPropagation();
        };

    }


    document.querySelector('#btnSelecionarNewAlmacenc').onclick = function () {
        $('#addAlmacenHtml').modal('show');
    };


    /* */

    $('#FrmAlmacenC').submit(function (event) {
        beanRequestAlmacenC.operation = 'paginate';
        beanRequestAlmacenC.type_request = 'GET';
        processAjaxAlmacenC();
        event.preventDefault();
        event.stopPropagation();
    });

    $('#ventanaModalSelectedAlmacenC').on('hidden.bs.modal', function () {
        beanRequestAlmacenC.operation = 'paginate';
        beanRequestAlmacenC.type_request = 'GET';
    });

    if (document.querySelector('#btnSeleccionarAlmacenOtro') != undefined) {
        document.querySelector('#btnSeleccionarAlmacenOtro').onclick = function () {
            tipoAlmacenSelected = 2;
            if (almacenSelectedOtro != undefined) {
                $('#ventanaModalSelectedAlmacenC').modal('show');
            } else {
                processAjaxAlmacenC();
                $('#ventanaModalSelectedAlmacenC').modal('show');
            }
        };
        document.querySelector('#btnSeleccionarAlmacen').onclick = function () {
            tipoAlmacenSelected = 1;
            if (almacenSelected != undefined) {
                $('#ventanaModalSelectedAlmacenC').modal('show');
            } else {
                processAjaxAlmacenC();
                $('#ventanaModalSelectedAlmacenC').modal('show');
            }
        };

    } else {
        document.querySelector('#btnSeleccionarAlmacen').onclick = function () {
            if (almacenSelected != undefined) {
                $('#ventanaModalSelectedAlmacenC').modal('show');
            } else {
                processAjaxAlmacenC();
                $('#ventanaModalSelectedAlmacenC').modal('show');
            }
        };
    }
});

function processAjaxAlmacenC() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';

    switch (beanRequestAlmacenC.operation) {
        case 'add':
            json = {
                nombre: document
                    .querySelector('#txtNombreAlmacen')
                    .value.toUpperCase()
            };
            circleCargando.container = $(document.querySelector("#FrmAlmacenModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmAlmacenModal"));
            circleCargando.createLoader();
            break;

        default:
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(document.querySelector('#txtFilterAlmacenC').value)
                    .toLowerCase();
            parameters_pagination += '&page=1&size=5';
            circleCargando.containerOcultar = $(document.querySelector("#tbodyAlmacenC"));
            circleCargando.container = $(document.querySelector("#tbodyAlmacenC").parentElement);
            circleCargando.createLoader();

            break;
    }
    circleCargando.toggleLoader("show");
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestAlmacenC,
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
            beanPaginationAlmacenC = beanCrudResponse.beanPagination;
            toListAlmacenC(beanPaginationAlmacenC);
        }
    }, false);
}

function toListAlmacenC(beanPagination) {
    document.querySelector('#tbodyAlmacenC').innerHTML = '';
    document.querySelector('#titleManagerAlmacenC').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] ALMACENES';
    if (beanPagination.count_filter == 0) {
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterAlmacenC').focus();
        return;
    }
    let row;
    beanPagination.list.forEach((almacen) => {
        row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-almacen form-control form-control-sm " type="checkbox" idalmacen="${almacen.idalmacen}">
                                <label class="dt-checkbox-content" for="${almacen.idalmacen}">${getStringCapitalize(almacen.nombre)}
                                <span class="dt-separator-v">&nbsp;</span>
                                <span>${almacen.establecimiento.nombre}</span>
                                </label>
                            </div>
                            <!-- /tasks -->
			`;
        document.querySelector('#tbodyAlmacenC').innerHTML += row;
    });

    addEventsAlmacenCes();
    if (beanRequestAlmacenC.operation == 'paginate') {
        document.querySelector('#txtFilterAlmacenC').focus();
    }
    $('[data-toggle="tooltip"]').tooltip();

}

function addEventsAlmacenCes() {
    document
        .querySelectorAll('.click-selection-almacen')
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
                    almacenCSelected = findByAlmacenC(
                        this.getAttribute('idalmacen')
                    );
                } else {
                    almacenCSelected = undefined;
                }

                if (almacenCSelected != undefined) {


                    if (document.querySelector(
                        '#btnSeleccionarAlmacenOtro'
                    ) != undefined) {
                        switch (parseInt(tipoAlmacenSelected)) {
                            case 1:
                                almacenSelected = almacenCSelected;
                                document.querySelector('#txtAlmacenUbicacionProducto').value = getStringCapitalize(almacenSelected.nombre);
                                break;
                            case 2:
                                almacenSelectedOtro = almacenCSelected;
                                document.querySelector('#txtAlmacenUbicacionProductoOtro').value = getStringCapitalize(almacenSelectedOtro.nombre);
                                break;

                            default:
                                break;
                        }
                    } else {
                        almacenSelected = almacenCSelected;
                        document.querySelector('#txtAlmacenUbicacionProducto').value = almacenCSelected.nombre.toUpperCase();
                    }


                    $('#ventanaModalSelectedAlmacenC').modal('hide');
                }
            };
        });
}

function findByAlmacenC(idalmacen) {
    let almacen_;
    beanPaginationAlmacenC.list.forEach((almacen) => {
        if (parseInt(idalmacen) == parseInt(almacen.idalmacen)) {
            almacen_ = almacen;
            return;
        }
    });
    return almacen_;
}
function validateFormAlmacen() {
    if (
        limpiar_campo(document.querySelector('#txtNombreAlmacen').value) == ''
    ) {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenAlmacen').focus();
        return false;
    }
    return true;
}
