var beanPaginationUnidadMedida;
var unidadMedidaSelected;
var metodo = false;
var beanRequestUnidadMedida = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addUnidadMedidaHtml").detach().appendTo("#drawer-agregarUnidadMedida");
    addUnidadMedida();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestUnidadMedida.entity_api = 'api/unidadmedidas';
    beanRequestUnidadMedida.operation = 'paginate';
    beanRequestUnidadMedida.type_request = 'GET';

    $('#FrmUnidadMedida').submit(function (event) {
        beanRequestUnidadMedida.operation = 'paginate';
        beanRequestUnidadMedida.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterUnidadMedida').value = limpiar_campo(
            document.querySelector('#txtFilterUnidadMedida').value
        );
        processAjaxUnidadMedida();
    });

    $('#FrmUnidadMedidaModal').submit(function (event) {
        if (metodo) {
            beanRequestUnidadMedida.operation = 'update';
            beanRequestUnidadMedida.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestUnidadMedida.operation = 'add';
            beanRequestUnidadMedida.type_request = 'POST';
        }
        if (validateFormUnidadMedida()) {
            processAjaxUnidadMedida();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxUnidadMedida();

    $('#sizePageUnidadMedida').change(function () {
        processAjaxUnidadMedida();
    });
    document.querySelector("#btnAbrirUnidadMedida").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalUnidadMedida').innerHTML =
            'REGISTRAR UNIDAD DE MEDIDA';
        addUnidadMedida();
    };
    document.querySelector("#btnAbrirNewUnidadMedida").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewUnidadMedida').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewUnidadMedida').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewUnidadMedida').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalUnidadMedida').innerHTML =
            'REGISTRAR UNIDAD MEDIDA';
        addUnidadMedida();
    };
});
function addUnidadMedida(unidadMedida = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreUnidadMedida').value = (unidadMedida == undefined) ? '' : unidadMedida.nombre;
    document.querySelector('#txtAbreviaturaUnidadMedida').value = (unidadMedida == undefined) ? '' : unidadMedida.abreviatura;

}

function processAjaxUnidadMedida() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestUnidadMedida.operation == 'update' ||
        beanRequestUnidadMedida.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreUnidadMedida').value.trim(),
            abreviatura: document
                .querySelector('#txtAbreviaturaUnidadMedida')
                .value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmUnidadMedidaModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmUnidadMedidaModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyUnidadMedida").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyUnidadMedida").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestUnidadMedida.operation) {
        case 'delete':
            parameters_pagination = '/' + unidadMedidaSelected.idunidad_medida;
            break;

        case 'update':
            json.idunidad_medida = unidadMedidaSelected.idunidad_medida;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterUnidadMedida').value != '') {
                document.querySelector('#pageUnidadMedida').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterUnidadMedida').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageUnidadMedida').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageUnidadMedida').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestUnidadMedida,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestUnidadMedida.operation == "delete") {
                    eliminarlistUnidadMedida(unidadMedidaSelected.idunidad_medida);
                    toListUnidadMedida(beanPaginationUnidadMedida);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewUnidadMedida').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationUnidadMedida = beanCrudResponse.beanPagination;
            toListUnidadMedida(beanPaginationUnidadMedida);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestUnidadMedida.operation == 'update') {
                updatelistUnidadMedida(beanCrudResponse.classGeneric);
                toListUnidadMedida(beanPaginationUnidadMedida);
                return;
            }
            beanPaginationUnidadMedida.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationUnidadMedida.count_filter++;
            toListUnidadMedida(beanPaginationUnidadMedida);
        }

    }, false);
}

function toListUnidadMedida(beanPagination) {
    document.querySelector('#tbodyUnidadMedida').innerHTML = '';
    document.querySelector('#titleManagerUnidadMedida').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] UNIDADES DE MEDIDA';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               NOMBRE
            </p>
        </div>
        <!-- /widget info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate ">
               ABREVIATURA
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
        destroyPagination($('#paginationUnidadMedida'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterUnidadMedida').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY UNIDAD DE MEDIDA
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyUnidadMedida').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyUnidadMedida').innerHTML += row;
    beanPagination.list.forEach((unidadMedida) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${unidadMedida.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${unidadMedida.abreviatura}
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
                  idunidadMedida='${unidadMedida.idunidad_medida}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-unidadMedida"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-unidadMedida" idunidadMedida='${unidadMedida.idunidad_medida}'
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
        document.querySelector('#tbodyUnidadMedida').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageUnidadMedida').value),
        document.querySelector('#pageUnidadMedida'),
        processAjaxUnidadMedida, beanRequestUnidadMedida,
        $('#paginationUnidadMedida')
    );
    addEventsUnidadMedidas();
    if (beanRequestUnidadMedida.operation == 'paginate') {
        document.querySelector('#txtFilterUnidadMedida').focus();
    }

}

function addEventsUnidadMedidas() {
    document.querySelectorAll('.editar-unidadMedida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            unidadMedidaSelected = findByUnidadMedida(
                btn.getAttribute('idunidadMedida')
            );
            if (unidadMedidaSelected != undefined) {
                document.querySelector('#btnAbrirNewUnidadMedida').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewUnidadMedida').classList.remove("d-sm-none");

                document.querySelector('#btnAbrirNewUnidadMedida').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewUnidadMedida').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirUnidadMedida').style.display == "none") {
                    document.querySelector('#btnAbrirUnidadMedida').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewUnidadMedida').classList.add("d-sm-none");
                }

                metodo = true;
                addUnidadMedida(unidadMedidaSelected);
                document.querySelector('#TituloModalUnidadMedida').innerHTML =
                    'EDITAR UNIDAD DE MEDIDA';
                document.querySelector('#txtNombreUnidadMedida').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-unidadMedida').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            unidadMedidaSelected = findByUnidadMedida(
                btn.getAttribute('idunidadMedida')
            );
            if (unidadMedidaSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder eliminar'
                );
            beanRequestUnidadMedida.operation = 'delete';
            beanRequestUnidadMedida.type_request = 'DELETE';
            processAjaxUnidadMedida();
        };
    });
}


function validateFormUnidadMedida() {
    let letra = letra_campo(
        document.querySelector('#txtNombreUnidadMedida'),
        document.querySelector('#txtAbreviaturaUnidadMedida')
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
function eliminarlistUnidadMedida(idbusqueda) {
    beanPaginationUnidadMedida.count_filter--;
    beanPaginationUnidadMedida.list.splice(findIndexUnidadMedida(parseInt(idbusqueda)), 1);
}

function updatelistUnidadMedida(classBean) {
    beanPaginationUnidadMedida.list.splice(findIndexUnidadMedida(classBean.idunidad_medida), 1, classBean);
}

function findIndexUnidadMedida(idbusqueda) {
    return beanPaginationUnidadMedida.list.findIndex(
        (unidadMedida) => {
            if (unidadMedida.idunidad_medida == parseInt(idbusqueda))
                return unidadMedida;


        }
    );
}
function findByUnidadMedida(idunidad_medida) {
    return beanPaginationUnidadMedida.list.find(
        (unidadMedida) => {
            if (parseInt(idunidad_medida) == unidadMedida.idunidad_medida) {
                return unidadMedida;
            }


        }
    );
}
