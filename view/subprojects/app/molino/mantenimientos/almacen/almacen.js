var beanPaginationAlmacen;
var almacenSelected;
var metodo = false;
var beanRequestAlmacen = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addAlmacenHtml").detach().appendTo("#drawer-agregarAlmacen");
    addAlmacen();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestAlmacen.entity_api = 'api/almacenes';
    beanRequestAlmacen.operation = 'establecimiento/paginate';
    beanRequestAlmacen.type_request = 'GET';

    $('#FrmAlmacen').submit(function (event) {
        beanRequestAlmacen.operation = 'establecimiento/paginate';
        beanRequestAlmacen.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        processAjaxAlmacen();
    });

    $('#FrmAlmacenModal').submit(function (event) {
        if (metodo) {
            beanRequestAlmacen.operation = 'update';
            beanRequestAlmacen.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestAlmacen.operation = 'add';
            beanRequestAlmacen.type_request = 'POST';
        }
        if (validateFormAlmacen()) {
            processAjaxAlmacen();
        }
        event.preventDefault();
        event.stopPropagation();
    });



    $('#sizePageAlmacen').change(function () {
        processAjaxAlmacen();
    });
    document.querySelector("#btnAbrirAlmacen").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalAlmacen').innerHTML =
            'REGISTRAR ALMACEN';
        addAlmacen();
    };
    document.querySelector("#btnAbrirNewAlmacen").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewAlmacen').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewAlmacen').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewAlmacen').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalAlmacen').innerHTML =
            'REGISTRAR ALMACEN';
        addAlmacen();
    };
    document.querySelector(".cerrar-almacen").onclick = () => {
        addClass(document.querySelector("#listaAlmacenHtml"), "d-none");
        removeClass(document.querySelector("#EstablecimientoHtml"), "d-none");
        establecimientoSelected = undefined;
        if (document.querySelector("#btnAbrirAlmacen").classList.contains("active")) {
            document.querySelector('#btnAbrirAlmacen').dispatchEvent(new Event('click'));
        }

    };
});
function addAlmacen(almacen = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreAlmacen').value = (almacen == undefined) ? '' : almacen.nombre;

}

function processAjaxAlmacen() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestAlmacen.operation == 'update' ||
        beanRequestAlmacen.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreAlmacen').value,
            establecimiento: establecimientoSelected
        };
        circleCargando.container = $(document.querySelector("#FrmAlmacenModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmAlmacenModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyAlmacen").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyAlmacen").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestAlmacen.operation) {
        case 'delete':
            parameters_pagination = '/' + almacenSelected.idalmacen;
            break;

        case 'update':
            json.idalmacen = almacenSelected.idalmacen;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterAlmacen').value != '') {
                document.querySelector('#pageAlmacen').value = 1;
            }
            parameters_pagination +=
                '?idestablecimiento=' + establecimientoSelected.idestablecimiento;
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterAlmacen').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageAlmacen').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageAlmacen').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestAlmacen,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestAlmacen.operation == "delete") {
                    eliminarlistAlmacen(almacenSelected.idalmacen);
                    toListAlmacen(beanPaginationAlmacen);
                }
                notifyUser('Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewAlmacen').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationAlmacen = beanCrudResponse.beanPagination;
            toListAlmacen(beanPaginationAlmacen);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestAlmacen.operation == 'update') {
                updatelistAlmacen(beanCrudResponse.classGeneric);
                toListAlmacen(beanPaginationAlmacen);
                return;
            }
            beanPaginationAlmacen.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationAlmacen.count_filter++;
            toListAlmacen(beanPaginationAlmacen);
        }
    }, false);
}

function toListAlmacen(beanPagination) {
    document.querySelector('#tbodyAlmacen').innerHTML = '';
    document.querySelector('#titleManagerAlmacen').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] ALMACENES';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2"">
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
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
        destroyPagination($('#paginationAlmacen'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterAlmacen').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY ALMACEN
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyAlmacen').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyAlmacen').innerHTML += row;
    beanPagination.list.forEach((almacen) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${almacen.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
             
                    <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  idalmacen='${almacen.idalmacen}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-almacen"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-almacen" idalmacen='${almacen.idalmacen}'
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
        document.querySelector('#tbodyAlmacen').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestAlmacen.operation = 'establecimiento/paginate';
    beanRequestAlmacen.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageAlmacen').value),
        document.querySelector('#pageAlmacen'),
        processAjaxAlmacen, beanRequestAlmacen,
        $('#paginationAlmacen')
    );
    addEventsAlmacens();
    if (beanRequestAlmacen.operation == 'establecimiento/paginate') {
        document.querySelector('#txtFilterAlmacen').focus();
    }

}

function addEventsAlmacens() {
    document.querySelectorAll('.editar-almacen').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            almacenSelected = findByAlmacen(
                btn.getAttribute('idalmacen')
            );
            if (almacenSelected != undefined) {
                document.querySelector('#btnAbrirNewAlmacen').classList.remove("d-lg-none");

                document.querySelector('#btnAbrirNewAlmacen').classList.remove("d-none");

                document.querySelector('#btnAbrirNewAlmacen').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewAlmacen').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirAlmacen').style.display == "none") {
                    document.querySelector('#btnAbrirAlmacen').dispatchEvent(new Event('click'));

                    document.querySelector('#btnAbrirNewAlmacen').classList.add("d-none");
                }
                metodo = true;
                addAlmacen(almacenSelected);
                document.querySelector('#TituloModalAlmacen').innerHTML =
                    'EDITAR ALMACEN';
                document.querySelector('#txtNombreAlmacen').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró el Almacen para poder editar'
                );
            }
        };
    });
    document.querySelectorAll('.eliminar-almacen').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            almacenSelected = findByAlmacen(
                btn.getAttribute('idalmacen')
            );
            if (almacenSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró el Almacen para poder eliminar'
                );
            beanRequestAlmacen.operation = 'delete';
            beanRequestAlmacen.type_request = 'DELETE';
            processAjaxAlmacen();
        };
    });
}

function validateFormAlmacen() {

    if (limpiar_campo(
        document.querySelector('#txtNombreAlmacen').value
    ) == "") {
        showAlertTopEnd('info', 'Por favor ingrese Nombre');
        document.querySelector('#txtNombreAlmacen').focus();
        return false;
    }

    if (establecimientoSelected == undefined) {
        showAlertTopEnd('info', 'Por favor ingrese Establecimeinto');
        document.querySelector('#txtEstablecimientoProducto').focus();
        return false;
    }

    return true;
}

function eliminarlistAlmacen(idbusqueda) {
    beanPaginationAlmacen.count_filter--;
    beanPaginationAlmacen.list.splice(findIndexAlmacen(parseInt(idbusqueda)), 1);
}

function updatelistAlmacen(classBean) {
    beanPaginationAlmacen.list.splice(findIndexAlmacen(classBean.idalmacen), 1, classBean);
}

function findIndexAlmacen(idbusqueda) {
    return beanPaginationAlmacen.list.findIndex(
        (almacen) => {
            if (almacen.idalmacen == parseInt(idbusqueda))
                return almacen;


        }
    );
}
function findByAlmacen(idalmacen) {
    return beanPaginationAlmacen.list.find(
        (almacen) => {
            if (parseInt(idalmacen) == almacen.idalmacen) {
                return almacen;
            }


        }
    );
}