var beanPaginationSeguro;
var seguroSelected;
var metodo = false;
var beanRequestSeguro = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addSeguroHtml").detach().appendTo("#drawer-agregarSeguro");
    addSeguro();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestSeguro.entity_api = 'api/seguros';
    beanRequestSeguro.operation = 'paginate';
    beanRequestSeguro.type_request = 'GET';

    $('#FrmSeguro').submit(function (event) {
        beanRequestSeguro.operation = 'paginate';
        beanRequestSeguro.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterSeguro').value = limpiar_campo(
            document.querySelector('#txtFilterSeguro').value
        );
        processAjaxSeguro();
    });

    $('#FrmSeguroModal').submit(function (event) {
        if (metodo) {
            beanRequestSeguro.operation = 'update';
            beanRequestSeguro.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestSeguro.operation = 'add';
            beanRequestSeguro.type_request = 'POST';
        }
        if (validateFormSeguro()) {
            processAjaxSeguro();
        }
        event.preventDefault();
        event.stopPropagation();
    });

    processAjaxSeguro();

    $('#sizePageSeguro').change(function () {
        processAjaxSeguro();
    });
    document.querySelector("#btnAbrirSeguro").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalSeguro').innerHTML =
            'REGISTRAR SEGURO';
        addSeguro();
    };
    document.querySelector("#btnAbrirNewSeguro").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewSeguro').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewSeguro').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewSeguro').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalSeguro').innerHTML =
            'REGISTRAR ESTABLECIMIENTO';
        addSeguro();
    };
});
function addSeguro(seguro = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreSeguro').value = (seguro == undefined) ? '' : seguro.nombre;
    document.querySelector('#txtValorSeguro').value = (seguro == undefined) ? '0' : seguro.valor;

}

function processAjaxSeguro() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestSeguro.operation == 'update' ||
        beanRequestSeguro.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreSeguro').value.trim(),
            valor: document
                .querySelector('#txtValorSeguro')
                .value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmSeguroModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmSeguroModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodySeguro").parentNode);
        circleCargando.container = $(document.querySelector("#tbodySeguro").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestSeguro.operation) {
        case 'delete':
            parameters_pagination = '/' + seguroSelected.idseguro;
            break;

        case 'update':
            json.idseguro = seguroSelected.idseguro;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterSeguro').value != '') {
                document.querySelector('#pageSeguro').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterSeguro').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageSeguro').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageSeguro').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestSeguro,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestSeguro.operation == "delete") {
                    eliminarlistSeguro(seguroSelected.idseguro);
                    toListSeguro(beanPaginationSeguro);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewSeguro').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationSeguro = beanCrudResponse.beanPagination;
            toListSeguro(beanPaginationSeguro);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestSeguro.operation == 'update') {
                updatelistSeguro(beanCrudResponse.classGeneric);
                toListSeguro(beanPaginationSeguro);
                return;
            }
            beanPaginationSeguro.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationSeguro.count_filter++;
            toListSeguro(beanPaginationSeguro);
        }

    }, false);
}

function toListSeguro(beanPagination) {
    document.querySelector('#tbodySeguro').innerHTML = '';
    document.querySelector('#titleManagerSeguro').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] SEGUROS';
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
               VALOR
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
        destroyPagination($('#paginationSeguro'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterSeguro').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info text-truncate text-center" >
        <p class="mb-0 text-truncate " >
           NO HAY SEGURO
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodySeguro').innerHTML += row;
        return;
    }

    document.querySelector('#tbodySeguro').innerHTML += row;
    beanPagination.list.forEach((seguro) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate" >
                ${seguro.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info text-truncate">
                <p class="dt-widget__subtitle text-truncate">
                ${seguro.valor}
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
                  idseguro='${seguro.idseguro}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-seguro"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-seguro" idseguro='${seguro.idseguro}'
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
        document.querySelector('#tbodySeguro').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageSeguro').value),
        document.querySelector('#pageSeguro'),
        processAjaxSeguro, beanRequestSeguro,
        $('#paginationSeguro')
    );
    addEventsSeguros();
    if (beanRequestSeguro.operation == 'paginate') {
        document.querySelector('#txtFilterSeguro').focus();
    }

}

function addEventsSeguros() {
    document.querySelectorAll('.editar-seguro').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            seguroSelected = findBySeguro(
                btn.getAttribute('idseguro')
            );
            if (seguroSelected != undefined) {
                document.querySelector('#btnAbrirNewSeguro').classList.remove("d-lg-none");
                document.querySelector('#btnAbrirNewSeguro').classList.remove("d-sm-none");

                document.querySelector('#btnAbrirNewSeguro').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewSeguro').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirSeguro').style.display == "none") {
                    document.querySelector('#btnAbrirSeguro').dispatchEvent(new Event('click'));
                    document.querySelector('#btnAbrirNewSeguro').classList.add("d-sm-none");
                }

                metodo = true;
                addSeguro(seguroSelected);
                document.querySelector('#TituloModalSeguro').innerHTML =
                    'EDITAR SEGURO';
                document.querySelector('#txtNombreSeguro').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-seguro').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            seguroSelected = findBySeguro(
                btn.getAttribute('idseguro')
            );
            if (seguroSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró la Unidad de Medida para poder eliminar'
                );
            beanRequestSeguro.operation = 'delete';
            beanRequestSeguro.type_request = 'DELETE';
            processAjaxSeguro();
        };
    });
}


function validateFormSeguro() {
    let letra = letra_campo(
        document.querySelector('#txtNombreSeguro')
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
                'Por favor ingrese sólo Letras al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }
    let numero = numero_campo(
        document.querySelector('#txtValorSeguro')
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
                'Por favor ingrese sólo números al campo ' + numero.labels[0].innerText
            );
        }

        return false;
    }
    return true;
}
function eliminarlistSeguro(idbusqueda) {
    beanPaginationSeguro.count_filter--;
    beanPaginationSeguro.list.splice(findIndexSeguro(parseInt(idbusqueda)), 1);
}

function updatelistSeguro(classBean) {
    beanPaginationSeguro.list.splice(findIndexSeguro(classBean.idseguro), 1, classBean);
}

function findIndexSeguro(idbusqueda) {
    return beanPaginationSeguro.list.findIndex(
        (seguro) => {
            if (seguro.idseguro == parseInt(idbusqueda))
                return seguro;


        }
    );
}
function findBySeguro(idseguro) {
    return beanPaginationSeguro.list.find(
        (seguro) => {
            if (parseInt(idseguro) == seguro.idseguro) {
                return seguro;
            }


        }
    );
}
