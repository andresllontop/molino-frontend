var beanPaginationArea;
var areaSelected;
var metodo = false;
var beanRequestArea = new BeanRequest();
document.addEventListener('DOMContentLoaded', function () {
    //invocar funcion agregar
    $("#addAreaHtml").detach().appendTo("#drawer-agregarArea");
    addArea();
    //INICIALIZANDO VARIABLES DE SOLICITUD
    beanRequestArea.entity_api = 'api/areas';
    beanRequestArea.operation = 'oficina/paginate';
    beanRequestArea.type_request = 'GET';

    $('#FrmArea').submit(function (event) {
        beanRequestArea.operation = 'oficina/paginate';
        beanRequestArea.type_request = 'GET';
        event.preventDefault();
        event.stopPropagation();
        processAjaxArea();
    });

    $('#FrmAreaModal').submit(function (event) {
        if (metodo) {
            beanRequestArea.operation = 'update';
            beanRequestArea.type_request = 'PUT';
            metodo = false;
        } else {
            //CONFIGURAMOS LA SOLICITUD
            beanRequestArea.operation = 'add';
            beanRequestArea.type_request = 'POST';
        }
        if (validateFormArea()) {
            processAjaxArea();
        }
        event.preventDefault();
        event.stopPropagation();
    });



    $('#sizePageArea').change(function () {
        beanRequestArea.operation = 'oficina/paginate';
        beanRequestArea.type_request = 'GET';
        processAjaxArea();
    });
    document.querySelector("#btnAbrirArea").onclick = () => {
        metodo = false;
        //SET TITLE MODAL
        document.querySelector('#TituloModalArea').innerHTML =
            'REGISTRAR ÁREA';
        addArea();
    };
    document.querySelector("#btnAbrirNewArea").onclick = () => {
        metodo = false;
        document.querySelector('#btnAbrirNewArea').parentElement.parentElement.classList.add("d-md-none");
        document.querySelector('#btnAbrirNewArea').classList.add("d-lg-none");
        document.querySelector('#btnAbrirNewArea').classList.add("d-sm-none");
        //SET TITLE MODAL
        document.querySelector('#TituloModalArea').innerHTML =
            'REGISTRAR ÁREA';
        addArea();
    };
    document.querySelector(".cerrar-area").onclick = () => {
        oficinaSelected = undefined;
        if (document.querySelector("#btnAbrirArea").classList.contains("active")) {
            document.querySelector('#btnAbrirArea').dispatchEvent(new Event('click'));
        }

        addClass(document.querySelector("#listaAreaHtml"), "d-none");
        removeClass(document.querySelector("#OficinaHtml"), "d-none");

    };
});
function addArea(area = undefined) {
    //LIMPIAR LOS CAMPOS
    document.querySelector('#txtNombreArea').value = (area == undefined) ? '' : area.nombre;
    document.querySelector('#txtAbreviaturaArea').value = (area == undefined) ? '' : area.abreviatura;

}

function processAjaxArea() {
    if (circleCargando.loader != null)
        if (circleCargando.loader.classList.contains("active"))
            return showAlertTopEnd('warning', "Se encuentra una solicitud en Proceso, espere que culmine la solicitud.");
    let parameters_pagination = '';
    let json = '';
    if (
        beanRequestArea.operation == 'update' ||
        beanRequestArea.operation == 'add'
    ) {
        circleCargando.container = $(document.querySelector("#FrmAreaModal").parentElement);
        circleCargando.containerOcultar = $(document.querySelector("#FrmAreaModal"));
        circleCargando.createLoader();
        json = {
            nombre: document.querySelector('#txtNombreArea').value,
            abreviatura: document.querySelector('#txtAbreviaturaArea').value,
            oficina: oficinaSelected
        };

    } else {
        circleCargando.containerOcultar = $(document.querySelector("#tbodyArea").parentNode);
        circleCargando.container = $(document.querySelector("#tbodyArea").parentElement.parentElement);
        circleCargando.createLoader();
    }
    circleCargando.toggleLoader("show");
    switch (beanRequestArea.operation) {
        case 'delete':
            parameters_pagination = '/' + areaSelected.idarea;
            break;

        case 'update':
            json.idarea = areaSelected.idarea;
            break;
        case 'add':
            break;

        default:
            if (document.querySelector('#txtFilterArea').value != '') {
                document.querySelector('#pageArea').value = 1;
            }
            parameters_pagination +=
                '?idoficina=' + oficinaSelected.idoficina;
            parameters_pagination +=
                '&nombre=' +
                limpiar_campo(
                    document.querySelector('#txtFilterArea').value
                ).toLowerCase();
            parameters_pagination +=
                '&page=' + document.querySelector('#pageArea').value;
            parameters_pagination +=
                '&size=' + document.querySelector('#sizePageArea').value;
            break;
    }

    var xhr = new XMLHttpRequest();
    xhr = RequestServer(
        beanRequestArea,
        json,
        parameters_pagination,
        circleCargando.loader.firstElementChild
    );
    xhr.addEventListener('load', () => {

        circleCargando.toggleLoader("hide");
        beanCrudResponse = xhr.response;
        if (beanCrudResponse.messageServer !== undefined) {
            if (beanCrudResponse.messageServer.toLowerCase() == 'ok') {
                if (beanRequestArea.operation == "delete") {
                    eliminarlistArea(areaSelected.idarea);
                    toListArea(beanPaginationArea);
                }
                showAlertTopEnd('success', 'Acción realizada exitosamente');
                document.querySelector('#btnAbrirNewArea').dispatchEvent(new Event('click'));

            } else {
                showAlertTopEnd('warning', beanCrudResponse.messageServer);
            }
        }
        if (beanCrudResponse.beanPagination !== undefined) {
            beanPaginationArea = beanCrudResponse.beanPagination;
            toListArea(beanPaginationArea);
        }
        if (beanCrudResponse.classGeneric !== undefined) {
            if (beanRequestArea.operation == 'update') {
                updatelistArea(beanCrudResponse.classGeneric);
                toListArea(beanPaginationArea);
                return;
            }
            beanPaginationArea.list.unshift(beanCrudResponse.classGeneric);
            beanPaginationArea.count_filter++;
            toListArea(beanPaginationArea);
        }
    }, false);
}

function toListArea(beanPagination) {
    document.querySelector('#tbodyArea').innerHTML = '';
    document.querySelector('#titleManagerArea').innerHTML =
        '[ ' + beanPagination.count_filter + ' ] ÁREAS';
    let row;
    row = `
        <div class="dt-widget__item border-success bg-primary text-white mb-0 pb-2"">
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               NOMBRE
            </p>
        </div>
        <!-- Widget Info -->
        <div class="dt-widget__info  " >
            <p class="mb-0  " >
               ABREVIATURA
            </p>
        </div>
        <!-- Widget Extra -->
        <div class="dt-widget__extra">
              ACCIONES
        </div>
    </div>
            `;
    if (beanPagination.count_filter == 0) {
        destroyPagination($('#paginationArea'));
        showAlertTopEnd('warning', 'No se encontraron resultados');
        document.querySelector('#txtFilterArea').focus();
        row += `
    <div class="dt-widget__item  mb-0 pb-2"">
    <!-- Widget Info -->
    <div class="dt-widget__info  text-center" >
        <p class="mb-0  " >
           NO HAY ÁREA
        </p>
    </div>
    <!-- /widget info -->

</div>
        `;
        document.querySelector('#tbodyArea').innerHTML += row;
        return;
    }

    document.querySelector('#tbodyArea').innerHTML += row;
    beanPagination.list.forEach((area) => {
        row = `
            <!-- Widget Item -->
			<div class="dt-widget__item m-0 py-1 pr-3" >

              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${area.nombre}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Info -->
              <div class="dt-widget__info ">
                <p class="dt-widget__subtitle " >
                ${area.abreviatura}
                </p>
              </div>
              <!-- /widget info -->
              <!-- Widget Extra -->
              <div class="dt-widget__extra">
             
                    <!-- Action Button Group -->
                          <div class="action-btn-group">
                          <button
                  idarea='${area.idarea}'
                    type="button"
                    class="btn btn-default text-info dt-fab-btn editar-area"
                    data-toggle="tooltip"
                    data-html="true"
                    title=""
                    data-original-title="<em>Editar</em>"
                  >
                    <i class="icon icon-editors icon-sm pulse-info"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-default text-danger dt-fab-btn eliminar-area" idarea='${area.idarea}'
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
        document.querySelector('#tbodyArea').innerHTML += row;
        $('[data-toggle="tooltip"]').tooltip();
    });
    beanRequestArea.operation = 'oficina/paginate';
    beanRequestArea.type_request = 'GET';
    buildPagination(
        beanPagination.count_filter,
        parseInt(document.querySelector('#sizePageArea').value),
        document.querySelector('#pageArea'),
        processAjaxArea, beanRequestArea,
        $('#paginationArea')
    );
    addEventsAreas();
    if (beanRequestArea.operation == 'oficina/paginate') {
        document.querySelector('#txtFilterArea').focus();
    }

}

function addEventsAreas() {
    document.querySelectorAll('.editar-area').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            areaSelected = findByArea(
                btn.getAttribute('idarea')
            );
            if (areaSelected != undefined) {
                document.querySelector('#btnAbrirNewArea').classList.remove("d-lg-none");

                document.querySelector('#btnAbrirNewArea').classList.remove("d-none");

                document.querySelector('#btnAbrirNewArea').parentElement.parentElement.classList.remove("d-md-none");
                document.querySelector('#btnAbrirNewArea').parentElement.parentElement.style.minHeight = "35px";
                if (document.querySelector('#accionAbrirArea').style.display == "none") {
                    document.querySelector('#btnAbrirArea').dispatchEvent(new Event('click'));

                    document.querySelector('#btnAbrirNewArea').classList.add("d-none");
                }
                metodo = true;
                addArea(areaSelected);
                document.querySelector('#TituloModalArea').innerHTML =
                    'EDITAR ÁREA';
                document.querySelector('#txtNombreArea').focus();
            } else {
                showAlertTopEnd(
                    'warning',
                    'No se encontró el Area para poder editar'
                );
            }
        };
    });

    document.querySelectorAll('.eliminar-area').forEach((btn) => {
        //AGREGANDO EVENTO CLICK
        btn.onclick = function () {
            $('[data-toggle="tooltip"]').tooltip("hide");
            areaSelected = findByArea(
                btn.getAttribute('idarea')
            );
            if (areaSelected == undefined)
                return showAlertTopEnd(
                    'warning',
                    'No se encontró el Area para poder eliminar'
                );
            beanRequestArea.operation = 'delete';
            beanRequestArea.type_request = 'DELETE';
            processAjaxArea();
        };
    });
}

function validateFormArea() {

    let letra = letra_numero_campo(
        document.querySelector('#txtNombreArea'),
        document.querySelector('#txtAbreviaturaArea')
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
                'Por favor ingrese sólo Letras y números al campo ' + letra.labels[0].innerText
            );
        }

        return false;
    }

    if (oficinaSelected == undefined) {
        showAlertTopEnd('info', 'Por favor ingrese Oficina');
        document.querySelector('#txtOficinaProducto').focus();
        return false;
    }

    return true;
}

function eliminarlistArea(idbusqueda) {
    beanPaginationArea.count_filter--;
    beanPaginationArea.list.splice(findIndexArea(parseInt(idbusqueda)), 1);
}

function updatelistArea(classBean) {
    beanPaginationArea.list.splice(findIndexArea(classBean.idarea), 1, classBean);
}

function findIndexArea(idbusqueda) {
    return beanPaginationArea.list.findIndex(
        (area) => {
            if (area.idarea == parseInt(idbusqueda))
                return area;


        }
    );
}

function findByArea(idarea) {
    return beanPaginationArea.list.find(
        (area) => {
            if (parseInt(idarea) == area.idarea) {
                return area;
            }


        }
    );
}