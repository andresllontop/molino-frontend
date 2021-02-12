var beanPaginationUbicacion;
var ubicacionSelected;
var beanRequestUbicacion = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestUbicacion.entity_api = 'api/ubicacion/productos';
    beanRequestUbicacion.operation = 'paginate';
    beanRequestUbicacion.type_request = 'GET';

    $('#FrmUbicacion').submit(function (event) {
        beanRequestUbicacion.operation = 'paginate';
        beanRequestUbicacion.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        document.querySelector('#txtFilterUbicacion').value = limpiar_campo(
            document.querySelector('#txtFilterUbicacion').value
        );
        processAjaxUbicacion();
    });

    processAjaxUbicacion();

    $('#sizePageUbicacion').change(function () {
        beanRequestUbicacion.operation = 'paginate';
        beanRequestUbicacion.type_request = 'GET';
        processAjaxUbicacion();
    });

});


function processAjaxUbicacion() {

    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestUbicacion.operation == 'update' ||
        beanRequestUbicacion.operation == 'add'
    ) {
        json = {
            nombre: document.querySelector('#txtNombreUbicacion').value.trim(),
            direccion: document.querySelector('#txtDireccionUbicacion').value.trim(),
            telefono: parseInt(document.querySelector('#txtTelefonoUbicacion').value.trim()),
            email: document.querySelector('#txtEmailUbicacion').value.trim()
        };
        circleCargando.container = $(document.querySelector("#FrmUbicacionModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmUbicacionModal"));
        circleCargando.createLoader();
    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyUbicacion").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyUbicacion").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestUbicacion.operation) {
        case 'delete':
            parameters_pagination = '/' + ubicacionSelected.idubicacion_producto;
            break;

        case 'update':
            json.idubicacion = ubicacionSelected.idubicacion_producto;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterUbicacion').value != '') {
                document.querySelector('#pageUbicacion').value = 1;
            }
            parameters_pagination +=
                '?nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterUbicacion').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageUbicacion').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageUbicacion').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestUbicacion,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {
        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestUbicacion.operation == "delete") {
                    eliminarlistUbicacion(ubicacionSelected.idubicacion);
                    toListUbicacion(beanPaginationUbicacion);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewUbicacion').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationUbicacion = beanCrudResponse.beanPagination;
            toListUbicacion(beanPaginationUbicacion);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestUbicacion.operation == 'update') {
                updatelistUbicacion(beanCrudResponse.classGeneric);
                toListUbicacion(beanPaginationUbicacion);
                return;
            }
            beanPaginationUbicacion.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationUbicacion.count_filter++;
            toListUbicacion(beanPaginationUbicacion);
        }
    }, false);
}

function toListUbicacion(beanPagination) {
    document.querySelector('#tbodyUbicacion').innerHTML = '';
    document.querySelector('#titleManagerUbicacion').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] Productos en Almacén';
    let row;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationUbicacion'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterUbicacion').focus();
        row = `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY PRODUCTOS EN EL ALMACEN
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyUbicacion').innerHTML += row;
        return;
    }


    beanPagination.list.forEach((presentacion) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 " >
              <!-- Widget Info -->
              <div class="dt-widget__info " >
                <p class="dt-widget__subtitle ">
                ${presentacion.ubicacion_producto.cliente.apellido + " " + presentacion.ubicacion_producto.cliente.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle ">
                ${presentacion.ubicacion_producto.producto.descripcion}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${presentacion.ubicacion_producto.codigo}
                </p>
              </div>
              <!-- /widget info -->
              
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle ">
                ${presentacion.ubicacion_producto.almacen.nombre}
                </p>
              </div>
              <!-- /widget info -->
            
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
                
                 <!-- Action Button Group -->
                    <div class="action-btn-group">
                          <button
                          idubicacionproducto='${presentacion.ubicacion_producto.idubicacion_producto}'
                    type="button"
                    class="btn btn-warning dt-fab-btn editar-idubicacionproducto"
                    
                  >
                    <i class="icon icon-metrics icon-sm pulse-light"></i>
                  </button>
                 
                          </div>
                          <!-- /action button group -->
                        <!-- /hide content -->
                      </div>

            </div>
            <!-- /widgets item -->
            `;
        document.querySelector('#tbodyUbicacion').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageUbicacion').value),
        document.querySelector('#pageUbicacion'),
        processAjaxUbicacion, beanRequestUbicacion,
        $('#paginationUbicacion')
    );
    addEventsUbicacions();
    if (beanRequestUbicacion.operation == 'paginate') {
        document.querySelector('#txtFilterUbicacion').focus();
    } else {
        document.querySelector('#txtNombreUbicacion').focus();
    }

}

function addEventsUbicacions() {
    document.querySelectorAll('.editar-idubicacionproducto').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            ubicacionSelected = findByUbicacion(
                btn.getAttribute('idubicacionproducto')
            );
            if (ubicacionSelected != undefined) {
                displayUbicacion("hide");
                document.querySelector('#FrmInventario').dispatchEvent(new Event('submit'));

            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró el Ubicacion para poder editar'
                );
            }
        };
    });

}

function findByUbicacion(idubicacion_producto) {
    return beanPaginationUbicacion.list.find(
        (presentacion) => {
            if (parseInt(idubicacion_producto) == presentacion.ubicacion_producto.idubicacion_producto) {
                return presentacion;
            }


        }
    );
}

function eliminarlistUbicacion(idbusqueda) {

    beanPaginationUbicacion.count_filter--;
    beanPaginationUbicacion.list.splice(findIndexUbicacion(parseInt(idbusqueda)), 1);
}

function updatelistUbicacion(classBean) {
    beanPaginationUbicacion.list.splice(findIndexUbicacion(classBean.idubicacion), 1, classBean);
}

function findIndexUbicacion(idbusqueda) {
    return beanPaginationUbicacion.list.findIndex(
        (ubicacion) => {
            if (ubicacion.idubicacion == parseInt(idbusqueda))
                return ubicacion;


        }
    );
}

var displayUbicacion = (display = "hide") => {

    if (display == "show") {
        removeClass(document.querySelector("#listUbicacionHtml"), "d-none");
        addClass(document.querySelector("#listInventarioHtml"), "d-none");

    } else {
        removeClass(document.querySelector("#listInventarioHtml"), "d-none");
        addClass(document.querySelector("#listUbicacionHtml"), "d-none");

    }

}