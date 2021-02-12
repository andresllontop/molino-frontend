/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationClienteC;
var clienteCSelected;
var beanRequestClienteC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestClienteC.entity_api = 'api/clientes';
    beanRequestClienteC.operation = 'paginate';
    beanRequestClienteC.type_request = 'GET';
    /*CLIENTE ADD*/
    if (document.getElementById('addClienteHtml') != undefined) {
        removeClass(document.getElementById('addClienteHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
        addClass(document.getElementById('addClienteHtml'), 'modal fade');
        document.getElementById('addClienteHtml').style.zIndex = '1070';
        document.getElementById('addClienteHtml').style.backgroundColor =
            '#1312129e';
        removeClass(
            document.getElementById('addClienteHtml').firstChild.nextElementSibling,
            'h-100'
        );
        addClass(
            document.getElementById('addClienteHtml').firstChild.nextElementSibling,
            'modal-dialog modal-sm modal-dialog-centered'
        );

        addClass(
            document.getElementById('addClienteHtml').firstChild.nextElementSibling
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
            .getElementById('addClienteHtml')
            .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
                parrafo
            );
        document.getElementById('FrmClienteModal').onsubmit = (event) => {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestClienteC.operation = 'add';
            beanRequestClienteC.type_request = 'POST';

            if (validateFormCliente()) {
                processAjaxClienteC();
            }
            event.preventDefault();
            event.stopPropagation();
        };

    }


    document.querySelector('#btnSelecionarNewClientec').onclick = function () {
        $('#addClienteHtml').modal('show');
    };


    /* */

    $('#FrmClienteC').submit(function (event) {
        beanRequestClienteC.operation = 'paginate';
        beanRequestClienteC.type_request = 'GET';
        processAjaxClienteC();
        event.preventDefault();
        event.stopPropagation();
    });

    $('#ventanaModalSelectedClienteC').on('hidden.bs.modal', function () {
        beanRequestClienteC.operation = 'paginate';
        beanRequestClienteC.type_request = 'GET';
    });



    if (document.querySelector('#btnSeleccionarClienteOtro') != undefined) {
        document.querySelector('#btnSeleccionarClienteOtro').onclick = function () {
            tipoClienteSelected = 2;
            if (clienteSelectedOtro != undefined) {
                $('#ventanaModalSelectedClienteC').modal('show');
            } else {
                processAjaxClienteC();
                $('#ventanaModalSelectedClienteC').modal('show');
            }
        };
        document.querySelector('#btnSeleccionarCliente').onclick = function () {
            tipoClienteSelected = 1;
            if (clienteSelected != undefined) {
                $('#ventanaModalSelectedClienteC').modal('show');
            } else {
                processAjaxClienteC();
                $('#ventanaModalSelectedClienteC').modal('show');
            }
        };

    } else {
        document.querySelector('#btnSeleccionarCliente').onclick = function () {
            if (clienteSelected != undefined) {
                $('#ventanaModalSelectedClienteC').modal('show');
            } else {
                processAjaxClienteC();
                $('#ventanaModalSelectedClienteC').modal('show');
            }
        };
    }
    if (document.querySelector('#btnSeleccionarClienteFilter') != undefined) {
        document.querySelector('#btnSeleccionarClienteFilter').onclick = function () {
            if (clienteSelected != undefined) {
                $('#ventanaModalSelectedClienteC').modal('show');
            } else {
                processAjaxClienteC();
                $('#ventanaModalSelectedClienteC').modal('show');
            }
        };
    }

});

function processAjaxClienteC() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");


    let parameters_pagination = '';
    let json = '';

    switch (beanRequestClienteC.operation) {
        case 'add':
            json = {
                nombre: document
                    .querySelector('#txtNombreCliente')
                    .value.toUpperCase()
            };
            circleCargando.container = $(document.querySelector("#FrmClienteModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmClienteModal"));
            circleCargando.createLoader();
            break;

        default:
            parameters_pagination +=
                '?tipo_cliente=1&nombre=' +
                limpiar_campo(document.querySelector('#txtFilterClienteC').value)
                    .toLowerCase();
            parameters_pagination += '&page=1&size=5';
            circleCargando.containerOcultar = $(document.querySelector("#tbodyClienteC"));
            circleCargando.container = $(document.querySelector("#tbodyClienteC").parentElement);
            circleCargando.createLoader();

            break;
    }
    circleCargando.toggleLoader("show");
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestClienteC,
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
            beanPaginationClienteC = beanCrudResponse.beanPagination;
            toListClienteC(beanPaginationClienteC);
        }
    }, false);
}

function toListClienteC(beanPagination) {
    document.querySelector('#tbodyClienteC').innerHTML = '';
    document.querySelector('#titleManagerClienteC').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] CLIENTES';
    if (beanPagination.count_filter > 0) {
        let row;
        beanPagination.list.forEach((cliente) => {
            row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-cliente form-control form-control-sm " type="checkbox" idcliente="${cliente.idcliente}">
                                <label class="dt-checkbox-content" for="${cliente.idcliente}">${cliente.documento + " - " + getStringCapitalize(cliente.nombre)}</label>
                            </div>
                            <!-- /tasks -->
			`;
            document.querySelector('#tbodyClienteC').innerHTML += row;
        });

        addEventsClienteCes();
        if (beanRequestClienteC.operation == 'paginate') {
            document.querySelector('#txtFilterClienteC').focus();
        }
        $('[data-toggle="tooltip"]').tooltip();
    } else {
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterClienteC').focus();
    }
}

function addEventsClienteCes() {
    document
        .querySelectorAll('.click-selection-cliente')
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
                    clienteCSelected = findByClienteC(
                        this.getAttribute('idcliente')
                    );
                } else {
                    clienteCSelected = undefined;
                }

                if (clienteCSelected != undefined) {


                    if (document.querySelector(
                        '#btnSeleccionarClienteOtro'
                    ) != undefined) {

                        switch (parseInt(tipoClienteSelected)) {
                            case 1:
                                clienteSelected = clienteCSelected;
                                document.querySelector('#txtClienteUbicacionProducto').value = getStringCapitalize(clienteSelected.nombre);
                                break;
                            case 2:
                                clienteSelectedOtro = clienteCSelected;
                                document.querySelector('#txtClienteUbicacionProductoOtro').value = getStringCapitalize(clienteSelectedOtro.nombre);
                                break;

                            default:
                                break;
                        }


                    } else {
                        clienteSelected = clienteCSelected;
                        document.querySelector(
                            '#txtClienteUbicacionProducto'
                        ).value = getStringCapitalize(clienteCSelected.nombre);

                    }




                    if (document.querySelector(
                        '#txtClienteUbicacionProductoFilter'
                    ) != undefined) {
                        document.querySelector(
                            '#txtClienteUbicacionProductoFilter'
                        ).value = getStringCapitalize(clienteCSelected.nombre);
                    }
                    /*ubicacion de producto en almacen
                    if (document.querySelector('#pageClienteProducto') != null) {
                      document.querySelector('#pageClienteProducto').value = 1;
                      beanRequestClienteProducto.operation = 'cliente/paginate';
                      beanRequestClienteProducto.type_request = 'GET';
                      processAjaxClienteProducto();
          
                    }
          */
                    $('#ventanaModalSelectedClienteC').modal('hide');
                    if (document.querySelector('#FrmPresentacionC') != undefined) {
                        document.querySelector('#FrmPresentacionC').dispatchEvent(new Event('submit'));
                    }

                }
            };
        });
}

function findByClienteC(idcliente) {
    let cliente_;
    beanPaginationClienteC.list.forEach((cliente) => {
        if (parseInt(idcliente) == parseInt(cliente.idcliente)) {
            cliente_ = cliente;
            return;
        }
    });
    return cliente_;
}
function validateFormCliente() {
    if (
        limpiar_campo(document.querySelector('#txtNombreCliente').value) == ''
    ) {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenCliente').focus();
        return false;
    }
    return true;
}
