var beanPaginationEstablecimiento;
var establecimientoSelected;
var metodo = false;
var beanRequestEstablecimiento = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addEstablecimientoHtml").detach().appendTo("#drawer-agregarEstablecimiento");
    addEstablecimiento();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestEstablecimiento.entity_api = 'api/establecimientos';
    beanRequestEstablecimiento.operation = 'paginate';
    beanRequestEstablecimiento.type_request = 'GET';

    $('#FrmEstablecimiento').submit(function (event) {
        beanRequestEstablecimiento.operation = 'paginate';
        beanRequestEstablecimiento.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterEstablecimiento').value = limpiar_campo(
            document.querySelector('#txtFilterEstablecimiento').value
        );
        processAjaxEstablecimiento();
    });

    $('#FrmEstablecimientoModal').submit(function (event) {
        if (metodo) {
            beanRequestEstablecimiento.operation = 'update';
            beanRequestEstablecimiento.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestEstablecimiento.operation = 'add';
            beanRequestEstablecimiento.type_request = 'POST';
        }
        if (validateFormEstablecimiento()) {
            processAjaxEstablecimiento();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxEstablecimiento();

    $('#sizePageEstablecimiento').change(function () {
        beanRequestEstablecimiento.operation = 'paginate';
        beanRequestEstablecimiento.type_request = 'GET';
        processAjaxEstablecimiento();
    });
    document.querySelector("#btnAbrirEstablecimiento").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalEstablecimiento').innerHTML =
            'REGISTRAR ESTABLECIMIENTO';
        addEstablecimiento();
    };
    document.querySelector("#btnAbrirNewEstablecimiento").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewEstablecimiento').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewEstablecimiento').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewEstablecimiento').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalEstablecimiento').innerHTML =
            'REGISTRAR ESTABLECIMIENTO';
        addEstablecimiento();
    };

});
function addEstablecimiento(establecimiento = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreEstablecimiento').value = (establecimiento == undefined) ? '' : establecimiento.nombre;
    document.querySelector('#txtDireccionEstablecimiento').value = (establecimiento == undefined) ? '' : establecimiento.direccion;
    document.querySelector('#txtTelefonoEstablecimiento').value = (establecimiento == undefined) ? '' : establecimiento.telefono;
    document.querySelector('#txtEmailEstablecimiento').value = (establecimiento == undefined) ? '' : establecimiento.email;

}

function processAjaxEstablecimiento() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestEstablecimiento.operation == 'update' ||
        beanRequestEstablecimiento.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreEstablecimiento').value.trim(),
            direccion: document.querySelector('#txtDireccionEstablecimiento').value.trim(),
            telefono: parseInt(document.querySelector('#txtTelefonoEstablecimiento').value.trim()),
            email: document.querySelector('#txtEmailEstablecimiento').value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmEstablecimientoModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmEstablecimientoModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyEstablecimiento").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyEstablecimiento").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestEstablecimiento.operation) {
        case 'delete':
            parameters_pagination = '/' + establecimientoSelected.idestablecimiento;
            break;

        case 'update':
            json.idestablecimiento = establecimientoSelected.idestablecimiento;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterEstablecimiento').value != '') {
                document.querySelector('#pageEstablecimiento').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterEstablecimiento').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageEstablecimiento').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageEstablecimiento').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestEstablecimiento,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestEstablecimiento.operation == "delete") {
                    eliminarlistEstablecimiento(establecimientoSelected.idestablecimiento);
                    toListEstablecimiento(beanPaginationEstablecimiento);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewEstablecimiento').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationEstablecimiento = beanCrudResponse.beanPagination;
            toListEstablecimiento(beanPaginationEstablecimiento);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestEstablecimiento.operation == 'update') {
                updatelistEstablecimiento(beanCrudResponse.classGeneric);
                toListEstablecimiento(beanPaginationEstablecimiento);
                return;
            }
            beanPaginationEstablecimiento.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationEstablecimiento.count_filter++;
            toListEstablecimiento(beanPaginationEstablecimiento);
        }
    }, false);
}

function toListEstablecimiento(beanPagination) {
    document.querySelector('#tbodyEstablecimiento').innerHTML = '';
    document.querySelector('#titleManagerEstablecimiento').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] ESTABLECIMIENTOS';
    let row;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationEstablecimiento'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterEstablecimiento').focus();
        row = `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY ESTABLECIMIENTO
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyEstablecimiento').innerHTML += row;
        return;
    }


    beanPagination.list.forEach((establecimiento) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${establecimiento.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle ">
                ${establecimiento.direccion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info " style="max-width: 120px;">
                <p class="dt-widget__subtitle ">
                ${establecimiento.telefono}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info " >
                <p class="dt-widget__subtitle ">
                ${establecimiento.email}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-center" style="max-width: 100px;">
                <p class="dt-widget__subtitle ">
                <button
                type="button"
                class="btn btn-sm btn-secondary almacen-establecimiento" idestablecimiento='${establecimiento.idestablecimiento}' ><i class="icon icon-invoice-new icon-sm "></i>
              </button>
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
                
                    <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  idestablecimiento='${establecimiento.idestablecimiento}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-establecimiento"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-establecimiento" idestablecimiento='${establecimiento.idestablecimiento}'
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Eliminar</em>"
                  >
                    <i class="icon icon-trash icon-sm pulse-danger"></i>
                  </button>
                          </div>
                          <!-- /action button group -->
                        <!-- /hide content -->
                      </div>

            </div>
            <!-- /widgets item -->
            `;
        document.querySelector('#tbodyEstablecimiento').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestEstablecimiento.operation = 'paginate';
    beanRequestEstablecimiento.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageEstablecimiento').value),
        document.querySelector('#pageEstablecimiento'),
        processAjaxEstablecimiento, beanRequestEstablecimiento,
        $('#paginationEstablecimiento')
    );
    addEventsEstablecimientos();
    if (beanRequestEstablecimiento.operation == 'paginate') {
        document.querySelector('#txtFilterEstablecimiento').focus();
    } else {
        document.querySelector('#txtNombreEstablecimiento').focus();
    }

}

function addEventsEstablecimientos() {
    document.querySelectorAll('.editar-establecimiento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            establecimientoSelected = findByEstablecimiento(
                btn.getAttribute('idestablecimiento')
            );
            if (establecimientoSelected != undefined) {
                document.querySelector('#btnAbrirNewEstablecimiento').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewEstablecimiento').classList.remove("d-none");

                document.querySelector('#btnAbrirNewEstablecimiento').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewEstablecimiento').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirEstablecimiento').style.display == "none") {
                    document.querySelector('#btnAbrirEstablecimiento').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewEstablecimiento').classList.add("d-none");
                }

                metodo = true;
                addEstablecimiento(establecimientoSelected);
                document.querySelector('#TituloModalEstablecimiento').innerHTML =
                    'EDITAR ESTABLECIMIENTO';
                document.querySelector('#txtNombreEstablecimiento').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró el Establecimiento para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.almacen-establecimiento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            establecimientoSelected = findByEstablecimiento(
                btn.getAttribute('idestablecimiento')
            );
            if (establecimientoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró el Establecimiento'
                );
            addClass(document.querySelector("#EstablecimientoHtml"), "d-none");
            removeClass(document.querySelector("#listaAlmacenHtml"), "d-none");
            document.querySelector("#txtEstablecimientoProducto").value = establecimientoSelected.nombre;
            processAjaxAlmacen();

        };
    });
    document.querySelectorAll('.eliminar-establecimiento').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            establecimientoSelected = findByEstablecimiento(
                btn.getAttribute('idestablecimiento')
            );
            if (establecimientoSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró el Establecimiento para poder eliminar'
                );
            beanRequestEstablecimiento.operation = 'delete';
            beanRequestEstablecimiento.type_request = 'DELETE';
            processAjaxEstablecimiento();
        };
    });
}

function findByEstablecimiento(idestablecimiento) {
    return beanPaginationEstablecimiento.list.find(
        (establecimiento) => {
            if (parseInt(idestablecimiento) == establecimiento.idestablecimiento) {
                return establecimiento;
            }


        }
    );
}

function validateFormEstablecimiento() {

    if (limpiar_campo(
        document.querySelector('#txtNombreEstablecimiento').value
    ) == "") {
        showAlertTopEnd('info', 'Por favor ingrese Nombre');
        document.querySelector('#txtNombreEstablecimiento').focus();
        return false;
    }
    if (limpiar_campo(
        document.querySelector('#txtDireccionEstablecimiento').value
    ) == "") {
        showAlertTopEnd('info', 'Por favor ingrese Nombre');
        document.querySelector('#txtDireccionEstablecimiento').focus();
        return false;
    }

    let letra = numero_campo(
        document.querySelector('#txtTelefonoEstablecimiento')
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


    if (limpiar_campo(
        document.querySelector('#txtEmailEstablecimiento').value
    ) == "") {
        showAlertTopEnd('info', 'Por favor ingrese Nombre');
        document.querySelector('#txtEmailEstablecimiento').focus();
        return false;
    }

    return true;
}

function eliminarlistEstablecimiento(idbusqueda) {
    beanPaginationEstablecimiento.count_filter--;
    beanPaginationEstablecimiento.list.splice(findIndexEstablecimiento(parseInt(idbusqueda)), 1);
}

function updatelistEstablecimiento(classBean) {
    beanPaginationEstablecimiento.list.splice(findIndexEstablecimiento(classBean.idestablecimiento), 1, classBean);
}

function findIndexEstablecimiento(idbusqueda) {
    return beanPaginationEstablecimiento.list.findIndex(
        (establecimiento) => {
            if (establecimiento.idestablecimiento == parseInt(idbusqueda))
                return establecimiento;


        }
    );
}
