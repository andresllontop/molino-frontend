var beanPaginationComprobante;
var comprobanteSelected;
var metodo = false;
var beanRequestComprobante = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addComprobanteHtml").detach().appendTo("#drawer-agregarComprobante");
    addComprobante();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestComprobante.entity_api = 'api/comprobantes';
    beanRequestComprobante.operation = 'paginate';
    beanRequestComprobante.type_request = 'GET';

    $('#FrmComprobante').submit(function (event) {
        beanRequestComprobante.operation = 'paginate';
        beanRequestComprobante.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterComprobante').value = limpiar_campo(
            document.querySelector('#txtFilterComprobante').value
        );
        processAjaxComprobante();
    });

    $('#FrmComprobanteModal').submit(function (event) {
        if (metodo) {
            beanRequestComprobante.operation = 'update';
            beanRequestComprobante.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestComprobante.operation = 'add';
            beanRequestComprobante.type_request = 'POST';
        }
        if (validateFormComprobante()) {
            processAjaxComprobante();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxComprobante();

    $('#sizePageComprobante').change(function () {
        processAjaxComprobante();
    });
    document.querySelector("#btnAbrirComprobante").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalComprobante').innerHTML =
            'REGISTRAR COMPROBANTE';
        addComprobante();
    };
    document.querySelector("#btnAbrirNewComprobante").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewComprobante').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewComprobante').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewComprobante').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalComprobante').innerHTML =
            'REGISTRAR UNIDAD MEDIDA';
        addComprobante();
    };
});
function addComprobante(comprobante = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreComprobante').value = (comprobante == undefined) ? '' : comprobante.nombre;
    document.querySelector('#txtCodigoComprobante').value = (comprobante == undefined) ? '' : comprobante.codigo;

}

function processAjaxComprobante() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestComprobante.operation == 'update' ||
        beanRequestComprobante.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreComprobante').value.trim(),
            codigo: document
                .querySelector('#txtCodigoComprobante')
                .value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmComprobanteModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmComprobanteModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyComprobante").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyComprobante").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestComprobante.operation) {
        case 'delete':
            parameters_pagination = '/' + comprobanteSelected.idcomprobante;
            break;

        case 'update':
            json.idcomprobante = comprobanteSelected.idcomprobante;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterComprobante').value != '') {
                document.querySelector('#pageComprobante').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterComprobante').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageComprobante').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageComprobante').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestComprobante,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestComprobante.operation == "delete") {
                    eliminarlistComprobante(comprobanteSelected.idcomprobante);
                    toListComprobante(beanPaginationComprobante);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewComprobante').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationComprobante = beanCrudResponse.beanPagination;
            toListComprobante(beanPaginationComprobante);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestComprobante.operation == 'update') {
                updatelistComprobante(beanCrudResponse.classGeneric);
                toListComprobante(beanPaginationComprobante);
                return;
            }
            beanPaginationComprobante.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationComprobante.count_filter++;
            toListComprobante(beanPaginationComprobante);
        }

    }, false);
}

function toListComprobante(beanPagination) {
    document.querySelector('#tbodyComprobante').innerHTML = '';
    document.querySelector('#titleManagerComprobante').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] UNIDADES DE MEDIDA';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               CODIGO
            </p>
        </div>
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               NOMBRE
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
        destroyPagination($('#paginationComprobante'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterComprobante').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY COMPROBANTE
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyComprobante').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyComprobante').innerHTML += row;
    beanPagination.list.forEach((comprobante) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >
            <!-- Widget Info -->
            <div class="dt-widget__info text-truncate">
              <p class="dt-widget__subtitle text-truncate">
              ${comprobante.codigo}
              </p>
            </div>
            <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${comprobante.nombre}
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
                  idcomprobante='${comprobante.idcomprobante}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-comprobante"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-comprobante" idcomprobante='${comprobante.idcomprobante}'
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
        document.querySelector('#tbodyComprobante').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageComprobante').value),
        document.querySelector('#pageComprobante'),
        processAjaxComprobante, beanRequestComprobante,
        $('#paginationComprobante')
    );
    addEventsComprobantes();
    if (beanRequestComprobante.operation == 'paginate') {
        document.querySelector('#txtFilterComprobante').focus();
    }

}

function addEventsComprobantes() {
    document.querySelectorAll('.editar-comprobante').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            comprobanteSelected = findByComprobante(
                btn.getAttribute('idcomprobante')
            );
            if (comprobanteSelected != undefined) {
                document.querySelector('#btnAbrirNewComprobante').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewComprobante').classList.remove("d-sm-none");

                document.querySelector('#btnAbrirNewComprobante').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewComprobante').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirComprobante').style.display == "none") {
                    document.querySelector('#btnAbrirComprobante').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewComprobante').classList.add("d-sm-none");
                }

                metodo = true;
                addComprobante(comprobanteSelected);
                document.querySelector('#TituloModalComprobante').innerHTML =
                    'EDITAR COMPROBANTE';
                document.querySelector('#txtNombreComprobante').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-comprobante').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            comprobanteSelected = findByComprobante(
                btn.getAttribute('idcomprobante')
            );
            if (comprobanteSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder eliminar'
                );
            beanRequestComprobante.operation = 'delete';
            beanRequestComprobante.type_request = 'DELETE';
            processAjaxComprobante();
        };
    });
}


function validateFormComprobante() {
    let letra = letra_numero_campo(
        document.querySelector('#txtNombreComprobante'),
        document.querySelector('#txtCodigoComprobante')
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
    return true;
}
function eliminarlistComprobante(idbusqueda) {
    beanPaginationComprobante.count_filter--;
    beanPaginationComprobante.list.splice(findIndexComprobante(parseInt(idbusqueda)), 1);
}

function updatelistComprobante(classBean) {
    beanPaginationComprobante.list.splice(findIndexComprobante(classBean.idcomprobante), 1, classBean);
}

function findIndexComprobante(idbusqueda) {
    return beanPaginationComprobante.list.findIndex(
        (comprobante) => {
            if (comprobante.idcomprobante == parseInt(idbusqueda))
                return comprobante;


        }
    );
}
function findByComprobante(idcomprobante) {
    return beanPaginationComprobante.list.find(
        (comprobante) => {
            if (parseInt(idcomprobante) == comprobante.idcomprobante) {
                return comprobante;
            }


        }
    );
}
