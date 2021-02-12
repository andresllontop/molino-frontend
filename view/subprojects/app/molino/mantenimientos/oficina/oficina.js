var beanPaginationOficina;
var oficinaSelected;
var metodo = false;
var beanRequestOficina = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addOficinaHtml").detach().appendTo("#drawer-agregarOficina");
    addOficina();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestOficina.entity_api = 'api/oficinas';
    beanRequestOficina.operation = 'paginate';
    beanRequestOficina.type_request = 'GET';

    $('#FrmOficina').submit(function (event) {
        beanRequestOficina.operation = 'paginate';
        beanRequestOficina.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterOficina').value = limpiar_campo(
            document.querySelector('#txtFilterOficina').value
        );
        processAjaxOficina();
    });

    $('#FrmOficinaModal').submit(function (event) {
        if (metodo) {
            beanRequestOficina.operation = 'update';
            beanRequestOficina.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestOficina.operation = 'add';
            beanRequestOficina.type_request = 'POST';
        }
        if (validateFormOficina()) {
            processAjaxOficina();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxOficina();

    $('#sizePageOficina').change(function () {
        beanRequestOficina.operation = 'paginate';
        beanRequestOficina.type_request = 'GET';
        processAjaxOficina();
    });
    document.querySelector("#btnAbrirOficina").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalOficina').innerHTML =
            'REGISTRAR OFICINA';
        addOficina();
    };
    document.querySelector("#btnAbrirNewOficina").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewOficina').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewOficina').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewOficina').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalOficina').innerHTML =
            'REGISTRAR OFICINA';
        addOficina();
    };
});
function addOficina(oficina = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreOficina').value = (oficina == undefined) ? '' : oficina.nombre;

}

function processAjaxOficina() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestOficina.operation == 'update' ||
        beanRequestOficina.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreOficina').value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmOficinaModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmOficinaModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyOficina").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyOficina").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestOficina.operation) {
        case 'delete':
            parameters_pagination = '/' + oficinaSelected.idoficina;
            break;

        case 'update':
            json.idoficina = oficinaSelected.idoficina;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterOficina').value != '') {
                document.querySelector('#pageOficina').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterOficina').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageOficina').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageOficina').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestOficina,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestOficina.operation == "delete") {
                    eliminarlistOficina(oficinaSelected.idoficina);
                    toListOficina(beanPaginationOficina);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewOficina').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationOficina = beanCrudResponse.beanPagination;
            toListOficina(beanPaginationOficina);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestOficina.operation == 'update') {
                updatelistOficina(beanCrudResponse.classGeneric);
                toListOficina(beanPaginationOficina);
                return;
            }
            beanPaginationOficina.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationOficina.count_filter++;
            toListOficina(beanPaginationOficina);
        }

    }, false);
}

function toListOficina(beanPagination) {
    document.querySelector('#tbodyOficina').innerHTML = '';
    document.querySelector('#titleManagerOficina').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] OFICINAS';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2">
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >NOMBRE
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Info -->
        <div class="dt-widget__info text-truncate " >
            <p class="mb-0 text-truncate " >ÁREAS
            </p>
        </div>
        <!-- /widget info -->
        <!-- Widget Extra -->
        <div class="dt-widget__extra">ACCIONES
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationOficina'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterOficina').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY OFICINA
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyOficina').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyOficina').innerHTML += row;
    beanPagination.list.forEach((oficina) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >
            
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${oficina.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                    <button  type="button" class="btn btn-sm btn-secondary area-oficina" idoficina='${oficina.idoficina}' ><i class="icon icon-invoice-new icon-sm "></i>
                    </button>
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
                  idoficina='${oficina.idoficina}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-oficina"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-oficina" idoficina='${oficina.idoficina}'
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
        document.querySelector('#tbodyOficina').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestOficina.operation = 'paginate';
    beanRequestOficina.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageOficina').value),
        document.querySelector('#pageOficina'),
        processAjaxOficina, beanRequestOficina,
        $('#paginationOficina')
    );
    addEventsOficinas();
    if (beanRequestOficina.operation == 'paginate') {
        document.querySelector('#txtFilterOficina').focus();
    }

}

function addEventsOficinas() {
    document.querySelectorAll('.editar-oficina').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            oficinaSelected = findByOficina(
                btn.getAttribute('idoficina')
            );
            if (oficinaSelected != undefined) {
                document.querySelector('#btnAbrirNewOficina').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewOficina').classList.remove("d-sm-none");

                document.querySelector('#btnAbrirNewOficina').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewOficina').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirOficina').style.display == "none"
                ) {
                    document.querySelector('#btnAbrirOficina').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewOficina').classList.add("d-sm-none");
                }

                metodo = true;
                addOficina(oficinaSelected);
                document.querySelector('#TituloModalOficina').innerHTML =
                    'EDITAR OFICINA';
                document.querySelector('#txtNombreOficina').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Oficina para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.area-oficina').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            oficinaSelected = findByOficina(
                btn.getAttribute('idoficina')
            );
            if (oficinaSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Oficina'
                );
            addClass(document.querySelector("#OficinaHtml"), "d-none");
            removeClass(document.querySelector("#listaAreaHtml"), "d-none");
            document.querySelector("#txtOficina").value = oficinaSelected.nombre;
            processAjaxArea();

        };
    });
    document.querySelectorAll('.eliminar-oficina').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            oficinaSelected = findByOficina(
                btn.getAttribute('idoficina')
            );
            if (oficinaSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Oficina para poder eliminar'
                );
            beanRequestOficina.operation = 'delete';
            beanRequestOficina.type_request = 'DELETE';
            processAjaxOficina();
        };
    });
}


function validateFormOficina() {
    let letra = letra_numero_campo(
        document.querySelector('#txtNombreOficina'));

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

function eliminarlistOficina(idbusqueda) {
    beanPaginationOficina.count_filter--;
    beanPaginationOficina.list.splice(findIndexOficina(parseInt(idbusqueda)), 1);
}

function updatelistOficina(classBean) {
    beanPaginationOficina.list.splice(findIndexOficina(classBean.idoficina), 1, classBean);
}

function findIndexOficina(idbusqueda) {
    return beanPaginationOficina.list.findIndex(
        (oficina) => {
            if (oficina.idoficina == parseInt(idbusqueda))
                return oficina;


        }
    );
}
function findByOficina(idoficina) {
    return beanPaginationOficina.list.find(
        (oficina) => {
            if (parseInt(idoficina) == oficina.idoficina) {
                return oficina;
            }


        }
    );
}
