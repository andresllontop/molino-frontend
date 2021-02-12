
var beanPaginationDocumentoC;
var documentoCSelected;
var beanRequestDocumentoC = new BeanRequest();

document.addEventListener('DOMContentLoaded', function () {
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestDocumentoC.entity_api = 'api/documentos';
    beanRequestDocumentoC.operation = 'paginate';
    beanRequestDocumentoC.type_request = 'GET';
    /*UNIDAD DE MEDIDA ADD
  
    removeClass(document.getElementById('addDocumentoHtml'), 'col-xl-4 col-sm-4 p-1 order-xl-1 order-sm-1');
    addClass(document.getElementById('addDocumentoHtml'), 'modal fade');
    document.getElementById('addDocumentoHtml').style.zIndex = '1070';
    document.getElementById('addDocumentoHtml').style.backgroundColor =
      '#1312129e';
    removeClass(
      document.getElementById('addDocumentoHtml').firstChild.nextElementSibling,
      'h-100'
    );
    addClass(
      document.getElementById('addDocumentoHtml').firstChild.nextElementSibling,
      'modal-dialog modal-sm modal-dialog-centered'
    );
  
    addClass(
      document.getElementById('addDocumentoHtml').firstChild.nextElementSibling
        .firstChild.nextElementSibling,
      'modal-content dt-social-card animate-slide border border-w-2 border-indigo p-4'
    );*/
    /* AGREGAR BOTON X PARA CERRAR 
    let parrafo = document.createElement('div');
    let row = `
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">×</span>
          </button>
          `;
  
    parrafo.innerHTML = row;
    document
      .getElementById('addDocumentoHtml')
      .firstChild.nextElementSibling.firstChild.nextElementSibling.firstChild.nextElementSibling.appendChild(
        parrafo
      );*/
    /* /AGREGAR BOTON X PARA CERRAR 
    document.querySelector('#btnSelecionarNewDocumentoc').onclick = function () {
      $('#addDocumentoHtml').modal('show');
    };
  
    document.getElementById('FrmDocumentoModal').onsubmit = (event) => {
      //CONFIGURAMOS LA SOLICITUD
      beanRequestDocumentoC.operation = 'add';
      beanRequestDocumentoC.type_request = 'POST';
  
      if (validateFormDocumento()) {
        processAjaxDocumentoC();
      }
      event.preventDefault();
      event.stopPropagation();
    };
  */
    /* */

    $('#FrmDocumentoC').submit(function (event) {
        beanRequestDocumentoC.operation = 'paginate';
        beanRequestDocumentoC.type_request = 'GET';
        processAjaxDocumentoC();
        event.preventDefault();
        event.stopPropagation();
    });

    $('#ventanaModalSelectedDocumentoC').on('hidden.bs.modal', function () {
        beanRequestDocumentoC.operation = 'paginate';
        beanRequestDocumentoC.type_request = 'GET';
    });
    if (document.querySelector('#btnSeleccionarDocumento') != undefined) {
        document.querySelector('#btnSeleccionarDocumento').onclick = function () {
            if (documentoSelected != undefined) {
                $('#ventanaModalSelectedDocumentoC').modal('show');
            } else {
                processAjaxDocumentoC();
                $('#ventanaModalSelectedDocumentoC').modal('show');
            }
        };
    }


});

function processAjaxDocumentoC() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';

    switch (beanRequestDocumentoC.operation) {
        case 'add':
            json = {
                nombre: document
                    .querySelector('#txtNombreDocumento')
                    .value.toUpperCase(),
                abreviatura: document
                    .querySelector('#txtAbreviaturaDocumento')
                    .value.trim()
            };
            circleCargando.container = $(document.querySelector("#FrmDocumentoModal").parentElement);
            circleCargando.containerOcultar = $(document.querySelector("#FrmDocumentoModal"));
            circleCargando.createLoader();
            break;

        default:
            parameters_pagination +=
                '?tipo=0&nombre=' +
                limpiar_campo(document.querySelector('#txtFilterDocumentoC').value)
                    .toLowerCase();
            parameters_pagination += '&page=1&size=5';
            circleCargando.containerOcultar = $(document.querySelector("#tbodyDocumentoC"));
            circleCargando.container = $(document.querySelector("#tbodyDocumentoC").parentElement);
            circleCargando.createLoader();

            break;
    }
    circleCargando.toggleLoader("show");
    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestDocumentoC,
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
            beanPaginationDocumentoC = beanCrudResponse.beanPagination;
            toListDocumentoC(beanPaginationDocumentoC);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            beanPaginationDocumentoC.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationDocumentoC.count_filter++;
            toListDocumentoC(beanPaginationDocumentoC);
        }
    }, false);
}

function toListDocumentoC(beanPagination) {

    document.querySelector('#tbodyDocumentoC').innerHTML = '';
    document.querySelector('#titleManagerDocumentoC').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] DOCUMENTOS';
    if (beanPagination.count_filter > 0) {

        let row;
        beanPagination.list.forEach((documento) => {
            row = `
						<!-- Tasks -->
                            <div class="dt-checkbox dt-checkbox-todo pb-2 pt-2 row-selected-celeste-claro" >
                                <input class="click-selection-documento form-control form-control-sm " type="checkbox" iddocumento="${documento.iddocumento}">
                                <label class="dt-checkbox-content" for="${documento.iddocumento}">
                                <span>${documento.comprobante.nombre}<span>
                                <span>${documento.serie}<span>
                                <span>${tipoEstadoDocumento(documento.estado)}<span>
                                </label>
                            </div>
                            <!-- /tasks -->
			`;
            document.querySelector('#tbodyDocumentoC').innerHTML += row;
        });

        addEventsDocumentoCes();
        if (beanRequestDocumentoC.operation == 'paginate') {
            document.querySelector('#txtFilterDocumentoC').focus();
        }

    } else {
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterDocumentoC').focus();
    }
}

function addEventsDocumentoCes() {
    document
        .querySelectorAll('.click-selection-documento')
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
                    documentoCSelected = findByDocumentoC(
                        this.getAttribute('iddocumento')
                    );
                } else {
                    documentoCSelected = undefined;
                }

                if (documentoCSelected != undefined) {
                    documentoSelected = documentoCSelected;
                    if (documentoSelected.numero_actual == documentoSelected.numero_final) {
                        documentoSelected = undefined;
                        showAlertTopEnd('warning', 'No cuenta con Documentos en Stock');
                        return;
                    }

                    document.querySelector(
                        '#txtDocumentoProducto'
                    ).value = documentoCSelected.serie;
                    document.querySelector(
                        '#txtNumeroDocumento'
                    ).value = (documentoCSelected.numero_actual + 1);

                    $('#ventanaModalSelectedDocumentoC').modal('hide');

                }
            };
        });
}

function findByDocumentoC(iddocumento) {
    return beanPaginationDocumentoC.list.find(
        (documento) => {
            if (parseInt(iddocumento) == documento.iddocumento) {
                return documento;
            }


        }
    );
}
function validateFormDocumento() {
    if (
        limpiar_campo(document.querySelector('#txtNombreDocumento').value) == ''
    ) {
        showAlertTopEnd('warning', 'Por favor ingrese nombre');
        document.querySelector('#txtNombrenDocumento').focus();
        return false;
    }
    return true;
}
function tipoEstadoDocumento(key) {
    switch (parseInt(key)) {
        case 1:
            return '<span class="badge badge-pill badge-success mb-1 mr-1">Con Stock</span>';
        default:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1">Agotado</span>';

    }
}