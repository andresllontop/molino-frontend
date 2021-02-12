/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var beanPaginationProductoC;
var productoCSelected;
var beanRequestProductoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestProductoC.entity_api = 'api/productos';
    beanRequestProductoC.operation = 'paginate';
    beanRequestProductoC.type_request = 'GET';
    /*PRODUCTO ADD*/
    if (document.getElementById('addProductoHtml') != undefined) {
        removeClass(document.getElementById('addProductoHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
        addClass(document.getElementById('addProductoHtml'), 'modal fade');
        document.getElementById('addProductoHtml').style.zIndex = '1070';
        document.getElementById('addProductoHtml').style.backgroundColor =
            '#1312129e';
        removeClass(
            document.getElementById('addProductoHtml').firstChild.nextElementSibling,
            'h-100'
        );
        addClass(
            document.getElementById('addProductoHtml').firstChild.nextElementSibling,
            'modal-dialog modal-sm modal-dialog-centered'
        );

        addClass(
            document.getElementById('addProductoHtml').firstChild.nextElementSibling
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
            .getElementById('addProductoHtml')
            .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
                parrafo
            );
        document.getElementById('FrmProductoModal').onsubmit = (event) => {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestProductoC.operation = 'add';
            beanRequestProductoC.type_request = 'POST';

            if (validateFormProducto()) {
                processAjaxProductoC();
            }
            event.preventDefault();
            event.stopPropagation();
        };

    }

    /*
        document.querySelector('#btnSelecionarNewProductoc').onclick = function () {
            $('#addProductoHtml').modal('show');
        };
    */


    /* */

    $('#FrmProductoC').submit(function (event) {
        beanRequestProductoC.operation = 'paginate';
        beanRequestProductoC.type_request = 'GET';
        processAjaxProductoC();
        event.preventDefault();
        event.stopPropagation();
    });

    $('#ventanaModalSelectedProductoC').on('hidden.bs.modal', function () {
        beanRequestProductoC.operation = 'paginate';
        beanRequestProductoC.type_request = 'GET';
    });

    if (document.querySelector('#btnSeleccionarProductoOtro') != undefined) {
        document.querySelector('#btnSeleccionarProductoOtro').onclick = function () {
            tipoProductoSelected = 2;
            if (productoSelectedOtro != undefined) {
                $('#ventanaModalSelectedProductoC').modal('show');
            } else {
                processAjaxProductoC();
                $('#ventanaModalSelectedProductoC').modal('show');
            }
        };
        document.querySelector('#btnSeleccionarProducto').onclick = function () {
            tipoProductoSelected = 1;
            if (productoSelected != undefined) {
                $('#ventanaModalSelectedProductoC').modal('show');
            } else {
                processAjaxProductoC();
                $('#ventanaModalSelectedProductoC').modal('show');
            }
        };

    } else {
        document.querySelector('#btnSeleccionarProducto').onclick = function () {
            if (productoSelected != undefined) {
                $('#ventanaModalSelectedProductoC').modal('show');
            } else {
                processAjaxProductoC();
                $('#ventanaModalSelectedProductoC').modal('show');
            }
        };
    }

});

function processAjaxProductoC() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");


    let parameters_pagination = '';
    let json = '';

    switch (beanRequestProductoC.operation) {
        case 'add':
            json = {
                nombre: document
                    .querySelector('#txtNombreProducto')
                    .value.toUpperCase()
            };
            circleCargando.container = $(document.querySelector("#FrmProductoModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmProductoModal"));
            circleCargando.createLoader();
            break;

        default:
            parameters_pagination +=
                '?tipo_producto=1&nombre=' +
                limpiar_campo(document.querySelector('#txtFilterProductoC').value)
                    .toLowerCase();
            parameters_pagination += '&page=1&size=5';
            circleCargando.containerOcultar = $(document.querySelector("#tbodyProductoC"));
            circleCargando.container = $(document.querySelector("#tbodyProductoC").parentElement);
            circleCargando.createLoader();

            break;
    }
    circleCargando.toggleLoader("show");
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestProductoC,
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
            beanPaginationProductoC = beanCrudResponse.beanPagination;
            toListProductoC(beanPaginationProductoC);
        }
    }, false);
}

function toListProductoC(beanPagination) {
    document.querySelector('#tbodyProductoC').innerHTML = '';
    document.querySelector('#titleManagerProductoC').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] PRODUCTOS';
    if (beanPagination.count_filter > 0) {
        let row;
        beanPagination.list.forEach((producto) => {
            row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-producto form-control form-control-sm " type="checkbox" idproducto="${producto.idproducto}">
                                <label class="dt-checkbox-content" for="${producto.idproducto}">${producto.nombre}</label>
                            </div>
                            <!-- /tasks -->
			`;
            document.querySelector('#tbodyProductoC').innerHTML += row;
        });

        addEventsProductoCes();
        if (beanRequestProductoC.operation == 'paginate') {
            document.querySelector('#txtFilterProductoC').focus();
        }
        $('[data-toggle="tooltip"]').tooltip();
    } else {
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterProductoC').focus();
    }
}

function addEventsProductoCes() {
    document
        .querySelectorAll('.click-selection-producto')
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
                    productoCSelected = findByProductoC(
                        this.getAttribute('idproducto')
                    );
                } else {
                    productoCSelected = undefined;
                }

                if (productoCSelected != undefined) {

                    if (document.querySelector(
                        '#btnSeleccionarProductoOtro'
                    ) != undefined) {
                        switch (parseInt(tipoProductoSelected)) {
                            case 1:
                                productoSelected = productoCSelected;
                                document.querySelector('#txtProducto').value = getStringCapitalize(productoSelected.nombre);
                                break;
                            case 2:
                                productoSelectedOtro = productoCSelected;
                                document.querySelector('#txtProductoOtro').value = getStringCapitalize(productoSelectedOtro.nombre);
                                break;

                            default:
                                break;
                        }
                    } else {
                        productoSelected = productoCSelected;
                        document.querySelector('#txtProducto').value = productoSelected.nombre.toUpperCase();
                    }
                    $('#ventanaModalSelectedProductoC').modal('hide');

                }
            };
        });
}

function findByProductoC(idproducto) {
    let producto_;
    beanPaginationProductoC.list.forEach((producto) => {
        if (parseInt(idproducto) == parseInt(producto.idproducto)) {
            producto_ = producto;
            return;
        }
    });
    return producto_;
}
function validateFormProducto() {
    if (
        limpiar_campo(document.querySelector('#txtNombreProducto').value) == ''
    ) {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenProducto').focus();
        return false;
    }
    return true;
}
