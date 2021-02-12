var beanPaginationCargo;
var cargoSelected;
var metodo = false;
var beanRequestCargo = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addCargoHtml").detach().appendTo("#drawer-agregarCargo");
    addCargo();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestCargo.entity_api = 'api/cargos';
    beanRequestCargo.operation = 'paginate';
    beanRequestCargo.type_request = 'GET';

    $('#FrmCargo').submit(function (event) {
        beanRequestCargo.operation = 'paginate';
        beanRequestCargo.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterCargo').value = limpiar_campo(
            document.querySelector('#txtFilterCargo').value
        );
        processAjaxCargo();
    });

    $('#FrmCargoModal').submit(function (event) {
        if (metodo) {
            beanRequestCargo.operation = 'update';
            beanRequestCargo.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestCargo.operation = 'add';
            beanRequestCargo.type_request = 'POST';
        }
        if (validateFormCargo()) {
            processAjaxCargo();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxCargo();

    $('#sizePageCargo').change(function () {
        processAjaxCargo();
    });
    document.querySelector("#btnAbrirCargo").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalCargo').innerHTML =
            'REGISTRAR CARGO';
        addCargo();
    };
    document.querySelector("#btnAbrirNewCargo").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewCargo').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewCargo').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewCargo').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalCargo').innerHTML =
            'REGISTRAR CARGO';
        addCargo();
    };
});
function addCargo(cargo = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreCargo').value = (cargo == undefined) ? '' : cargo.nombre;

}

function processAjaxCargo() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestCargo.operation == 'update' ||
        beanRequestCargo.operation == 'add'
    ) {
        circleCargando.container = $(document.querySelector("#FrmCargoModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmCargoModal"));
        json = {
            nombre: document.querySelector('#txtNombreCargo').value.trim(),

        };
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyCargo").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyCargo").parentElement.parentElement);

    }
    circleCargando.createLoader();
    circleCargando.toggleLoader("show");
    switch (beanRequestCargo.operation) {
        case 'delete':
            parameters_pagination = '/' + cargoSelected.idcargo;
            break;

        case 'update':
            json.idcargo = cargoSelected.idcargo;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterCargo').value != '') {
                document.querySelector('#pageCargo').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterCargo').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageCargo').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageCargo').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestCargo,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestCargo.operation == "delete") {
                    eliminarlistCargo(cargoSelected.idcargo);
                    toListCargo(beanPaginationCargo);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewCargo').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationCargo = beanCrudResponse.beanPagination;
            toListCargo(beanPaginationCargo);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestCargo.operation == 'update') {
                updatelistCargo(beanCrudResponse.classGeneric);
                toListCargo(beanPaginationCargo);
                return;
            }
            beanPaginationCargo.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationCargo.count_filter++;
            toListCargo(beanPaginationCargo);
        }

    }, false);
}

function toListCargo(beanPagination) {
    document.querySelector('#tbodyCargo').innerHTML = '';
    document.querySelector('#titleManagerCargo').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] CARGOS';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >
               NOMBRE
            </p>
        </div>
        <!-- Widget Extra -->
        <div class="dt-widget__extra">
              ACCIONES
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationCargo'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterCargo').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY CARGOS
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyCargo').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyCargo').innerHTML += row;
    beanPagination.list.forEach((cargo) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${cargo.nombre}
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
                  idcargo='${cargo.idcargo}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-cargo"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-cargo" idcargo='${cargo.idcargo}'
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
        document.querySelector('#tbodyCargo').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestCargo.operation = 'paginate';
    beanRequestCargo.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageCargo').value),
        document.querySelector('#pageCargo'),
        processAjaxCargo, beanRequestCargo,
        $('#paginationCargo')
    );
    addEventsCargos();
    if (beanRequestCargo.operation == 'paginate') {
        document.querySelector('#txtFilterCargo').focus();
    }

}

function addEventsCargos() {
    document.querySelectorAll('.editar-cargo').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            cargoSelected = findByCargo(
                btn.getAttribute('idcargo')
            );
            if (cargoSelected != undefined) {
                document.querySelector('#btnAbrirNewCargo').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewCargo').classList.remove("d-sm-none");

                document.querySelector('#btnAbrirNewCargo').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewCargo').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirCargo').style.display == "none") {
                    document.querySelector('#btnAbrirCargo').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewCargo').classList.add("d-sm-none");
                }

                metodo = true;
                addCargo(cargoSelected);
                document.querySelector('#TituloModalCargo').innerHTML =
                    'EDITAR CARGO';
                document.querySelector('#txtNombreCargo').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Cargo para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-cargo').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            cargoSelected = findByCargo(
                btn.getAttribute('idcargo')
            );
            if (cargoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Cargo para poder eliminar'
                );
            beanRequestCargo.operation = 'delete';
            beanRequestCargo.type_request = 'DELETE';
            processAjaxCargo();
        };
    });
}


function validateFormCargo() {
    let letra = letra_campo(
        document.querySelector('#txtNombreCargo')
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
function eliminarlistCargo(idbusqueda) {
    beanPaginationCargo.count_filter--;
    beanPaginationCargo.list.splice(findIndexCargo(parseInt(idbusqueda)), 1);
}

function updatelistCargo(classBean) {
    beanPaginationCargo.list.splice(findIndexCargo(classBean.idcargo), 1, classBean);
}

function findIndexCargo(idbusqueda) {
    return beanPaginationCargo.list.findIndex(
        (cargo) => {
            if (cargo.idcargo == parseInt(idbusqueda))
                return cargo;


        }
    );
}
function findByCargo(idcargo) {
    return beanPaginationCargo.list.find(
        (cargo) => {
            if (parseInt(idcargo) == cargo.idcargo) {
                return cargo;
            }


        }
    );
}
