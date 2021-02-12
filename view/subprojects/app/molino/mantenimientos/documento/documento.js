var beanPaginationDocumento;
var documentoSelected;
var comprobanteSelected;
var beanRequestDocumento = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {

    addDocumento();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestDocumento.entity_api = 'api/documentos';
    beanRequestDocumento.operation = 'paginate';
    beanRequestDocumento.type_request = 'GET';

    $('#FrmDocumento').submit(function (event) {
        beanRequestDocumento.operation = 'paginate';
        beanRequestDocumento.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterDocumento').value = limpiar_campo(
            document.querySelector('#txtFilterDocumento').value
        );
        processAjaxDocumento();
    });

    $('#FrmDocumentoModal').submit(function (event) {

        if (validateFormDocumento()) {
            processAjaxDocumento();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxDocumento();

    $('#sizePageDocumento').change(function () {
        processAjaxDocumento();
    });


    $('#FechaDocumento').datetimepicker({
        format: 'DD/MM/YYYY',
        defaultDate: new Date(),
        locale: 'es',
        icons: calIcons

    });

    document.querySelector("#btnAbrirNewDocumento").onclick = () => {
        beanRequestDocumento.operation = 'add';
        beanRequestDocumento.type_request = 'POST';
        //SET TITLE MODAL
        //SET TITLE MODAL
        document.querySelector('#TituloModalDocumento').innerHTML =
            'REGISTRAR DOCUMENTO';
        addDocumento();
        $("#addDocumentoHtml").modal("show");
    };



});
function addDocumento(documento = undefined) {
    //LIMPIAR LOS CAMPOS
    comprobanteSelected = (documento == undefined) ? undefined : documento.comprobante;
    document.querySelector('#txtComprobante').value = (documento == undefined) ? '' : comprobanteSelected.nombre;
    document.querySelector('#txtFechaDocumento').value = (documento == undefined) ? getDateJava() : documento.fecha;
    document.querySelector('#txtSerieDocumento').value = (documento == undefined) ? '' : documento.serie;
    document.querySelector('#txtNumeroInicialDocumento').value = (documento == undefined) ? '1' : documento.numero_inicial;
    document.querySelector('#txtNumeroFinalDocumento').value = (documento == undefined) ? '100' : documento.numero_final;
    document.querySelector('#txtNumeroActualDocumento').value = (documento == undefined) ? '0' : documento.numero_actual;

}

function processAjaxDocumento() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestDocumento.operation == 'update' ||
        beanRequestDocumento.operation == 'add'
    ) {
        json = {
            comprobante: comprobanteSelected,
            fecha: document.querySelector('#txtFechaDocumento').value,
            serie: document.querySelector('#txtSerieDocumento').value.trim(),
            numero_inicial: document.querySelector('#txtNumeroInicialDocumento').value.trim(),
            numero_final: document.querySelector('#txtNumeroFinalDocumento').value.trim(),
            numero_actual: document.querySelector('#txtNumeroActualDocumento').value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmDocumentoModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmDocumentoModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyDocumento").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyDocumento").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestDocumento.operation) {
        case 'delete':
            parameters_pagination = '/' + documentoSelected.iddocumento;
            break;

        case 'update':
            json.iddocumento = documentoSelected.iddocumento;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterDocumento').value != '') {
                document.querySelector('#pageDocumento').value = 1;
            }
            parameters_pagination +=
                '?tipo=0';
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterDocumento').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageDocumento').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageDocumento').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestDocumento,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestDocumento.operation == "delete") {
                    eliminarlistDocumento(documentoSelected.iddocumento);
                    toListDocumento(beanPaginationDocumento);
                }
                $("#addDocumentoHtml").modal("hide");
                notifyUser('Acción realizada exitosamente.');

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationDocumento = beanCrudResponse.beanPagination;
            toListDocumento(beanPaginationDocumento);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestDocumento.operation == 'update') {
                updatelistDocumento(beanCrudResponse.classGeneric);
                toListDocumento(beanPaginationDocumento);
                return;
            }
            beanPaginationDocumento.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationDocumento.count_filter++;
            toListDocumento(beanPaginationDocumento);
        }

    }, false);
}

function toListDocumento(beanPagination) {
    document.querySelector('#tbodyDocumento').innerHTML = '';
    document.querySelector('#titleManagerDocumento').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] DOCUMENTO';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               FECHA EMISIÓN
            </p>
            
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               ESTADO
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               COMPROBANTE
            </p>
        </div>
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               SERIE
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               NÚMERO INICIAL
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               NÚMERO FINAL
            </p>
        </div>
        <!-- /widget info -->
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               NÚMERO ACTUAL
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Extra -->
        <div class="dt-widget__extra">
          <div class="dt-task" style="min-width: 45px;">
            <div class="dt-task__redirect">
              ACCIONES
            </div>
          </div>
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationDocumento'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterDocumento').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY DOCUMENTOS
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyDocumento').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyDocumento').innerHTML += row;
    beanPagination.list.forEach((documento) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >
            <!-- Widget Info -->
            <div class="dt-widget__info text-truncate">
              <p class="dt-widget__subtitle text-truncate">
              ${documento.fecha}
              </p>
            </div>
            <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${tipoEstadoDocumento(documento.estado)}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${documento.comprobante.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${documento.serie}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${documento.numero_inicial}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${documento.numero_final}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${documento.numero_actual}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
              <div class="dt-task" style="min-width: 75px;">
              <div class="dt-task__redirect">
                          <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  iddocumento='${documento.iddocumento}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-documento"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-documento" iddocumento='${documento.iddocumento}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Eliminar</em>"
                  >
                    <i class="icon icon-trash icon-sm pulse-danger"></i>
                  </button>
                          </div>
                          <!-- /action button group -->
                        </div>
                        </div>
                        <!-- /hide content -->
                      </div>

            </div>
            <!-- /widgets item -->
            `;
        document.querySelector('#tbodyDocumento').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    addEventsDocumentos();

    beanRequestDocumento.operation = 'paginate';
    beanRequestDocumento.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageDocumento').value),
        document.querySelector('#pageDocumento'),
        processAjaxDocumento, beanRequestDocumento,
        $('#paginationDocumento')
    );

    if (beanRequestDocumento.operation == 'paginate') {
        document.querySelector('#txtFilterDocumento').focus();
    }

}

function addEventsDocumentos() {
    document.querySelectorAll('.editar-documento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            documentoSelected = findByDocumento(
                btn.getAttribute('iddocumento')
            );
            if (documentoSelected != undefined) {
                addDocumento(documentoSelected);
                document.querySelector('#TituloModalDocumento').innerHTML =
                    'EDITAR DOCUMENTO';

                beanRequestDocumento.operation = 'update';
                beanRequestDocumento.type_request = 'PUT';
                $("#addDocumentoHtml").modal("show");
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-documento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            documentoSelected = findByDocumento(
                btn.getAttribute('iddocumento')
            );
            if (documentoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder eliminar'
                );
            beanRequestDocumento.operation = 'delete';
            beanRequestDocumento.type_request = 'DELETE';
            processAjaxDocumento();
        };
    });
}


function validateFormDocumento() {

    if (document.querySelector('#txtFechaDocumento').value == "") {
        showAlertTopEnd(
            'info',
            'Por favor ingrese Fecha');
        return false;
    }

    let numero = numero_campo(
        document.querySelector('#txtNumeroInicialDocumento'),
        document.querySelector('#txtNumeroFinalDocumento'),
        document.querySelector('#txtNumeroActualDocumento')
    );

    if (numero != undefined) {
        numero.focus();
        numero.labels[0].style.fontWeight = '600';
        addClass(numero.labels[0], 'text-danger');
        if (numero.value == '') {
            showAlertTopEnd('info', 'Por favor ingrese ' + numero.labels[0].innerText);
        } else {
            showAlertTopEnd(
                'info',
                'Por favor ingrese solo Letras al campo ' + numero.labels[0].innerText
            );
        }

        return false;
    }

    let letra = letra_numero_campo(
        document.querySelector('#txtSerieDocumento')
    );

    if (letra != undefined) {
        letra.focus();
        letra.labels[0].style.fontWeight = '600';
        addClass(letra.labels[0], 'text-danger');
        if (letra.value == '') {
            showAlertTopEnd('info', 'Por favor ingrese ' + letra.labels[0].innerText);
        } else {
            showAlertTopEnd(
                'info',
                'Por favor ingrese solo Letras al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }
    if (comprobanteSelected == undefined) {
        showAlertTopEnd(
            'info',
            'Por favor ingrese Comprobante'
        );
        return false;
    }

    return true;
}
function eliminarlistDocumento(idbusqueda) {
    beanPaginationDocumento.count_filter--;
    beanPaginationDocumento.list.splice(findIndexDocumento(parseInt(idbusqueda)), 1);
}

function updatelistDocumento(classBean) {
    beanPaginationDocumento.list.splice(findIndexDocumento(classBean.iddocumento), 1, classBean);
}

function findIndexDocumento(idbusqueda) {
    return beanPaginationDocumento.list.findIndex(
        (documento) => {
            if (documento.iddocumento == parseInt(idbusqueda))
                return documento;


        }
    );
}
function findByDocumento(iddocumento) {
    return beanPaginationDocumento.list.find(
        (documento) => {
            if (parseInt(iddocumento) == documento.iddocumento) {
                return documento;
            }


        }
    );
}
function tipoEstadoDocumento(key) {
    switch (parseInt(key)) {
        case 1:
            return '<span class="badge badge-pill badge-success mb-1 mr-1">Con Stock</span>';
        default:
            return '<span class="badge badge-pill badge-danger mb-1 mr-1">Agotado</span>';

    }
}